/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { Notice } from '../../../modular/alerts/Notice';
import { Button } from '../../../modular/forms/buttons/Button';
import PortalSVG from '../../svg/PortalSvg';
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { getCountDown } from '../../otp-requests/OtpCountDown';
import { requestOtpCode } from '../../otp-requests/OtpRequest';
import { confirmOtpCode } from '../../otp-requests/OtpConfirm';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import AuthCode from 'react-auth-code-input';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';

interface OtpProps {
  mobile: string;
  employeeId?: string;
  actionOvertime?: OvertimeStatus; // approve or disapprove for overtime
  actionLeave?: LeaveStatus; // approve or disapprove for leave
  actionPassSlip?: PassSlipStatus; // approve or disapprove pass slip
  actionDtrCorrection?: DtrCorrectionStatus; // approve or disapprove time log correction
  tokenId: string; //like pass Slip Id, leave Id etc.
  otpName: ManagerOtpApproval;
  remarks?: string;
  passSlipId?: string;
  supervisorDisapprovalRemarks?: string; //for supervisor disapproval for leave
  hrdmDisapprovalRemarks?: string; //for hrdm disapproval for leave
}

export const ApprovalOtpContents: FunctionComponent<OtpProps> = ({
  mobile,
  employeeId,
  actionOvertime,
  actionLeave,
  actionPassSlip,
  actionDtrCorrection,
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

  const {
    patchOvertime,
    patchOvertimeSuccess,
    patchOvertimeFail,
    setPendingOvertimeModalIsOpen,
    setOtpOvertimeModalIsOpen,

    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    setPendingLeaveModalIsOpen,
    setOtpLeaveModalIsOpen,

    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
    setPendingPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen,

    patchDtrCorrection,
    patchDtrCorrectionSuccess,
    patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen,
  } = useApprovalStore((state) => ({
    patchOvertime: state.patchOvertime,
    patchOvertimeSuccess: state.patchOvertimeSuccess,
    patchOvertimeFail: state.patchOvertimeFail,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setOtpOvertimeModalIsOpen: state.setOtpOvertimeModalIsOpen,

    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setOtpLeaveModalIsOpen: state.setOtpLeaveModalIsOpen,

    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,

    patchDtrCorrection: state.patchDtrCorrection,
    patchDtrCorrectionSuccess: state.patchDtrCorrectionSuccess,
    patchDtrCorrectionFail: state.patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen: state.setDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen: state.setOtpDtrCorrectionModalIsOpen,
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
      setOtpOvertimeModalIsOpen(false);
      setOtpLeaveModalIsOpen(false);
      setOtpPassSlipModalIsOpen(false);
      setOtpDtrCorrectionModalIsOpen(false); //close OTP modal first
    }
  };

  //CLOSE FUNCTION FOR COMPLETED OTP
  const handleClose = (e) => {
    e.preventDefault();
    setOtpOvertimeModalIsOpen(false); //close OTP modal first
    setOtpPassSlipModalIsOpen(false); //close OTP modal first
    setOtpLeaveModalIsOpen(false); //close OTP modal first
    setOtpDtrCorrectionModalIsOpen(false); //close OTP modal first
    setTimeout(() => {
      setPendingOvertimeModalIsOpen(false); //then close Pass Slip modal
      setPendingPassSlipModalIsOpen(false); //then close Pass Slip modal
      setPendingLeaveModalIsOpen(false); //then close Pass Slip modal
      setDtrCorrectionModalIsOpen(false);
    }, 200);
  };

  const handlePatchResultOtp = async (data) => {
    let otpPatchUrl;

    if (otpName === ManagerOtpApproval.LEAVE) {
      otpPatchUrl = '/v1/leave/supervisor';
    } else if (otpName === ManagerOtpApproval.PASSSLIP) {
      otpPatchUrl = '/v1/pass-slip';
    } else if (otpName === ManagerOtpApproval.OVERTIME) {
      otpPatchUrl = '/v1/overtime/approval';
    } else if (otpName === ManagerOtpApproval.DTRCORRECTION) {
      otpPatchUrl = '/v1/dtr-correction';
    }

    const { error, result } = await patchPortal(otpPatchUrl, data);
    if (error) {
      if (otpName === ManagerOtpApproval.LEAVE) {
        patchLeaveFail(result);
      } else if (otpName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipFail(result);
      } else if (otpName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeFail(result);
      } else if (otpName === ManagerOtpApproval.DTRCORRECTION) {
        patchDtrCorrectionFail(result);
      }
    } else {
      if (otpName === ManagerOtpApproval.LEAVE) {
        patchLeaveSuccess(result);
      } else if (otpName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipSuccess(result);
      } else if (otpName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeSuccess(result);
      } else if (otpName === ManagerOtpApproval.DTRCORRECTION) {
        patchDtrCorrectionSuccess(result);
      }
    }
  };

  useEffect(() => {
    if (otpComplete) {
      let data;

      if (otpName === ManagerOtpApproval.LEAVE) {
        data = {
          id: tokenId,
          status: actionLeave,
          supervisorDisapprovalRemarks: remarks,
        };
        patchLeave();
      } else if (otpName === ManagerOtpApproval.PASSSLIP) {
        data = {
          passSlipId: tokenId,
          status: actionPassSlip,
        };
        patchPassSlip();
      } else if (otpName === ManagerOtpApproval.OVERTIME) {
        data = {
          managerId: employeeId,
          remarks: remarks,
          status: actionOvertime,
          overtimeApplicationId: tokenId,
        };
        patchOvertime();
      } else if (otpName === ManagerOtpApproval.DTRCORRECTION) {
        data = {
          id: tokenId,
          status: actionDtrCorrection,
        };
        patchDtrCorrection();
      }

      localStorage.removeItem(`${otpName}OtpToken_${tokenId}`);
      localStorage.removeItem(`${otpName}OtpEndTime_${tokenId}`);

      handlePatchResultOtp(data);
    } else {
      //nothing to do
    }
  }, [otpComplete]);

  // SUBMIT OTP CODE AND COMPLETE PASS SLIP APPROVAL/DISAPPROVAL IF CORRECT
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
              {otpName === ManagerOtpApproval.LEAVE
                ? `To ${
                    actionLeave === LeaveStatus.FOR_HRDM_APPROVAL ? 'approve' : 'disapprove'
                  } this Leave request, click Send Code
                              and enter the code sent to your mobile number:
                              ${mobile}. `
                : otpName === ManagerOtpApproval.PASSSLIP
                ? `To ${
                    actionPassSlip === PassSlipStatus.APPROVED ? 'approve' : 'disapprove'
                  } this Pass Slip request, click Send Code
                                and enter the code sent to your mobile number:
                                ${mobile}. `
                : otpName === ManagerOtpApproval.OVERTIME
                ? `To ${
                    actionOvertime === OvertimeStatus.APPROVED ? 'approve' : 'disapprove'
                  } this Overtime request, click Send Code
                                and enter the code sent to your mobile number:
                                ${mobile}. `
                : otpName === ManagerOtpApproval.DTRCORRECTION
                ? `To ${
                    actionDtrCorrection === DtrCorrectionStatus.APPROVED ? 'approve' : 'disapprove'
                  } this Time Log Correction request, click Send Code
                                and enter the code sent to your mobile number:
                                ${mobile}. `
                : null}
            </div>
            {isOtpSending ? (
              <div className={`mb-4 text-center text-green-600 cursor-pointer text-md`}>
                <PortalSVG.AnimationBlueLoading width={28} height={28} className={`absolute -mt-1 -ml-8`} />
                <label className={``}>Sending Code</label>
              </div>
            ) : null}
            {isOtpSending || isSendOtpLoading ? null : (
              <button
                disabled={isSubmitLoading == true ? true : false}
                className={`${
                  isSubmitLoading == true ? 'cursor-not-allowed' : ''
                } mb-2 text-white bg-indigo-500 h-10 transition-all rounded hover:bg-indigo-600 active:bg-indigo-600 outline-indigo-500 w-56`}
                onClick={() => handleSendCode()}
              >
                <label className="font-bold cursor-pointer">{`${failedFirstOtp ? 'RESEND CODE' : 'SEND CODE'}`}</label>
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
                <form onSubmit={(e) => handleFinalSubmit(e)} className="flex flex-col gap-1 items-center w-full">
                  {otpFieldError && (
                    <section className="mb-3 w-56" onAnimationEnd={() => setIsError({ ...isError, animate: false })}>
                      <Notice type="error" message={errorMessage} animate={otpFieldError} />
                    </section>
                  )}
                  <section className={`${otpFieldError ? 'space-y-5' : 'space-y-3'}`}>
                    <AuthCode
                      allowedCharacters="numeric"
                      onChange={setOtpCode}
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
            <div className="text-center text-sm mb-4">
              {otpName === ManagerOtpApproval.LEAVE
                ? `Leave has been ${actionLeave}.`
                : otpName === ManagerOtpApproval.PASSSLIP
                ? `Pass Slip has been ${actionPassSlip}.`
                : otpName === ManagerOtpApproval.OVERTIME
                ? `Overtime has been ${actionOvertime}.`
                : otpName === ManagerOtpApproval.DTRCORRECTION
                ? `Time Log Correction has been ${actionDtrCorrection}.`
                : null}
            </div>

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
