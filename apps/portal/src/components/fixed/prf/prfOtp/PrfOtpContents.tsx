/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { Notice } from '../../../modular/alerts/Notice';
import { Button } from '../../../modular/forms/buttons/Button';
import PortalSVG from '../../svg/PortalSvg';
import { getCountDown } from '../../otp-requests/OtpCountDown';
import { requestOtpCode } from '../../otp-requests/OtpRequest';
import { confirmOtpCode } from '../../otp-requests/OtpConfirm';
import { patchPrfRequest } from '../../../../utils/helpers/prf.requests';
import { PrfStatus } from '../../../../types/prf.types';
import { usePrfStore } from '../../../../../src/store/prf.store';
import AuthCode from 'react-auth-code-input';

interface OtpProps {
  mobile: string;
  employeeId: string;
  action: string; // approve or disapprove
  tokenId: string; //like prf Id
  otpName: string;
  remarks?: string;
}

export const PrfOtpContents: FunctionComponent<OtpProps> = ({
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

  // set state for controlling the displaying of error status
  const [isError, setIsError] = useState({
    status: false,
    message: '',
    animate: false,
  });

  const { patchPrf, patchPrfSuccess, patchPrfFail, setPrfOtpModalIsOpen, setForApprovalPrfModalIsOpen } = usePrfStore(
    (state) => ({
      setPrfOtpModalIsOpen: state.setPrfOtpModalIsOpen,
      setForApprovalPrfModalIsOpen: state.setForApprovalPrfModalIsOpen,
      patchPrf: state.patchPrf,
      patchPrfSuccess: state.patchPrfSuccess,
      patchPrfFail: state.patchPrfFail,
    })
  );

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
  const handleCancel = (e: any) => {
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
      setPrfOtpModalIsOpen(false);
    }
  };

  //CLOSE FUNCTION FOR COMPLETED OTP
  const handleClose = (e: any) => {
    e.preventDefault();
    setPrfOtpModalIsOpen(false); //close OTP modal first
    setTimeout(() => {
      setForApprovalPrfModalIsOpen(false);
    }, 200);
  };

  //UPDATE OTP VALUE FIELD
  const handleOtpInput = (e: string) => {
    setOtpCode(e);
  };

  // useEffect(() => {
  //   if (otpComplete) {
  //     //remove otp tokens
  //     localStorage.removeItem(`${otpName}OtpToken_${tokenId}`);
  //     localStorage.removeItem(`${otpName}OtpEndTime_${tokenId}`);
  //   } else {
  //     //nothing to do
  //   }
  // }, [otpComplete]);

  // SUBMIT OTP CODE AND COMPLETE PRF APPROVAL/DISAPPROVAL IF CORRECT
  async function handleFinalSubmit(e: any) {
    e.preventDefault();
    setIsSubmitLoading(true);
    patchPrf();
    const data = await confirmOtpCode(otpCode, tokenId, otpName);
    if (data) {
      const { error, result } = await patchPrfRequest(`/prf-trail/${tokenId}`, {
        status: PrfStatus.APPROVED,
        employeeId: employeeId,
        remarks: remarks,
      });

      //check if there's an error in otp confirmation
      if (data.errorMessage) {
        setOtpFieldError(data.otpFieldError);
        setIsSubmitLoading(data.isSubmitLoading);
        setWiggleEffect(data.wiggleEffect);
        setErrorMessage(data.errorMessage);
        setOtpComplete(data.otpComplete);
      } else {
        if (error) {
          // request is done set loading to false and set the error message
          patchPrfFail(result);
          setOtpFieldError(true);
          setIsSubmitLoading(data.isSubmitLoading);
          setWiggleEffect(true);
          setErrorMessage(result); // show error message here
          setOtpComplete(false);
        } else if (!error) {
          // request is done set loading to false and set the update response
          patchPrfSuccess(result);
          setOtpFieldError(data.otpFieldError);
          setIsSubmitLoading(data.isSubmitLoading);
          setWiggleEffect(data.wiggleEffect);
          setErrorMessage(data.errorMessage);
          setOtpComplete(data.otpComplete);
          localStorage.removeItem(`${otpName}OtpToken_${tokenId}`);
          localStorage.removeItem(`${otpName}OtpEndTime_${tokenId}`);
        }
      }
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
                action === 'approved' ? 'approve' : 'disapprove'
              } this Position Request, click Send Code and enter the code sent to your mobile number: ${mobile}. `}
            </div>
            {isOtpSending ? (
              <div className={`mb-4 text-center text-green-600 cursor-pointer text-md`}>
                <PortalSVG.AnimationBlueLoading width={28} height={28} className={`absolute -mt-1 -ml-8`} />
                <label className={``}>Sending Code</label>
              </div>
            ) : null}

            {isOtpSending || isSendOtpLoading ? null : (
              //used regular button tag to go along with wiggle effect
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
                <form onSubmit={(e) => handleFinalSubmit(e)} className="flex flex-col gap-1">
                  {otpFieldError && (
                    <section className="mb-3" onAnimationEnd={() => setIsError({ ...isError, animate: false })}>
                      <Notice type="error" message={errorMessage} animate={otpFieldError} />
                    </section>
                  )}
                  <section className={`${otpFieldError ? 'space-y-5' : 'space-y-3'}`}>
                    {/* <TextField
                      autoFocus
                      value={otpCode}
                      type="text"
                      placeholder="Enter Code"
                      isError={otpFieldError ? true : false}
                      errorMessage={''}
                      maxLength={6}
                      onChange={(e) => handleOtpInput(e.target.value as unknown as string)}
                    /> */}
                    <AuthCode
                      allowedCharacters="numeric"
                      onChange={handleOtpInput}
                      containerClassName="flex gap-3 flex-row justify-between items-center"
                      inputClassName={`w-7 rounded border-indigo-500 font-bold text-lg ${
                        otpFieldError ? 'border-red-500' : ''
                      } px-0 text-center`}
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
            <div className="text-center text-sm mb-4">Position Request has been {action}.</div>

            <Button
              btnLabel="CLOSE"
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
