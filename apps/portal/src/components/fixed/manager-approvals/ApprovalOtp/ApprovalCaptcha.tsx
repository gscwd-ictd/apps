/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { passSlipAction } from '../../../../types/approvals.type';
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { GenerateCaptcha } from '../../captcha/CaptchaGenerator';
import { OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';
import { ManagerConfirmationApproval, ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';

interface CaptchaProps {
  employeeId?: string;
  tokenId: string;
  captchaName: string;
  dataToSubmitOvertimeAccomplishment?: OvertimeAccomplishmentApprovalPatch;
  dataToSubmitPassSlipDispute?: passSlipAction;
  dataToSubmitApproveAllAccomplishment?: OvertimeAccomplishmentApprovalPatch;

  //FOR PASS SLIP, DTR CORRECTION, LEAVE, OT APPROVALS
  actionOvertime?: OvertimeStatus; // approve or disapprove for overtime
  actionLeave?: LeaveStatus; // approve or disapprove for leave
  actionPassSlip?: PassSlipStatus; // approve or disapprove pass slip
  actionDtrCorrection?: DtrCorrectionStatus; // approve or disapprove time log correction
  remarks?: string;
  supervisorDisapprovalRemarks?: string; //for supervisor disapproval for leave
}

export const ApprovalCaptcha: FunctionComponent<CaptchaProps> = ({
  employeeId,
  tokenId,
  captchaName,
  dataToSubmitOvertimeAccomplishment,
  dataToSubmitPassSlipDispute,
  dataToSubmitApproveAllAccomplishment,

  //FOR PASS SLIP, DTR CORRECTION, LEAVE, OT APPROVALS
  actionOvertime,
  actionLeave,
  actionPassSlip,
  actionDtrCorrection,
  remarks,
  ...props
}) => {
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [pwdArray, setPwdArray] = useState<string[]>();
  const [password, setPassword] = useState<string>('');
  const [captchaPassword, setCaptchaPassword] = useState<string>('');
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);

  // generate captcha
  const getCaptcha = () => {
    setPassword('');
    const data = GenerateCaptcha();
    if (data) {
      setCaptchaPassword(data.pwd);
      setPwdArray([
        `${data.captcha[0]}`,
        `${data.captcha[1]}`,
        `${data.captcha[2]}`,
        `${data.captcha[3]}`,
        `${data.captcha[4]}`,
        `${data.captcha[5]}`,
      ]);
    }
  };

  const {
    captchaModalIsOpen,
    setCaptchaModalIsOpen,
    setApproveAllAccomplishmentModalIsOpen,
    setDisputedPassSlipModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen,
    patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess,
    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,

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

    setPendingPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen,

    patchDtrCorrection,
    patchDtrCorrectionSuccess,
    patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen,
  } = useApprovalStore((state) => ({
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen, //for overtime accomplishment captcha
    setApproveAllAccomplishmentModalIsOpen: state.setApproveAllAccomplishmentModalIsOpen,
    setDisputedPassSlipModalIsOpen: state.setDisputedPassSlipModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen: state.setOvertimeAccomplishmentModalIsOpen,
    patchOvertimeAccomplishment: state.patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail: state.patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess: state.patchOvertimeAccomplishmentSuccess,
    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,

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

    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,

    patchDtrCorrection: state.patchDtrCorrection,
    patchDtrCorrectionSuccess: state.patchDtrCorrectionSuccess,
    patchDtrCorrectionFail: state.patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen: state.setDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen: state.setOtpDtrCorrectionModalIsOpen,
  }));

  useEffect(() => {
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [captchaModalIsOpen]);

  //CLOSE FUNCTION FOR COMPLETED CAPTCHA
  const handleClose = () => {
    setCaptchaModalIsOpen(false); //close captcha modal first
    setApproveAllAccomplishmentModalIsOpen(false);

    setOtpOvertimeModalIsOpen(false);
    setOtpPassSlipModalIsOpen(false);
    setOtpLeaveModalIsOpen(false);
    setOtpDtrCorrectionModalIsOpen(false);

    setTimeout(() => {
      setDisputedPassSlipModalIsOpen(false);
      setOvertimeAccomplishmentModalIsOpen(false); //then close Accomplishment modal
      setPendingOvertimeModalIsOpen(false); //then close Pass Slip modal
      setPendingPassSlipModalIsOpen(false); //then close Pass Slip modal
      setPendingLeaveModalIsOpen(false); //then close Pass Slip modal
      setDtrCorrectionModalIsOpen(false);
    }, 200);
  };

  //CLOSE FUNCTION FOR CAPTCHA ONLY
  const handleCloseCaptcha = () => {
    setOtpOvertimeModalIsOpen(false);
    setOtpPassSlipModalIsOpen(false);
    setOtpLeaveModalIsOpen(false);
    setOtpDtrCorrectionModalIsOpen(false);

    setCaptchaModalIsOpen(false);
    setApproveAllAccomplishmentModalIsOpen(false);
  };

  // SUBMIT
  async function handleFinalSubmit() {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
    } else {
      let data;

      if (captchaName === ManagerConfirmationApproval.LEAVE) {
        data = {
          id: tokenId,
          status: actionLeave,
          supervisorDisapprovalRemarks: remarks,
        };
        patchLeave();
      } else if (captchaName === ManagerConfirmationApproval.PASSSLIP) {
        data = {
          passSlipId: tokenId,
          status: actionPassSlip,
        };
        patchPassSlip();
      } else if (captchaName === ManagerConfirmationApproval.OVERTIME) {
        data = {
          managerId: employeeId,
          approvedBy: employeeId,
          remarks: remarks,
          status: actionOvertime,
          overtimeApplicationId: tokenId,
        };
        patchOvertime();
      } else if (captchaName === ManagerConfirmationApproval.DTRCORRECTION) {
        data = {
          id: tokenId,
          status: actionDtrCorrection,
        };
        patchDtrCorrection();
      } else if (captchaName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
        data = dataToSubmitOvertimeAccomplishment;
        patchOvertimeAccomplishment();
      } else if (captchaName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
        data = dataToSubmitApproveAllAccomplishment;
        patchOvertimeAccomplishment();
      } else if (captchaName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
        if (dataToSubmitPassSlipDispute?.status === PassSlipStatus.APPROVED) {
          //mutate payload for dispute purposes
          data = {
            passSlipId: dataToSubmitPassSlipDispute?.passSlipId,
            isDisputeApproved: true,
          };
        } else {
          data = {
            passSlipId: dataToSubmitPassSlipDispute?.passSlipId,
            isDisputeApproved: false,
          };
        }
        patchPassSlip();
      }

      let captchaPatchUrl;
      if (captchaName === ManagerConfirmationApproval.LEAVE) {
        captchaPatchUrl = '/v1/leave/supervisor';
      } else if (captchaName === ManagerConfirmationApproval.PASSSLIP) {
        captchaPatchUrl = '/v1/pass-slip';
      } else if (captchaName === ManagerConfirmationApproval.OVERTIME) {
        captchaPatchUrl = '/v1/overtime/approval';
      } else if (captchaName === ManagerConfirmationApproval.DTRCORRECTION) {
        captchaPatchUrl = '/v1/dtr-correction';
      } else if (captchaName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
        captchaPatchUrl = '/v1/overtime/accomplishments/approval';
      } else if (captchaName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
        captchaPatchUrl = '/v1/overtime/accomplishments/approval/all';
      } else if (captchaName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
        captchaPatchUrl = '/v1/pass-slip';
      }

      const { error, result } = await patchPortal(captchaPatchUrl, data);
      if (error) {
        if (captchaName === ManagerConfirmationApproval.LEAVE) {
          patchLeaveFail(result);
        } else if (captchaName === ManagerConfirmationApproval.PASSSLIP) {
          patchPassSlipFail(result);
        } else if (captchaName === ManagerConfirmationApproval.OVERTIME) {
          patchOvertimeFail(result);
        } else if (captchaName === ManagerConfirmationApproval.DTRCORRECTION) {
          patchDtrCorrectionFail(result);
        } else if (captchaName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
          patchOvertimeAccomplishmentFail(result);
        } else if (captchaName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
          patchOvertimeAccomplishmentFail(result);
        } else if (captchaName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
          patchPassSlipFail(result);
        }
      } else {
        if (captchaName === ManagerConfirmationApproval.LEAVE) {
          patchLeaveSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.PASSSLIP) {
          patchPassSlipSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.OVERTIME) {
          patchOvertimeSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.DTRCORRECTION) {
          patchDtrCorrectionSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
          patchOvertimeAccomplishmentSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
          patchOvertimeAccomplishmentSuccess(result);
          handleClose();
        } else if (captchaName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
          patchPassSlipSuccess(result);
          handleClose();
        }
      }
    }
  }

  return (
    <>
      <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm w-full">
        <div className="mb-2 text-center">
          {/* PASS SLIP APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.PASSSLIP ? (
            <>
              {`To ${
                actionPassSlip === PassSlipStatus.APPROVED ? 'approve' : 'disapprove'
              } this Pass Slip, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {/* OVERTIME APPLICATION APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.OVERTIME ? (
            <>
              {`To ${
                actionOvertime === OvertimeStatus.APPROVED ? 'approve' : 'disapprove'
              } this Overtime, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {/* LEAVE APPLICATION APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.LEAVE ? (
            <>
              {`To ${
                actionLeave === LeaveStatus.APPROVED ? 'approve' : 'disapprove'
              } this Leave, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {/* DTR CORRECTION APPLICATION APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.DTRCORRECTION ? (
            <>
              {`To ${
                actionDtrCorrection === DtrCorrectionStatus.APPROVED ? 'approve' : 'disapprove'
              } this DTR Correction, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {/* ALL OT ACCOMPLISHMENT APPLICATION APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT &&
          dataToSubmitApproveAllAccomplishment ? (
            <>
              {`To ${
                dataToSubmitApproveAllAccomplishment.status == OvertimeAccomplishmentStatus.APPROVED
                  ? 'approve'
                  : 'disapprove'
              } this Accomplishment Report, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {/* OT ACCOMPLISHMENT APPLICATION APPROVAL MESSAGE */}
          {captchaName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT &&
          dataToSubmitOvertimeAccomplishment ? (
            <>
              {`To ${
                dataToSubmitOvertimeAccomplishment.status == OvertimeAccomplishmentStatus.APPROVED
                  ? 'approve'
                  : 'disapprove'
              } this Accomplishment Report, please generate and submit the correct Captcha.`}
            </>
          ) : null}

          {captchaName === ManagerConfirmationApproval.PASSSLIP_DISPUTE && dataToSubmitPassSlipDispute ? (
            <>
              {`To ${
                dataToSubmitPassSlipDispute.status == PassSlipStatus.APPROVED ? 'approve' : 'disapprove'
              } this Pass Slip Dispute, please generate and submit the correct Captcha.`}
            </>
          ) : null}
        </div>

        <div className="flex flex-col flex-wrap justify-center items-center gap-2 w-full">
          <button
            className={`
               text-white bg-red-500 h-10 transition-all rounded hover:bg-red-600 active:bg-red-600 outline-red-500 w-56`}
            onClick={getCaptcha}
          >
            <label className="font-bold cursor-pointer">GENERATE CAPTCHA</label>
          </button>
          {/* captcha */}
          <div
            className={`${
              pwdArray ? '' : 'animate-pulse'
            } w-56 select-none h-10 px-4 py-1 transition-all duration-150 bg-slate-200 text-xl flex justify-center items-center gap-2`}
          >
            <div className="w-4 font-medium text-indigo-800 scale-105 -rotate-12">{pwdArray && pwdArray[0]}</div>
            <div className="w-4 font-bold scale-90 rotate-6 text-sky-800">{pwdArray && pwdArray[1]}</div>
            <div className="w-4 font-light text-red-800 scale-105 rotate-45">{pwdArray && pwdArray[2]}</div>
            <div className="w-4 pr-2 font-semibold text-green-800 scale-100 rotate-12">{pwdArray && pwdArray[3]}</div>
            <div className="w-4 font-bold text-blue-600 scale-90 -rotate-45">{pwdArray && pwdArray[4]}</div>
            <div className="w-4 font-medium scale-105 -rotate-6 text-stone-800">{pwdArray && pwdArray[5]}</div>
          </div>
          <input
            type="text"
            value={password}
            placeholder="Enter Captcha"
            className={`${isCaptchaError ? 'border-red-600' : 'border-stone-200'}  w-56 border text-md`}
            onChange={(e) => setPassword(e.target.value as unknown as string)}
          />

          <button
            className={`${
              wiggleEffect && 'animate-shake'
            } text-white w-56 h-10 transition-all rounded hover:bg-indigo-600 active:bg-indigo-600 outline-blue-500 ${
              wiggleEffect ? 'bg-rose-600 hover:bg-rose-600' : 'bg-indigo-500'
            }`}
            type="submit"
            onAnimationEnd={() => setWiggleEffect(false)}
            onClick={(e) => handleFinalSubmit()}
          >
            <label className={`cursor-not-allowed pointer-events-none font-bold`}>SUBMIT</label>
          </button>

          <button
            className={`
               mb-2 text-white bg-red-500 h-10 transition-all rounded hover:bg-red-600 active:bg-red-600 outline-red-500 w-56`}
            onClick={(e) => handleCloseCaptcha()}
          >
            <label className="font-bold cursor-pointer">CANCEL</label>
          </button>
        </div>
      </div>
    </>
  );
};
