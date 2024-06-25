/* eslint-disable @nx/enforce-module-boundaries */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LoginState = {
  loginOtpModalIsOpen: boolean;
  setLoginOtpModalIsOpen: (loginOtpModalIsOpen: boolean) => void;

  otpSuccess: boolean;
  setOtpSuccess: (otpSuccess: boolean) => void;
};

export const useLoginStore = create<LoginState>()(
  devtools((set) => ({
    loginOtpModalIsOpen: false,
    setLoginOtpModalIsOpen: (loginOtpModalIsOpen: boolean) => {
      set((state) => ({ ...state, loginOtpModalIsOpen }));
    },

    otpSuccess: false,
    setOtpSuccess: (otpSuccess: boolean) => {
      set((state) => ({ ...state, otpSuccess }));
    },
  }))
);
