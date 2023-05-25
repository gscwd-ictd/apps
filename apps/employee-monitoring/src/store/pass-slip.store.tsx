/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';

type LoadingPassSlip = {
  loadingPassSlip: boolean;
  loadingPassSlips: boolean;
};

type ErrorPassSlip = {
  errorPassSlip: string;
  errorPassSlips: string;
};

type PassSlipState = {
  passSlips: Array<PassSlip>;
  passSlip: PassSlip;
  loading: LoadingPassSlip;
  error: ErrorPassSlip;

  getPassSlips: () => void;
  getPassSlipsSuccess: (response: Array<PassSlip>) => void;
  getPassSlipsFail: (error: string) => void;

  cancelPassSlip: () => void;
  cancelPassSlipSuccess: (response: PassSlip) => void;
  cancelPassSlipFail: (error: string) => void;

  emptyErrorsAndResponse: () => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set, get) => ({
    passSlip: {} as PassSlip,
    passSlips: [],
    loading: { loadingPassSlip: false, loadingPassSlips: false },
    error: { errorPassSlip: '', errorPassSlips: '' },

    emptyErrorsAndResponse: () =>
      set((state) => ({
        ...state,
        error: { errorPassSlip: '', errorPassSlips: '' },
        passSlip: {} as PassSlip,
      })),

    getPassSlips: () =>
      set((state) => ({
        ...state,
        passSlips: [],
        loading: { ...state.loading, loadingPassSlips: true },
        error: { ...state.error, errorPassSlips: '' },
      })),

    getPassSlipsSuccess: (response: Array<PassSlip>) =>
      set((state) => ({
        ...state,
        passSlips: response,
        loading: { ...state.loading, loadingPassSlips: false },
      })),

    getPassSlipsFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorPassSlips: error },
        loading: { ...state.loading, loadingPassSlips: false },
      })),

    cancelPassSlip: () =>
      set((state) => ({
        ...state,
        passSlip: {} as PassSlip,
        loading: { ...state.loading, loadingPassSlip: true },
        error: { ...state.error, errorPassSlip: '' },
      })),

    cancelPassSlipSuccess: (response: PassSlip) =>
      set((state) => ({
        ...state,
        passSlip: response,
        loading: { ...state.loading, loadingPassSlip: false },
      })),

    cancelPassSlipFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorPassSlip: error },
        loading: { ...state.loading, loadingPassSlip: false },
      })),
  }))
);
