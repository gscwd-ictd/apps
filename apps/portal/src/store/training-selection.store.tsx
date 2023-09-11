/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Training } from '../../../../libs/utils/src/lib/types/training.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

type NominatedEmployees = {
  name: string;
  id: string;
  acknowledgment: string;
};
export type TrainingSelectionState = {
  trainingList: Array<Training>;
  individualTrainingDetails: Training;
  response: {
    postResponseApply: any;
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

  nominatedEmployees: Array<SelectOption>;
  setNominatedEmployees: (nominatedEmployees: Array<SelectOption>) => void;

  auxiliaryEmployees: Array<SelectOption>;
  setAuxiliaryEmployees: (auxiliaryEmployees: Array<SelectOption>) => void;

  trainingModalIsOpen: boolean;
  setTrainingModalIsOpen: (trainingModalIsOpen: boolean) => void;

  trainingNominationModalIsOpen: boolean;
  setTrainingNominationModalIsOpen: (trainingNominationModalIsOpen: boolean) => void;

  setIndividualTrainingDetails: (individualTrainingDetails: Training) => void;
  getTrainingSelectionList: (loading: boolean) => void;
  getTrainingSelectionListSuccess: (loading: boolean, response) => void;
  getTrainingSelectionListFail: (loading: boolean, error: string) => void;

  postTrainingSelection: () => void;
  postTrainingSelectionSuccess: (response) => void;
  postTrainingSelectionFail: (error: string) => void;

  emptyResponseAndError: () => void;
};

export const useTrainingSelectionStore = create<TrainingSelectionState>()(
  devtools((set) => ({
    trainingList: [],
    individualTrainingDetails: {} as Training,
    response: {
      postResponseApply: {},
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
    trainingNominationModalIsOpen: false,

    nominatedEmployees: [],
    setNominatedEmployees: (nominatedEmployees: Array<SelectOption>) => {
      set((state) => ({ ...state, nominatedEmployees }));
    },

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

    postTrainingSelection: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {},
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
    postTrainingSelectionSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    postTrainingSelectionFail: (error: string) => {
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
          postResponseApply: {},
          cancelResponse: {},
        },
        error: {
          ...state.error,
          errorResponse: '',
          errorPassSlips: '',
        },
      }));
    },
  }))
);
