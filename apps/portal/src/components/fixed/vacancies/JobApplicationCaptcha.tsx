/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';

import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

import { OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';
import { GenerateCaptcha } from '../captcha/CaptchaGenerator';
import { postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { WorkExperience } from 'apps/portal/src/types/workexp.type';
import { useWorkExpStore } from 'apps/portal/src/store/workexperience.store';
import { checkIfApplied } from 'apps/portal/src/utils/helpers/http-requests/applicants-requests';

interface CaptchaProps {
  vppId: string;
  employeeId: string;
  withRelevantExperience: boolean;
  workExperienceArray: Array<WorkExperience>;
}

export const JobApplicationCaptcha: FunctionComponent<CaptchaProps> = ({
  vppId,
  employeeId,
  withRelevantExperience,
  workExperienceArray,
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
    postJobApplication,
    postJobApplicationSuccess,
    postJobApplicationFail,
    setHasApplied,
    setModal,
  } = useWorkExpStore((state) => ({
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen,
    postJobApplication: state.postJobApplication,
    postJobApplicationSuccess: state.postJobApplicationSuccess,
    postJobApplicationFail: state.postJobApplicationFail,
    setHasApplied: state.setHasApplied,
    setModal: state.setModal,
  }));

  useEffect(() => {
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [captchaModalIsOpen]);

  //CLOSE FUNCTION FOR COMPLETED CAPTCHA
  const handleClose = () => {
    setCaptchaModalIsOpen(false); //close captcha modal first
    setTimeout(() => {
      setModal({ page: 1, isOpen: true });
    }, 200);
  };

  // SUBMIT
  async function handleFinalSubmit() {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
    } else {
      postJobApplication();
      let data = {
        withRelevantExperience: withRelevantExperience,
        workExperienceSheet: workExperienceArray,
      };
      const { error, result } = await postPortal(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant/${vppId}/internal/${employeeId}`,
        data
      );

      if (error) {
        postJobApplicationFail(result);
      } else {
        postJobApplicationSuccess(result);
        const applicantApplication = await checkIfApplied(vppId, employeeId);
        if (applicantApplication.hasApplied) {
          setHasApplied(applicantApplication.hasApplied);
        }
        handleClose();
      }
    }
  }

  return (
    <>
      {vppId && employeeId ? (
        <>
          <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm w-full">
            <div className="mb-2 text-center">
              {`To apply for this job position, please generate and submit the correct Captcha.`}
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
                <div className="w-4 pr-2 font-semibold text-green-800 scale-100 rotate-12">
                  {pwdArray && pwdArray[3]}
                </div>
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
                onClick={(e) => setCaptchaModalIsOpen(false)}
              >
                <label className="font-bold cursor-pointer">CANCEL</label>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
