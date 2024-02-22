/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  PdcChairmanApproval,
  PdcSecretariatApproval,
  Training,
} from '../../../../libs/utils/src/lib/types/training.type';

export type PdcApprovalsState = {
  trainingList: Array<Training>;
  individualTrainingDetails: Training;
  response: {
    patchResponseApply: any;
    cancelResponse: any;
  };
  loading: {
    loadingTrainingList: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorTrainingList: string;
    errorResponse: string;
  };

  trainingModalIsOpen: boolean;
  setTrainingModalIsOpen: (trainingModalIsOpen: boolean) => void;

  confirmTrainingModalIsOpen: boolean;
  setConfirmTrainingModalIsOpen: (confirmTrainingModalIsOpen: boolean) => void;

  otpPdcModalIsOpen: boolean;
  setOtpPdcModalIsOpen: (otpPdcModalIsOpen: boolean) => void;

  setIndividualTrainingDetails: (individualTrainingDetails: Training) => void;
  getTrainingSelectionList: (loading: boolean) => void;
  getTrainingSelectionListSuccess: (loading: boolean, response) => void;
  getTrainingSelectionListFail: (loading: boolean, error: string) => void;

  patchTrainingSelection: () => void;
  patchTrainingSelectionSuccess: (response) => void;
  patchTrainingSelectionFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const usePdcApprovalsStore = create<PdcApprovalsState>()(
  devtools((set) => ({
    trainingList: [],
    individualTrainingDetails: {} as Training,
    response: {
      patchResponseApply: {},
      cancelResponse: {},
    },

    loading: {
      loadingTrainingList: false,
      loadingResponse: false,
    },
    error: {
      errorTrainingList: '',
      errorResponse: '',
    },

    trainingModalIsOpen: false,
    confirmTrainingModalIsOpen: false,
    otpPdcModalIsOpen: false,

    setIndividualTrainingDetails: (individualTrainingDetails: Training) => {
      set((state) => ({ ...state, individualTrainingDetails }));
    },

    setTrainingModalIsOpen: (trainingModalIsOpen: boolean) => {
      set((state) => ({ ...state, trainingModalIsOpen }));
    },

    setConfirmTrainingModalIsOpen: (confirmTrainingModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmTrainingModalIsOpen }));
    },

    setOtpPdcModalIsOpen: (otpPdcModalIsOpen: boolean) => {
      set((state) => ({ ...state, otpPdcModalIsOpen }));
    },

    getTrainingSelectionList: (loading: boolean) => {
      set((state) => ({
        ...state,
        trainingList: [],
        loading: {
          ...state.loading,
          loadingTrainingList: loading,
        },
        error: {
          ...state.error,
          errorTrainingList: '',
        },
      }));
    },
    getTrainingSelectionListSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        trainingList: response,
        loading: {
          ...state.loading,
          loadingTrainingList: loading,
        },
      }));
    },
    getTrainingSelectionListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingTrainingList: loading,
        },
        error: {
          ...state.error,
          errorTrainingList: error,
        },
      }));
    },

    patchTrainingSelection: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
    patchTrainingSelectionSuccess: (response: PdcChairmanApproval | PdcSecretariatApproval) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchTrainingSelectionFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        error: {
          ...state.error,
          errorResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
          cancelResponse: {},
        },
        error: {
          ...state.error,
          errorTrainingList: '',
          errorResponse: '',
        },
      }));
    },
  }))
);
