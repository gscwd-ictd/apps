/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { useLoginStore } from 'apps/portal/src/store/login.store';

export const LoginOptions: FunctionComponent = () => {
  const { setLoginOtpModalIsOpen, setLoginCaptchaModalIsOpen, setLoginOptionsModalIsOpen } = useLoginStore((state) => ({
    loginOtpModalIsOpen: state.loginOtpModalIsOpen,
    setLoginOtpModalIsOpen: state.setLoginOtpModalIsOpen,
    loginCaptchaModalIsOpen: state.loginCaptchaModalIsOpen,
    setLoginCaptchaModalIsOpen: state.setLoginCaptchaModalIsOpen,
    loginOptionsModalIsOpen: state.loginOptionsModalIsOpen,
    setLoginOptionsModalIsOpen: state.setLoginOptionsModalIsOpen,
  }));

  const handleCaptcha = () => {
    setLoginOtpModalIsOpen(false);
    setLoginCaptchaModalIsOpen(true);
    setLoginOptionsModalIsOpen(false);
  };

  const handleClose = () => {
    setLoginOtpModalIsOpen(false);
    setLoginCaptchaModalIsOpen(false);
    setLoginOptionsModalIsOpen(false);
  };

  const handleOtp = () => {
    setLoginOtpModalIsOpen(true);
    setLoginCaptchaModalIsOpen(false);
    setLoginOptionsModalIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col p-8 gap-1 justify-center items-center text-sm">
        <div className="mb-2 text-center">Please select a login verification option.</div>

        <>
          <button
            className={` mb-2 text-white bg-indigo-500 h-10 transition-all rounded hover:bg-indigo-600 active:bg-indigo-600 outline-indigo-500 w-56`}
            onClick={() => handleOtp()}
          >
            <label className="font-bold cursor-pointer">{`USE OTP`}</label>
          </button>

          <button
            className={` mb-2 text-white bg-green-500 h-10 transition-all rounded hover:bg-green-600 active:bg-green-600 outline-green-500     w-56`}
            onClick={() => handleCaptcha()}
          >
            <label className="font-bold cursor-pointer">{`USE CAPTCHA`}</label>
          </button>
        </>

        <button
          className={`mb-2 text-white bg-red-500 h-10 transition-all rounded hover:bg-red-600 active:bg-red-600 outline-red-500 w-56`}
          onClick={(e) => handleClose()}
        >
          <label className="font-bold cursor-pointer">CANCEL</label>
        </button>
      </div>
    </>
  );
};
