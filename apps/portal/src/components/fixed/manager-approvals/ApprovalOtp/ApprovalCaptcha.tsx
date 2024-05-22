/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { passSlipAction } from '../../../../types/approvals.type';
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { GenerateCaptcha } from '../../captcha/CaptchaGenerator';
import { OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';

interface CaptchaProps {
  employeeId?: string;
  tokenId: string;
  captchaName: any;
  dataToSubmitOvertimeAccomplishment?: OvertimeAccomplishmentApprovalPatch;
  dataToSubmitPassSlipDispute?: passSlipAction;
  dataToSubmitApproveAllAccomplishment?: OvertimeAccomplishmentApprovalPatch;
}

export const ApprovalCaptcha: FunctionComponent<CaptchaProps> = ({
  employeeId,
  tokenId,
  captchaName,
  dataToSubmitOvertimeAccomplishment,
  dataToSubmitPassSlipDispute,
  dataToSubmitApproveAllAccomplishment,
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
    setApproveAllCaptchaModalIsOpen,
    setDisputedPassSlipModalIsOpen,
    patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess,
    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
  } = useApprovalStore((state) => ({
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen, //for overtime accomplishment captcha
    setApproveAllCaptchaModalIsOpen: state.setApproveAllCaptchaModalIsOpen,
    setDisputedPassSlipModalIsOpen: state.setDisputedPassSlipModalIsOpen,
    patchOvertimeAccomplishment: state.patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail: state.patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess: state.patchOvertimeAccomplishmentSuccess,
    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
  }));

  useEffect(() => {
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [captchaModalIsOpen]);

  //CLOSE FUNCTION FOR COMPLETED CAPTCHA
  const handleClose = () => {
    setCaptchaModalIsOpen(false); //close captcha modal first
    setApproveAllCaptchaModalIsOpen(false);
    setTimeout(() => {
      setDisputedPassSlipModalIsOpen(false);
      // setOvertimeAccomplishmentModalIsOpen(false); //then close Accomplishment modal
    }, 200);
  };

  // SUBMIT
  async function handleFinalSubmit() {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
    } else {
      //overtime accomplishment approval
      patchOvertimeAccomplishment();
      if (dataToSubmitOvertimeAccomplishment && !dataToSubmitApproveAllAccomplishment) {
        const { error, result } = await patchPortal(
          '/v1/overtime/accomplishments/approval',
          dataToSubmitOvertimeAccomplishment
        );
        if (error) {
          patchOvertimeAccomplishmentFail(result);
        } else {
          patchOvertimeAccomplishmentSuccess(result);
          handleClose(); // close confirmation of decline modal
        }
      }
      //approve all pending accomplishment
      else if (dataToSubmitApproveAllAccomplishment && !dataToSubmitOvertimeAccomplishment) {
        const { error, result } = await patchPortal(
          '/v1/overtime/accomplishments/approval/all',
          dataToSubmitApproveAllAccomplishment
        );
        if (error) {
          patchOvertimeAccomplishmentFail(result);
        } else {
          patchOvertimeAccomplishmentSuccess(result);
          handleClose(); // close confirmation of decline modal
        }
      }
      //pass slip dispute approval
      else if (dataToSubmitPassSlipDispute) {
        let data;
        if (dataToSubmitPassSlipDispute.status === PassSlipStatus.APPROVED) {
          //mutate payload for dispute purposes
          data = {
            passSlipId: dataToSubmitPassSlipDispute.passSlipId,
            isDisputeApproved: true,
          };
        } else {
          data = {
            passSlipId: dataToSubmitPassSlipDispute.passSlipId,
            isDisputeApproved: false,
          };
        }
        patchPassSlip();
        const { error, result } = await patchPortal('/v1/pass-slip', data);
        if (error) {
          patchPassSlipFail(result);
        } else {
          patchPassSlipSuccess(result);
          handleClose(); // close confirmation of decline modal
        }
      }
    }
  }

  return (
    <>
      {dataToSubmitOvertimeAccomplishment || dataToSubmitPassSlipDispute || dataToSubmitApproveAllAccomplishment ? (
        <>
          <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm w-full">
            <div className="mb-2 text-center">
              {dataToSubmitOvertimeAccomplishment ? (
                <>
                  {`To ${
                    dataToSubmitOvertimeAccomplishment.status == OvertimeAccomplishmentStatus.APPROVED
                      ? 'approve'
                      : 'disapprove'
                  } this Accomplishment Report, please generate and submit the correct Captcha.`}
                </>
              ) : null}

              {dataToSubmitPassSlipDispute ? (
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
                onClick={(e) => handleClose()}
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
