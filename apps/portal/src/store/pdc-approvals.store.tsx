/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  NominatedEmployees,
  PdcChairmanApproval,
  PdcSecretariatApproval,
  RecommendedEmployee,
  Training,
} from '../../../../libs/utils/src/lib/types/training.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

export type PdcApprovalsState = {
  nominatedEmployeeList: Array<NominatedEmployees>;
  employeeList: Array<SelectOption>;
  trainingList: Array<Training>;
  individualTrainingDetails: Training;
  recommendedEmployees: Array<RecommendedEmployee>;
  response: {
    patchResponseApply: any;
    cancelResponse: any;
  };

  loading: {
    loadingTrainingList: boolean;
    loadingRecommendedEmployee: boolean;
    loadingResponse: boolean;
    loadingEmployeeList: boolean;
    loadingNominatedEmployeeList: boolean;
  };
  error: {
    errorTrainingList: string;
    errorRecommendedEmployee: string;
    errorResponse: string;
    errorEmployeeList: string;
    errorNominatedEmployeeList: string;
  };

  nominatedEmployees: Array<SelectOption>;
  setNominatedEmployees: (nominatedEmployees: Array<SelectOption>) => void;

  getRecommendedEmployees: (loading: boolean) => void;
  getRecommendedEmployeesSuccess: (loading: boolean, response) => void;
  getRecommendedEmployeesFail: (loading: boolean, error: string) => void;

  getNominatedEmployeeList: (loading: boolean) => void;
  getNominatedEmployeeListSuccess: (loading: boolean, response) => void;
  getNominatedEmployeeListFail: (loading: boolean, error: string) => void;

  getEmployeeList: (loading: boolean) => void;
  getEmployeeListSuccess: (loading: boolean, response) => void;
  getEmployeeListFail: (loading: boolean, error: string) => void;

  auxiliaryEmployees: Array<SelectOption>;
  setAuxiliaryEmployees: (auxiliaryEmployees: Array<SelectOption>) => void;

  trainingModalIsOpen: boolean;
  setTrainingModalIsOpen: (trainingModalIsOpen: boolean) => void;

  trainingNominationModalIsOpen: boolean;
  setTrainingNominationModalIsOpen: (trainingNominationModalIsOpen: boolean) => void;

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
    nominatedEmployeeList: [],
    employeeList: [],
    trainingList: [],
    individualTrainingDetails: {} as Training,
    response: {
      patchResponseApply: {},
      cancelResponse: {},
    },

    loading: {
      loadingTrainingList: false,
      loadingRecommendedEmployee: false,
      loadingResponse: false,
      loadingEmployeeList: false,
      loadingNominatedEmployeeList: false,
    },
    error: {
      errorTrainingList: '',
      errorRecommendedEmployee: '',
      errorResponse: '',
      errorEmployeeList: '',
      errorNominatedEmployeeList: '',
    },

    trainingModalIsOpen: false,
    trainingNominationModalIsOpen: false,
    confirmTrainingModalIsOpen: false,
    otpPdcModalIsOpen: false,

    nominatedEmployees: [],
    setNominatedEmployees: (nominatedEmployees: Array<SelectOption>) => {
      set((state) => ({ ...state, nominatedEmployees }));
    },

    recommendedEmployees: [],

    auxiliaryEmployees: [],
    setAuxiliaryEmployees: (auxiliaryEmployees: Array<SelectOption>) => {
      set((state) => ({ ...state, auxiliaryEmployees }));
    },

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

    setTrainingNominationModalIsOpen: (trainingNominationModalIsOpen: boolean) => {
      set((state) => ({ ...state, trainingNominationModalIsOpen }));
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

    getRecommendedEmployees: (loading: boolean) => {
      set((state) => ({
        ...state,
        recommendedEmployees: [],
        loading: {
          ...state.loading,
          loadingRecommendedEmployee: loading,
        },
        error: {
          ...state.error,
          errorRecommendedEmployee: '',
        },
      }));
    },
    getRecommendedEmployeesSuccess: (loading: boolean, response: Array<RecommendedEmployee>) => {
      set((state) => ({
        ...state,
        recommendedEmployees: response,
        loading: {
          ...state.loading,
          loadingRecommendedEmployee: loading,
        },
      }));
    },
    getRecommendedEmployeesFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingRecommendedEmployee: loading,
        },
        error: {
          ...state.error,
          errorRecommendedEmployee: error,
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

    //GET EMPLOYEE LIST ACTIONS
    getEmployeeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        employeeList: [],
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorEmployeeList: '',
        },
      }));
    },
    getEmployeeListSuccess: (loading: boolean, response: Array<SelectOption>) => {
      set((state) => ({
        ...state,
        employeeList: response,
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
      }));
    },
    getEmployeeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorEmployeeList: error,
        },
      }));
    },

    //GET EMPLOYEE LIST ACTIONS
    getNominatedEmployeeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        nominatedEmployeeList: [],
        loading: {
          ...state.loading,
          loadingNominatedEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorNominatedEmployeeList: '',
        },
      }));
    },
    getNominatedEmployeeListSuccess: (loading: boolean, response: Array<NominatedEmployees>) => {
      set((state) => ({
        ...state,
        nominatedEmployeeList: response,
        loading: {
          ...state.loading,
          loadingNominatedEmployeeList: loading,
        },
      }));
    },
    getNominatedEmployeeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingNominatedEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorNominatedEmployeeList: error,
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
          errorRecommendedEmployee: '',
          errorResponse: '',
        },
      }));
    },
  }))
);
