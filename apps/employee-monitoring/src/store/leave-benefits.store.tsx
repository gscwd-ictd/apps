import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  LeaveBenefitId,
  LeaveBenefit,
} from 'libs/utils/src/lib/types/leave-benefits.type';

type ResponseLeaveBenefit = {
  postResponse: LeaveBenefit;
  updateResponse: LeaveBenefit;
  deleteResponse: LeaveBenefitId;
};

type LoadingLeaveBenefit = {
  loadingLeaveBenefits: boolean;
  loadingLeaveBenefit: boolean;
};

type ErrorLeaveBenefit = {
  errorLeaveBenefits: string;
  errorLeaveBenefit: string;
};

type LeaveBenefitState = {
  leaveBenefits: Array<LeaveBenefit>;
  setLeaveBenefits: (leaveBenefits: Array<LeaveBenefit>) => void;
  leaveBenefit: ResponseLeaveBenefit;
  loading: LoadingLeaveBenefit;
  error: ErrorLeaveBenefit;

  /* GET */
  getLeaveBenefits: (loading: boolean) => void;
  getLeaveBenefitsSuccess: (response: Array<LeaveBenefit>) => void;
  getLeaveBenefitsFail: (error: string) => void;

  /* POST */
  postLeaveBenefit: (loading: boolean) => void;
  postLeaveBenefitSuccess: (response: LeaveBenefit) => void;
  postLeaveBenefitFail: (error: string) => void;

  /* UPDATE */
  updateLeaveBenefit: (loading: boolean) => void;
  updateLeaveBenefitSuccess: (response: LeaveBenefit) => void;
  updateLeaveBenefitFail: (error: string) => void;

  /* DELETE */
  deleteLeaveBenefit: (loading: boolean) => void;
  deleteLeaveBenefitSuccess: (response: LeaveBenefit) => void;
  deleteLeaveBenefitFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useLeaveBenefitStore = create<LeaveBenefitState>()(
  devtools((set) => ({
    leaveBenefits: [],
    setLeaveBenefits: (leaveBenefits: Array<LeaveBenefit>) =>
      set((state) => ({ ...state, leaveBenefits })),
    error: { errorLeaveBenefit: '', errorLeaveBenefits: '' },
    leaveBenefit: {
      postResponse: {} as LeaveBenefit,
      updateResponse: {} as LeaveBenefit,
      deleteResponse: {} as LeaveBenefit,
    },
    loading: { loadingLeaveBenefit: false, loadingLeaveBenefits: false },

    getLeaveBenefits: (loading: boolean) =>
      set((state) => ({
        ...state,
        leaveBenefits: [],
        loading: { ...state.loading, loadingLeaveBenefits: loading },
        error: { ...state.error, errorLeaveBenefits: '' },
      })),
    getLeaveBenefitsSuccess: (response: Array<LeaveBenefit>) =>
      set((state) => ({
        ...state,
        leaveBenefits: response,
        loading: { ...state.loading, loadingLeaveBenefits: false },
      })),
    getLeaveBenefitsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefits: false },
        error: { ...state.error, errorLeaveBenefits: error },
      })),

    postLeaveBenefit: (loading: boolean) =>
      set((state) => ({
        ...state,
        leaveBenefit: {
          ...state.leaveBenefit,
          postResponse: {} as LeaveBenefit,
        },
        loading: { ...state.loading, loadingLeaveBenefit: loading },
        error: { ...state.error, errorLeaveBenefit: '' },
      })),
    postLeaveBenefitSuccess: (response: LeaveBenefit) =>
      set((state) => ({
        ...state,
        leaveBenefit: { ...state.leaveBenefit, postResponse: response },
        loading: { ...state.loading, loadingLeaveBenefit: false },
      })),
    postLeaveBenefitFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorLeaveBenefit: error },
        loading: { ...state.loading, loadingLeaveBenefit: false },
      })),

    updateLeaveBenefit: (loading: boolean) =>
      set((state) => ({
        ...state,
        leaveBenefit: {
          ...state.leaveBenefit,
          updateResponse: {} as LeaveBenefit,
        },
        loading: { ...state.loading, loadingLeaveBenefit: loading },
        error: { ...state.error, errorLeaveBenefit: '' },
      })),

    updateLeaveBenefitSuccess: (response: LeaveBenefit) =>
      set((state) => ({
        ...state,
        leaveBenefit: { ...state.leaveBenefit, updateResponse: response },
        loading: { ...state.loading, loadingLeaveBenefit: false },
      })),
    updateLeaveBenefitFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefit: false },
        error: { ...state.error, errorLeaveBenefit: error },
      })),

    deleteLeaveBenefit: (loading: boolean) =>
      set((state) => ({
        ...state,
        leaveBenefit: {
          ...state.leaveBenefit,
          deleteResponse: {} as LeaveBenefit,
        },
        loading: { ...state.loading, loadingLeaveBenefits: loading },
        error: { ...state.error, errorLeaveBenefit: '' },
      })),

    deleteLeaveBenefitSuccess: (response: LeaveBenefit) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefit: false },
        leaveBenefit: { ...state.leaveBenefit, deleteResponse: response },
      })),
    deleteLeaveBenefitFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefit: false },
        error: { ...state.error, errorLeaveBenefit: error },
      })),

    emptyResponse: () =>
      set((state) => ({
        ...state,
        leaveBenefit: {
          ...state.leaveBenefit,
          postResponse: {} as LeaveBenefit,
          updateResponse: {} as LeaveBenefit,
          deleteResponse: {} as LeaveBenefit,
        },
      })),
  }))
);
