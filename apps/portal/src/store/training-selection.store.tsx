/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TrainingSelectionState = {
  trainingList: Array<string>;
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

  trainingListModalIsOpen: boolean;
  setTrainingListModalIsOpen: (trainingListModalIsOpen: boolean) => void;

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

    trainingListModalIsOpen: false,

    setTrainingListModalIsOpen: (trainingListModalIsOpen: boolean) => {
      set((state) => ({ ...state, trainingListModalIsOpen }));
    },

    //GET PASS SLIP ACTIONS
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
        passSlips: response,
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
        response: {
          ...state.response,
          postResponseApply: null,
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
