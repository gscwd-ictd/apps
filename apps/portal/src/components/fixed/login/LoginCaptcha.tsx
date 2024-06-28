/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { GenerateCaptcha } from '../captcha/CaptchaGenerator';
import { useLoginStore } from 'apps/portal/src/store/login.store';

interface CaptchaProps {
  tokenId: string;
  captchaName: string;
}

export const LoginCaptcha: FunctionComponent<CaptchaProps> = ({ tokenId, captchaName, ...props }) => {
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

  const { setLoginOtpModalIsOpen, loginCaptchaModalIsOpen, setLoginCaptchaModalIsOpen, setCaptchaSuccess } =
    useLoginStore((state) => ({
      setLoginOtpModalIsOpen: state.setLoginOtpModalIsOpen,
      loginCaptchaModalIsOpen: state.loginCaptchaModalIsOpen,
      setLoginCaptchaModalIsOpen: state.setLoginCaptchaModalIsOpen,
      setCaptchaSuccess: state.setCaptchaSuccess,
    }));

  useEffect(() => {
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [loginCaptchaModalIsOpen]);

  //CLOSE FUNCTION FOR COMPLETED CAPTCHA
  const handleClose = () => {
    setLoginCaptchaModalIsOpen(false); //close captcha modal first
    setTimeout(() => {
      setLoginOtpModalIsOpen(false); //then close OTP  modal
      setCaptchaSuccess(true);
    }, 100);
  };

  //CANCEL CAPTCHA FUNCTION FOR COMPLETED CAPTCHA
  const handleCancelCaptcha = () => {
    setLoginCaptchaModalIsOpen(false); //close captcha modal first
    setTimeout(() => {
      setLoginOtpModalIsOpen(true); //then open OTP  modal back
    }, 100);
  };

  // SUBMIT
  async function handleFinalSubmit() {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
    } else {
      handleClose();
    }
  }

  return (
    <>
      <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm w-full">
        <div className="mb-2 text-center">
          {`To continue logging in, please generate and submit the correct Captcha.`}
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
            onClick={(e) => handleCancelCaptcha()}
          >
            <label className="font-bold cursor-pointer">CANCEL</label>
          </button>
        </div>
      </div>
    </>
  );
};
