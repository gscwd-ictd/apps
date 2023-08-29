/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { Notice } from '../../../modular/alerts/Notice';
import { Button } from '../../../modular/forms/buttons/Button';
import { TextField } from '../../../modular/forms/TextField';
import PortalSVG from '../../svg/PortalSvg';
import { leaveAction } from '../../../../types/approvals.type';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { getCountDown } from '../../otp-requests/OtpCountDown';
import { requestOtpCode } from '../../otp-requests/OtpRequest';
import { confirmOtpCode } from '../../otp-requests/OtpConfirm';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';

interface OtpProps {
  mobile: string;
  employeeId: string;
  action: LeaveStatus; // approve or disapprove
  tokenId: string; //like LEAVE Id, leave Id etc.
  otpName: string;
  remarks?: string;
}

export const ApprovalOtpContentsLeave: FunctionComponent<OtpProps> = ({
  mobile,
  employeeId,
  action,
  tokenId,
  otpName,
  remarks,
  ...props
}) => {
  const [otpFieldError, setOtpFieldError] = useState<boolean>(false);
  const [otpComplete, setOtpComplete] = useState<boolean>(false);
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false); //true if trying to get otp code from api
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false); //true if otp is received and waiting to be entered for verification
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countingDown, setCountingDown] = useState<boolean>(false);
  const [failedFirstOtp, setFailedFirstOtp] = useState<boolean>(false);

  const { patchLeave, patchLeaveSuccess, patchLeaveFail, setPendingLeaveModalIsOpen, setOtpLeaveModalIsOpen } =
    useFinalLeaveApprovalStore((state) => ({
      patchLeave: state.patchLeave,
      patchLeaveSuccess: state.patchLeaveSuccess,
      patchLeaveFail: state.patchLeaveFail,
      setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
      setOtpLeaveModalIsOpen: state.setOtpLeaveModalIsOpen,
    }));

  // set state for controlling the displaying of error status
  const [isError, setIsError] = useState({
    status: false,
    message: '',
    animate: false,
  });

  useEffect(() => {
    if (!localStorage.getItem(`${otpName}OtpEndTime_${tokenId}`)) {
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
  }, [tokenId]);

  useEffect(() => {
    if (localStorage.getItem(`${otpName}OtpEndTime_${tokenId}`)) {
      setCountingDown(true);
      setIsSendOtpLoading(true);
    } else {
      //nothing to do
    }
  }, [isSendOtpLoading]);

  //COMPUTATION OF TIME REMAINING FOR OTP - GET FROM COMPONENT
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = getCountDown(tokenId, countingDown, otpName); //start countdown
      if (data) {
        setMinutes(data.minutes);
        setSeconds(data.seconds);
        //TERMINATE OTP COUNTDOWN IF ALL ARE 0
        if (data.days <= 0 && data.hours <= 0 && data.minutes <= 0 && data.seconds <= 0) {
          setCountingDown(false);
          localStorage.removeItem(`${otpName}OtpEndTime_${data.id}`); //delete otp expiration local storage
          localStorage.removeItem(`${otpName}OtpToken_${data.id}`); //delete otp expiration local storage
          setIsSendOtpLoading(false); //close loading circle animation and countdown
          setFailedFirstOtp(true); // set to true if first OTP failed and will show "Resend Code" instead
          setMinutes(5);
          setSeconds(0);
          setOtpFieldError(false); //disable error mode of input field
          setErrorMessage('');
          setOtpCode(''); //clears input field
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countingDown]);

  //REQUEST OTP CODE
  async function handleSendCode() {
    setIsOtpSending(true); //shows blue circle animation also
    setOtpFieldError(false);
    const data = await requestOtpCode(mobile, tokenId, otpName);
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
  const handleCancel = (e) => {
    e.preventDefault();
    setCountingDown(false);
    localStorage.removeItem(`${otpName}OtpEndTime_${tokenId}`); //delete otp expiration local storage
    localStorage.removeItem(`${otpName}OtpToken_${tokenId}`); //delete otp expiration local storage
    setIsSendOtpLoading(false); //close loading circle animation and countdown
    setFailedFirstOtp(false); // set to true if first OTP failed and will show "Resend Code" instead
    setMinutes(5);
    setSeconds(0);
    setOtpFieldError(false); //disable error mode of input field
    setErrorMessage('');
    setOtpCode(''); //clears input field
    if (isSubmitLoading == false) {
      setOtpLeaveModalIsOpen(false);
    }
  };

  //CLOSE FUNCTION FOR COMPLETED OTP
  const handleClose = (e) => {
    e.preventDefault();
    setOtpLeaveModalIsOpen(false); //close OTP modal first
    setTimeout(() => {
      setPendingLeaveModalIsOpen(false); //then close LEAVE modal
    }, 200);
  };

  //UPDATE OTP VALUE FIELD
  const handleOtpInput = (e: string) => {
    setOtpCode(e);
  };

  const handlePatchResult = async (data: leaveAction) => {
    const { error, result } = await patchPortal('/v1/leave/hrdm', data);
    if (error) {
      patchLeaveFail(result);
    } else {
      patchLeaveSuccess(result);
    }
  };

  useEffect(() => {
    if (otpComplete) {
      const data = {
        id: tokenId,
        status: action,
        hrdmDisapprovalRemarks: remarks,
      };
      localStorage.removeItem(`${otpName}OtpToken_${tokenId}`);
      localStorage.removeItem(`${otpName}OtpEndTime_${tokenId}`);
      patchLeave();
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  }, [otpComplete]);

  // SUBMIT OTP CODE AND COMPLETE LEAVE APPROVAL/DISAPPROVAL IF CORRECT
  async function handleFinalSubmit(e) {
    e.preventDefault();
    setIsSubmitLoading(true);

    const data = await confirmOtpCode(otpCode, tokenId, otpName);
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
      {!otpComplete ? (
        <>
          <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm">
            <div className="mb-2 text-center">
              {`To ${
                action === LeaveStatus.FOR_HRDM_APPROVAL ? 'approve' : 'disapprove'
              } this Leave request, click Send Code
                              and enter the code sent to your mobile number:
                              ${mobile}. `}
            </div>
            {isOtpSending ? (
              <div className={`mb-4 text-center text-green-600 cursor-pointer text-md`}>
                <PortalSVG.AnimationBlueLoading width={28} height={28} className={`absolute -mt-1 -ml-8`} />
                <label className={``}>Sending Code</label>
              </div>
            ) : null}

            {isOtpSending || isSendOtpLoading ? null : (
              // <Button
              //   btnLabel={`${failedFirstOtp ? 'RESEND CODE ' : 'SEND CODE'}`}
              //   variant="primary"
              //   className="font-bold mb-2"

              // />
              <button
                disabled={isSubmitLoading == true ? true : false}
                className={`${
                  isSubmitLoading == true ? 'cursor-not-allowed' : ''
                } mb-2 text-white bg-indigo-500 h-10 transition-all rounded hover:bg-indigo-600 active:bg-indigo-600 outline-indigo-500 w-56`}
                onClick={() => handleSendCode()}
              >
                <label className="font-bold cursor-pointer">{`${failedFirstOtp ? 'RESEND CODE ' : 'SEND CODE'}`}</label>
              </button>
            )}

            {isSendOtpLoading ? (
              <div className="flex flex-col justify-center items-center">
                <PortalSVG.AnimationBlueLoading width={120} height={120} className={`-mt-1 my-2`} />
                <label className={`absolute -mt-1 my-2 text-red-700 font-bold`}>
                  {minutes}:{seconds}
                </label>
              </div>
            ) : null}

            {isOtpSending || isSendOtpLoading ? (
              <>
                <form onSubmit={(e) => handleFinalSubmit(e)} className="flex flex-col gap-1 w-56">
                  {otpFieldError && (
                    <section className="mb-3" onAnimationEnd={() => setIsError({ ...isError, animate: false })}>
                      <Notice type="error" message={errorMessage} animate={otpFieldError} />
                    </section>
                  )}
                  <section className={`${otpFieldError ? 'space-y-5' : 'space-y-3'}`}>
                    <TextField
                      autoFocus
                      value={otpCode}
                      type="text"
                      placeholder="Enter Code"
                      isError={otpFieldError ? true : false}
                      errorMessage={''}
                      maxLength={6}
                      onChange={(e) => handleOtpInput(e.target.value as unknown as string)}
                    />
                  </section>
                  <button
                    disabled={isSubmitLoading == true ? true : false}
                    className={`${wiggleEffect && 'animate-shake'}  ${
                      isSubmitLoading == true ? 'cursor-not-allowed' : ''
                    }  text-white w-56 h-10 transition-all rounded my-2 hover:bg-indigo-600 active:bg-indigo-600 outline-blue-500 ${
                      wiggleEffect ? 'bg-rose-600 hover:bg-rose-600' : 'bg-indigo-500'
                    }`}
                    type="submit"
                    onAnimationEnd={() => setWiggleEffect(false)}
                  >
                    <PortalSVG.AnimationBlueLoading
                      width={30}
                      height={30}
                      className={`${isSubmitLoading ? '' : 'hidden'} absolute -mt-1`}
                    />
                    <label
                      className={`${isSubmitLoading ? 'cursor-not-allowed pointer-events-none font-bold' : 'hidden'} `}
                    >
                      VERIFYING
                    </label>
                    <label
                      className={`${isSubmitLoading ? 'hidden' : 'cursor-pointer pointer-events-none font-bold'} `}
                    >
                      CONFIRM OTP
                    </label>
                  </button>
                </form>
              </>
            ) : null}
            <button
              disabled={isSubmitLoading == true ? true : false}
              className={`${
                isSubmitLoading == true ? 'cursor-not-allowed' : ''
              }  mb-2 text-white bg-red-500 h-10 transition-all rounded hover:bg-red-600 active:bg-red-600 outline-red-500 w-56`}
              onClick={(e) => handleCancel(e)}
            >
              <label className="font-bold cursor-pointer">CANCEL OTP</label>
            </button>
          </div>
        </>
      ) : null}

      {otpComplete ? (
        <>
          <div className={'flex flex-col p-4 gap-1 justify-center items-center text-md'}>
            <div className="text-center text-sm">OTP Verified Successfully!</div>
            <div className="text-center text-sm mb-4">Leave has been approved.</div>

            <Button
              btnLabel="Close"
              variant="primary"
              className={`${isSubmitLoading == true ? 'cursor-not-allowed' : 'w-full'} `}
              onClick={(e) => handleClose(e)}
            />
          </div>
        </>
      ) : null}
    </>
  );
};
