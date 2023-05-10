import { useRouter } from 'next/router';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';

import { Notice } from '../../../modular/alerts/Notice';
import { Button } from '../../../modular/forms/buttons/Button';
import { TextField } from '../../../modular/forms/TextField';
import PortalSVG from '../../svg/PortalSvg';
import { confirmOtpCode } from './OtpConfirm';
import { getCountDown } from './OtpCountDown';
import { requestOtpCode } from './OtpRequest';
import { passSlipAction } from '../../../../../src/types/approvals.type';
import { useApprovalStore } from '../../../../../src/store/approvals.store';
import { patchPortal } from '../../../../../src/utils/helpers/portal-axios-helper';
import { Dialog, Transition } from '@headlessui/react';

interface OtpProps {
  mobile: string;
  employeeId: string;
  passSlipAction: string;
  passSlipid: string;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
}

export const OtpPassSlipModal: FunctionComponent<OtpProps> = ({
  mobile,
  employeeId,
  passSlipAction,
  passSlipid,
  modalState,
  setModalState,
  closeModalAction,
  ...props
}) => {
  const router = useRouter();
  const [otpFieldError, setOtpFieldError] = useState<boolean>(false);
  const [otpComplete, setOtpComplete] = useState<boolean>(false);
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false); //true if trying to get otp code from api
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false); //true if otp is received and waiting to be entered for verification
  const [otpCode, setOtpCode] = useState<string>(null);
  const [otpToken, setOtpToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countingDown, setCountingDown] = useState<boolean>(false);
  const [failedFirstOtp, setFailedFirstOtp] = useState<boolean>(false);
  const [currentOtp, setCurrentOtp] = useState<string>(null);

  const {
    passSlip,
    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
    setPendingPassSlipModalIsOpen,
  } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
  }));

  // set state for controlling the displaying of error status
  const [isError, setIsError] = useState({
    status: false,
    message: '',
    animate: false,
  });

  useEffect(() => {
    setCurrentOtp(localStorage.getItem(`passSlipOtpEndTime_${passSlipid}`));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(`passSlipOtpEndTime_${passSlipid}`)) {
      console.log('no otp found');
      setOtpFieldError(false);
      setIsSubmitLoading(false);
      setWiggleEffect(false);
      setErrorMessage('');
      setIsSendOtpLoading(false);
      setIsOtpSending(false);
      setCountingDown(false);
    } else {
      setOtpFieldError(false);
      setIsSubmitLoading(false);
      setWiggleEffect(false);
      setErrorMessage('');
      setIsSendOtpLoading(true);
      setIsOtpSending(false);
      setCountingDown(true);
    }
  }, [passSlipid]);

  useEffect(() => {
    if (localStorage.getItem(`passSlipOtpEndTime_${passSlipid}`)) {
      setCountingDown(true);
      setIsSendOtpLoading(true);
    } else {
      //nothing to do
    }
  }, [isSendOtpLoading]);

  //COMPUTATION OF TIME REMAINING FOR OTP - GET FROM COMPONENT
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = getCountDown(passSlipid, countingDown); //start countdown
      if (data) {
        setMinutes(data.minutes);
        setSeconds(data.seconds);
        //TERMINATE OTP COUNTDOWN IF ALL ARE 0
        if (
          data.days <= 0 &&
          data.hours <= 0 &&
          data.minutes <= 0 &&
          data.seconds <= 0
        ) {
          setCountingDown(false);
          localStorage.removeItem(`passSlipOtpEndTime_${data.id}`); //delete otp expiration local storage
          localStorage.removeItem(`passSlipOtpToken_${data.id}`); //delete otp expiration local storage
          setIsSendOtpLoading(false); //close loading circle animation and countdown
          setFailedFirstOtp(true); // set to true if first OTP failed and will show "Resend Code" instead
          setMinutes(5);
          setSeconds(0);
          setOtpFieldError(false); //disable error mode of input field
          setErrorMessage('');
          setOtpCode(null); //clears input field
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countingDown]);

  //REQUEST OTP CODE
  async function handleSendCode() {
    setIsOtpSending(true); //shows blue circle animation also
    setOtpFieldError(false);
    const data = await requestOtpCode(mobile, passSlipid);
    if (data) {
      setOtpFieldError(data.otpFieldError);
      setIsSubmitLoading(data.isSubmitLoading);
      setWiggleEffect(data.wiggleEffect);
      setErrorMessage(data.errorMessage);
      setIsSendOtpLoading(data.isSendOtpLoading);
      setIsOtpSending(data.isOtpSending);
      setCountingDown(data.countingDown);
    }
  }

  //CANCEL BUTTON IN THE OTP WINDOW
  const handleCancel = (e: any) => {
    e.preventDefault();
    if (isSubmitLoading == false) {
      setModalState(false);
    }
  };

  //UPDATE OTP VALUE FIELD
  const handleOtpInput = (e: string) => {
    setOtpCode(e);
  };

  const handlePatchResult = async (data: passSlipAction) => {
    const { error, result } = await patchPortal('/v1/pass-slip', data);
    console.log(result);
    if (error) {
      patchPassSlipFail(result);
    } else {
      patchPassSlipSuccess(result);
      setPendingPassSlipModalIsOpen(false);
    }
    setOtpComplete(false);
  };

  useEffect(() => {
    if (otpComplete) {
      const data = {
        passSlipId: passSlipid,
        status: passSlipAction,
      };
      patchPassSlip();
      handlePatchResult(data);

      localStorage.removeItem(`passSlipOtpToken_${passSlipid}`);
      localStorage.removeItem(`passSlipOtpEndTime_${passSlipid}`);
    } else {
      //nothing to do
    }
  }, [otpComplete]);

  // SUBMIT OTP CODE AND COMPLETE PASS SLIP APPROVAL/DISAPPROVAL IF CORRECT
  async function handleFinalSubmit(e: any) {
    e.preventDefault();
    setIsSubmitLoading(true);

    const data = await confirmOtpCode(otpCode, passSlipid);
    if (data) {
      setOtpFieldError(data.otpFieldError);
      setIsSubmitLoading(data.isSubmitLoading);
      setWiggleEffect(data.wiggleEffect);
      setErrorMessage(data.errorMessage);
      setOtpComplete(data.otpComplete);
    } else {
      setOtpFieldError(true);
      setIsSubmitLoading(false);
      setWiggleEffect(true);
      setErrorMessage('Confirm Failed');
      setOtpComplete(false);
    }
  }

  return (
    <>
      <Transition appear show={modalState} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => setModalState(isSubmitLoading ? true : false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                  <div className={`w-100 relative bg-white rounded max-w-sm`}>
                    <Dialog.Title className="flex items-center justify-center w-full h-12 px-10 py-8 font-bold text-center text-white bg-indigo-600">
                      PASS SLIP ACTION
                    </Dialog.Title>
                    <>
                      {!otpComplete ? (
                        <>
                          <div className="flex flex-col p-8 gap-1 h-90 justify-center items-center text-sm">
                            <div className="mb-2 text-center">
                              To approve this Pass Slip request, click Send Code
                              and enter the code sent to your mobile number:{' '}
                              {mobile}. Pass Slip Id: {passSlipid}
                            </div>
                            <div
                              className={`${
                                isOtpSending
                                  ? 'mb-4 text-center text-green-600 cursor-pointer text-md'
                                  : 'hidden'
                              } `}
                            >
                              <PortalSVG.AnimationBlueLoading
                                width={28}
                                height={28}
                                className={`absolute -mt-1 -ml-8`}
                              />
                              <label className={``}>Sending Code</label>
                            </div>

                            <div
                              className={`${
                                isOtpSending || isSendOtpLoading
                                  ? 'hidden'
                                  : ' mb-4 text-center text-green-600 cursor-pointer text-md'
                              }`}
                              onClick={() => handleSendCode()}
                            >
                              <label
                                className={`${
                                  failedFirstOtp ? 'hidden ' : 'cursor-pointer'
                                }`}
                              >
                                Send Code
                              </label>
                              <label
                                className={`${
                                  failedFirstOtp ? 'cursor-pointer' : 'hidden'
                                }`}
                              >
                                Resend Code
                              </label>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <PortalSVG.AnimationBlueLoading
                                width={120}
                                height={120}
                                className={`${
                                  isSendOtpLoading ? '' : 'hidden'
                                } -mt-1 my-2`}
                              />
                              <label
                                className={`${
                                  isSendOtpLoading ? '' : 'hidden'
                                } absolute -mt-1 my-2 text-red-700 font-bold`}
                              >
                                {minutes}:{seconds}
                              </label>
                            </div>

                            <form
                              onSubmit={(e) => handleFinalSubmit(e)}
                              className="flex flex-col gap-1"
                            >
                              {otpFieldError && (
                                <section
                                  className="mb-3"
                                  onAnimationEnd={() =>
                                    setIsError({ ...isError, animate: false })
                                  }
                                >
                                  <Notice
                                    type="error"
                                    message={errorMessage}
                                    animate={otpFieldError}
                                  />
                                </section>
                              )}
                              <section
                                className={`${
                                  otpFieldError ? 'space-y-5' : 'space-y-3'
                                }`}
                              >
                                <TextField
                                  value={otpCode}
                                  type="text"
                                  placeholder="Enter Code"
                                  isError={otpFieldError ? true : false}
                                  errorMessage={''}
                                  maxLength={6}
                                  onChange={(e) =>
                                    handleOtpInput(
                                      e.target.value as unknown as string
                                    )
                                  }
                                />
                              </section>
                              <button
                                disabled={
                                  isSubmitLoading == true ? true : false
                                }
                                className={`${
                                  wiggleEffect && 'animate-shake'
                                }  ${
                                  isSubmitLoading == true
                                    ? 'cursor-not-allowed'
                                    : ''
                                }  text-white w-full h-10 transition-all rounded my-2 hover:bg-indigo-600 active:bg-indigo-600 outline-blue-500 ${
                                  wiggleEffect
                                    ? 'bg-rose-600 hover:bg-rose-600'
                                    : 'bg-indigo-500'
                                }`}
                                type="submit"
                                onAnimationEnd={() => setWiggleEffect(false)}
                              >
                                <PortalSVG.AnimationBlueLoading
                                  width={30}
                                  height={30}
                                  className={`${
                                    isSubmitLoading ? '' : 'hidden'
                                  } absolute -mt-1`}
                                />
                                <label
                                  className={`${
                                    isSubmitLoading
                                      ? 'cursor-not-allowed pointer-events-none'
                                      : 'hidden'
                                  } `}
                                >
                                  Verifying
                                </label>
                                <label
                                  className={`${
                                    isSubmitLoading
                                      ? 'hidden'
                                      : 'cursor-pointer pointer-events-none'
                                  } `}
                                >
                                  Submit
                                </label>
                              </button>

                              <Button
                                disabled={
                                  isSubmitLoading == true ? true : false
                                }
                                btnLabel="Cancel"
                                variant="danger"
                                className={`${
                                  isSubmitLoading == true
                                    ? 'cursor-not-allowed'
                                    : ''
                                } mb-2 `}
                                onClick={(e) => handleCancel(e)}
                              />
                            </form>
                          </div>
                        </>
                      ) : null}

                      {otpComplete ? (
                        <>
                          <div
                            className={
                              'flex flex-col p-4 gap-1 justify-center items-center text-md'
                            }
                          >
                            <div className="text-center text-sm">
                              OTP Verified Successfully!
                            </div>
                            <div className="text-center text-sm mb-4">
                              Pass Slip action has been submitted.
                            </div>

                            <Button
                              btnLabel="Close"
                              variant="primary"
                              className={`${
                                isSubmitLoading == true
                                  ? 'cursor-not-allowed'
                                  : 'w-full'
                              } `}
                              onClick={(e) => closeModalAction()}
                            />
                          </div>
                        </>
                      ) : null}
                    </>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
