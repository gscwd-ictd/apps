/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  PdcChairmanApproval,
  PdcGeneralManagerApproval,
  PdcSecretariatApproval,
  Training,
  TrainingDetails,
} from '../../../../libs/utils/src/lib/types/training.type';

export type PdcApprovalsState = {
  trainingList: Array<Training>;
  individualTrainingDetails: Training; //for data table
  trainingDetails: TrainingDetails; //for modal info - same UI as L&D
  response: {
    patchResponseApply: any;
    cancelResponse: any;
  };
  loading: {
    loadingTrainingList: boolean;
    loadingTrainingDetails: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorTrainingList: string;
    errorTrainingDetails: string;
    errorResponse: string;
  };

  trainingModalIsOpen: boolean;
  setTrainingModalIsOpen: (trainingModalIsOpen: boolean) => void;

  trainingDesignModalIsOpen: boolean;
  setTrainingDesignModalIsOpen: (trainingDesignModalIsOpen: boolean) => void;

  confirmTrainingModalIsOpen: boolean;
  setConfirmTrainingModalIsOpen: (confirmTrainingModalIsOpen: boolean) => void;

  otpPdcModalIsOpen: boolean;
  setOtpPdcModalIsOpen: (otpPdcModalIsOpen: boolean) => void;

  captchaPdcModalIsOpen: boolean;
  setCaptchaPdcModalIsOpen: (captchaPdcModalIsOpen: boolean) => void;

  setIndividualTrainingDetails: (individualTrainingDetails: Training) => void;

  getTrainingSelectionList: (loading: boolean) => void;
  getTrainingSelectionListSuccess: (loading: boolean, response) => void;
  getTrainingSelectionListFail: (loading: boolean, error: string) => void;

  //get training details from L&D route
  getTrainingDetails: (loading: boolean) => void;
  getTrainingDetailsSuccess: (loading: boolean, response) => void;
  getTrainingDetailsFail: (loading: boolean, error: string) => void;

  patchTrainingSelection: () => void;
  patchTrainingSelectionSuccess: (response) => void;
  patchTrainingSelectionFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const usePdcApprovalsStore = create<PdcApprovalsState>()(
  devtools((set) => ({
    trainingList: [],
    individualTrainingDetails: {} as Training,
    trainingDetails: {} as TrainingDetails,
    response: {
      patchResponseApply: {},
      cancelResponse: {},
    },

    loading: {
      loadingTrainingList: false,
      loadingTrainingDetails: false,
      loadingResponse: false,
    },
    error: {
      errorTrainingList: '',
      errorTrainingDetails: '',
      errorResponse: '',
    },

    trainingDesignModalIsOpen: false,
    trainingModalIsOpen: false,
    confirmTrainingModalIsOpen: false,
    otpPdcModalIsOpen: false,
    captchaPdcModalIsOpen: false,

    setIndividualTrainingDetails: (individualTrainingDetails: Training) => {
      set((state) => ({ ...state, individualTrainingDetails }));
    },

    setTrainingDesignModalIsOpen: (trainingDesignModalIsOpen: boolean) => {
      set((state) => ({ ...state, trainingDesignModalIsOpen }));
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

    setCaptchaPdcModalIsOpen: (captchaPdcModalIsOpen: boolean) => {
      set((state) => ({ ...state, captchaPdcModalIsOpen }));
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

    getTrainingDetails: (loading: boolean) => {
      set((state) => ({
        ...state,
        trainingDetails: {} as TrainingDetails,
        loading: {
          ...state.loading,
          loadingTrainingDetails: loading,
        },
        error: {
          ...state.error,
          errorTrainingDetails: '',
        },
      }));
    },
    getTrainingDetailsSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        trainingDetails: response,
        loading: {
          ...state.loading,
          loadingTrainingDetails: loading,
        },
      }));
    },
    getTrainingDetailsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingTrainingDetails: loading,
        },
        error: {
          ...state.error,
          errorTrainingDetails: error,
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
    patchTrainingSelectionSuccess: (
      response: PdcChairmanApproval | PdcSecretariatApproval | PdcGeneralManagerApproval
    ) => {
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
