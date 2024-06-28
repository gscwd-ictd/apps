/* eslint-disable @nx/enforce-module-boundaries */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LoginState = {
  loginOtpModalIsOpen: boolean;
  setLoginOtpModalIsOpen: (loginOtpModalIsOpen: boolean) => void;

  loginCaptchaModalIsOpen: boolean;
  setLoginCaptchaModalIsOpen: (loginCaptchaModalIsOpen: boolean) => void;

  otpSuccess: boolean;
  setOtpSuccess: (otpSuccess: boolean) => void;

  captchaSuccess: boolean;
  setCaptchaSuccess: (captchaSuccess: boolean) => void;

  failedFirstOtp: boolean;
  setFailedFirstOtp: (failedFirstOtp: boolean) => void;
};

export const useLoginStore = create<LoginState>()(
  devtools((set) => ({
    loginOtpModalIsOpen: false,
    setLoginOtpModalIsOpen: (loginOtpModalIsOpen: boolean) => {
      set((state) => ({ ...state, loginOtpModalIsOpen }));
    },

    loginCaptchaModalIsOpen: false,
    setLoginCaptchaModalIsOpen: (loginCaptchaModalIsOpen: boolean) => {
      set((state) => ({ ...state, loginCaptchaModalIsOpen }));
    },

    otpSuccess: false,
    setOtpSuccess: (otpSuccess: boolean) => {
      set((state) => ({ ...state, otpSuccess }));
    },

    captchaSuccess: false,
    setCaptchaSuccess: (captchaSuccess: boolean) => {
      set((state) => ({ ...state, captchaSuccess }));
    },

    failedFirstOtp: false,
    setFailedFirstOtp: (failedFirstOtp: boolean) => {
      set((state) => ({ ...state, failedFirstOtp }));
    },
  }))
);
