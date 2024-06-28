/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { GenerateCaptcha } from '../../captcha/CaptchaGenerator';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { patchPortal, patchPortalUrl } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { PdcApprovalAction, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import {
  PdcChairmanApproval,
  PdcGeneralManagerApproval,
  PdcSecretariatApproval,
} from 'libs/utils/src/lib/types/training.type';

interface CaptchaProps {
  employeeId?: string;
  tokenId: string;
  captchaName: string;
  remarks?: string;
  action: PdcApprovalAction; // approve or disapprove
}

export const ApprovalCaptcha: FunctionComponent<CaptchaProps> = ({
  employeeId,
  tokenId,
  captchaName,
  remarks,
  action,
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
    individualTrainingDetails,
    patchTrainingSelection,
    patchTrainingSelectionSuccess,
    patchTrainingSelectionFail,
    setTrainingModalIsOpen,
    setCaptchaPdcModalIsOpen,
    captchaPdcModalIsOpen,
  } = usePdcApprovalsStore((state) => ({
    individualTrainingDetails: state.individualTrainingDetails,
    patchTrainingSelection: state.patchTrainingSelection,
    patchTrainingSelectionSuccess: state.patchTrainingSelectionSuccess,
    patchTrainingSelectionFail: state.patchTrainingSelectionFail,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    setCaptchaPdcModalIsOpen: state.setCaptchaPdcModalIsOpen,
    captchaPdcModalIsOpen: state.captchaPdcModalIsOpen,
  }));

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  useEffect(() => {
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [captchaPdcModalIsOpen]);

  //CLOSE FUNCTION FOR COMPLETED CAPTCHA
  const handleClose = () => {
    setCaptchaPdcModalIsOpen(false); //close captcha modal first
    setTimeout(() => {
      setTrainingModalIsOpen(false); //then close Training Details modal
    }, 200);
  };

  const handlePatchResult = async (data: PdcSecretariatApproval | PdcChairmanApproval | PdcGeneralManagerApproval) => {
    const { error, result } = await patchPortal(
      employeeDetail.employmentDetails.isPdcChairman
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/chairman`
        : employeeDetail.employmentDetails.isPdcSecretariat
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/secretariat`
        : !employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/gm`
        : employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
          individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/chairman`
        : employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
          individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/gm`
        : null,
      data
    );
    if (error) {
      patchTrainingSelectionFail(result);
    } else {
      patchTrainingSelectionSuccess(result);
      handleClose();
    }
  };

  // SUBMIT
  async function handleFinalSubmit() {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
    } else {
      let data;
      if (
        employeeDetail.employmentDetails.isPdcChairman &&
        individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
      ) {
        //for chairman
        data = {
          pdcChairman: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
        };
      } else if (employeeDetail.employmentDetails.isPdcSecretariat) {
        //for secretary
        data = {
          pdcSecretariat: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
        };
      } else if (
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
      ) {
        data = {
          //for GM
          generalManager: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
        };
      } else if (
        employeeDetail.employmentDetails.isPdcChairman &&
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
      ) {
        //for chairman and GM at the same time but approving as chairman
        data = {
          pdcChairman: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
        };
      } else if (
        employeeDetail.employmentDetails.isPdcChairman &&
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
      ) {
        //for chairman and GM at the same time but approving as GM
        data = {
          generalManager: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
        };
      }

      patchTrainingSelection();
      handlePatchResult(data);
    }
  }

  return (
    <>
      <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm w-full">
        <div className="mb-2 text-center">
          {`To ${
            action === PdcApprovalAction.APPROVE ? 'approve' : 'disapprove'
          } this Training, please generate and submit the correct Captcha.`}
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
            onClick={(e) => setCaptchaPdcModalIsOpen(false)}
          >
            <label className="font-bold cursor-pointer">CANCEL</label>
          </button>
        </div>
      </div>
    </>
  );
};
