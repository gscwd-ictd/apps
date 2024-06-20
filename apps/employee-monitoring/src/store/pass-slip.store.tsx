/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PassSlip, HrmoApprovalPassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';

type ResponsePassSlip = {
  getPassSlip: PassSlip;
  hrmoApprovalPassSlip: HrmoApprovalPassSlip;
  cancelPassSlip: PassSlip;
  updatePassSlipTimeLogs: Partial<PassSlip>;
};

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
  response: ResponsePassSlip;
  loading: LoadingPassSlip;
  error: ErrorPassSlip;

  getPassSlips: () => void;
  getPassSlipsSuccess: (response: Array<PassSlip>) => void;
  getPassSlipsFail: (error: string) => void;

  cancelPassSlip: () => void;
  cancelPassSlipSuccess: (response: PassSlip) => void;
  cancelPassSlipFail: (error: string) => void;

  updatePassSlipTimeLogs: () => void;
  updatePassSlipTimeLogsSuccess: (response: Partial<PassSlip>) => void;
  updatePassSlipTimeLogsFail: (error: string) => void;

  updateHrmoApprovalPassSlip: () => void;
  updateHrmoApprovalPassSlipSuccess: (response: HrmoApprovalPassSlip) => void;
  updateHrmoApprovalPassSlipFail: (error: string) => void;

  emptyErrorsAndResponse: () => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    passSlips: [],
    response: {
      getPassSlip: {} as PassSlip,
      hrmoApprovalPassSlip: {} as HrmoApprovalPassSlip,
      cancelPassSlip: {} as PassSlip,
      updatePassSlipTimeLogs: {} as Partial<PassSlip>,
    },
    loading: { loadingPassSlip: false, loadingPassSlips: false },
    error: { errorPassSlip: '', errorPassSlips: '' },

    leaveConfirmAction: null,

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

    updateHrmoApprovalPassSlip: () =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          hrmoApprovalPassSlip: {} as HrmoApprovalPassSlip,
        },
        loading: { ...state.loading, loadingPassSlip: true },
        error: { ...state.error, errorPassSlip: '' },
      })),
    updateHrmoApprovalPassSlipSuccess: (response: HrmoApprovalPassSlip) =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          hrmoApprovalPassSlip: response,
        },
        loading: { ...state.loading, loadingPassSlip: false },
      })),
    updateHrmoApprovalPassSlipFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPassSlip: false },
        error: { ...state.error, errorPassSlip: error },
      })),

    cancelPassSlip: () =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelPassSlip: {} as PassSlip,
        },
        loading: { ...state.loading, loadingPassSlip: true },
        error: { ...state.error, errorPassSlip: '' },
      })),
    cancelPassSlipSuccess: (response: PassSlip) =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelPassSlip: response,
        },
        loading: { ...state.loading, loadingPassSlip: false },
      })),
    cancelPassSlipFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorPassSlip: error },
        loading: { ...state.loading, loadingPassSlip: false },
      })),

    updatePassSlipTimeLogs: () =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          updatePassSlipTimeLogs: {} as Partial<PassSlip>,
        },
        loading: { ...state.loading, loadingPassSlip: true },
        error: { ...state.error, errorPassSlip: '' },
      })),
    updatePassSlipTimeLogsSuccess: (response: Partial<PassSlip>) =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          updatePassSlipTimeLogs: response,
        },
        loading: { ...state.loading, loadingPassSlip: false },
      })),
    updatePassSlipTimeLogsFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorPassSlip: error },
        loading: { ...state.loading, loadingPassSlip: false },
      })),

    emptyErrorsAndResponse: () =>
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          hrmoApprovalPassSlip: {} as HrmoApprovalPassSlip,
          cancelPassSlip: {} as PassSlip,
          updatePassSlipTimeLogs: {} as Partial<PassSlip>,
        },
        error: {
          ...state.error,
          errorPassSlip: '',
          errorPassSlips: '',
        },
      })),
  }))
);
