/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ChangePasswordState = {
  response: {
    responseVerifyCurrentPassword: boolean;
    responseChangePassword: any;
  };

  loading: {
    loadingVerifyCurrentPassword: boolean;
    loadingChangePassword: boolean;
  };
  error: {
    errorVerifyCurrentPassword: string;
    errorChangePassword: string;
  };

  //verify current password
  postVerifyCurrentPassword: () => void;
  postVerifyCurrentPasswordSuccess: (response: any) => void;
  postVerifyCurrentPasswordFail: (error: string) => void;

  //change password
  patchChangePassword: () => void;
  patchChangePasswordSuccess: (response: any) => void;
  patchChangePasswordFail: (error: string) => void;
};

export const useChangePasswordStore = create<ChangePasswordState>()(
  devtools((set) => ({
    response: {
      responseVerifyCurrentPassword: false,
      responseChangePassword: {},
    },

    loading: {
      loadingVerifyCurrentPassword: false,
      loadingChangePassword: false,
    },
    error: {
      errorVerifyCurrentPassword: '',
      errorChangePassword: '',
    },

    postVerifyCurrentPassword: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseVerifyCurrentPassword: false,
        },
        loading: {
          ...state.loading,
          loadingVerifyCurrentPassword: true,
        },
        error: {
          ...state.error,
          errorVerifyCurrentPassword: '',
        },
      }));
    },
    postVerifyCurrentPasswordSuccess: (response: boolean) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseVerifyCurrentPassword: response,
        },
        loading: {
          ...state.loading,
          loadingVerifyCurrentPassword: false,
        },
      }));
    },
    postVerifyCurrentPasswordFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingVerifyCurrentPassword: false,
        },
        error: {
          ...state.error,
          errorVerifyCurrentPassword: error,
        },
      }));
    },

    //change password
    patchChangePassword: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseChangePassword: {} as any,
        },
        loading: {
          ...state.loading,
          loadingChangePassword: true,
        },
        error: {
          ...state.error,
          errorChangePassword: '',
        },
      }));
    },
    patchChangePasswordSuccess: (response: any) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseChangePassword: response,
        },
        loading: {
          ...state.loading,
          loadingChangePassword: false,
        },
      }));
    },
    patchChangePasswordFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingChangePassword: false,
        },
        error: {
          ...state.error,
          errorChangePassword: error,
        },
      }));
    },
  }))
);
