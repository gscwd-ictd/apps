import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  TrainingTypeId,
  TrainingType,
} from 'libs/utils/src/lib/types/training-type.type';

type ResponseTrainingType = {
  postResponse: TrainingType;
  updateResponse: TrainingType;
  deleteResponse: TrainingTypeId;
};

type LoadingTrainingType = {
  loadingTrainingTypes: boolean;
  loadingTrainingType: boolean;
};

type ErrorTrainingType = {
  errorTrainingTypes: string;
  errorTrainingType: string;
};

export type TrainingTypesState = {
  trainingTypes: Array<TrainingType>;
  trainingType: ResponseTrainingType;
  loading: LoadingTrainingType;
  error: ErrorTrainingType;

  getTrainingTypes: (loading: boolean) => void;
  getTrainingTypesSuccess: (
    loading: boolean,
    response: Array<TrainingType>
  ) => void;
  getTrainingTypesFail: (loading: boolean, error: string) => void;

  postTrainingType: (loading: boolean) => void;
  postTrainingTypeSuccess: (loading: boolean, response: TrainingType) => void;
  postTrainingTypeFail: (loading: boolean, error: string) => void;

  updateTrainingType: (loading: boolean) => void;
  updateTrainingTypeSuccess: (loading: boolean, response: TrainingType) => void;
  updateTrainingTypeFail: (loading: boolean, error: string) => void;

  deleteTrainingType: (loading: boolean) => void;
  deleteTrainingTypeSuccess: (
    loading: boolean,
    response: TrainingTypeId
  ) => void;
  deleteTrainingTypeFail: (loading: boolean, error: string) => void;

  emptyResponse: () => void;
};

export const useTrainingTypesStore = create<TrainingTypesState>()(
  devtools((set) => ({
    trainingTypes: [],
    trainingType: {
      postResponse: {} as TrainingType,
      updateResponse: {} as TrainingType,
      deleteResponse: {} as TrainingTypeId,
    },
    loading: {
      loadingTrainingTypes: false,
      loadingTrainingType: false,
    },
    error: {
      errorTrainingTypes: '',
      errorTrainingType: '',
    },

    getTrainingTypes: (loading: boolean) =>
      set((state) => ({
        ...state,
        trainingTypes: [],
        loading: { ...state.loading, loadingTrainingTypes: loading },
        error: { ...state.error, errorTrainingTypes: '' },
      })),
    getTrainingTypesSuccess: (
      loading: boolean,
      response: Array<TrainingType>
    ) =>
      set((state) => ({
        ...state,
        trainingTypes: response,
        loading: { ...state.loading, loadingTrainingTypes: loading },
      })),
    getTrainingTypesFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingTypes: loading },
        error: { ...state.error, errorTrainingTypes: error },
      })),

    postTrainingType: (loading: boolean) =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          postResponse: {} as TrainingType,
        },
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: '' },
      })),
    postTrainingTypeSuccess: (loading: boolean, response: TrainingType) =>
      set((state) => ({
        ...state,
        trainingType: { ...state.trainingType, postResponse: response },
        loading: { ...state.loading, loadingTrainingType: loading },
      })),
    postTrainingTypeFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: error },
      })),

    updateTrainingType: (loading: boolean) =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          updateResponse: {} as TrainingType,
        },
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: '' },
      })),
    updateTrainingTypeSuccess: (loading: boolean, response: TrainingType) =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          updateResponse: response,
        },
        loading: { ...state.loading, loadingTrainingType: loading },
      })),
    updateTrainingTypeFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: error },
      })),

    deleteTrainingType: (loading: boolean) =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          deleteResponse: {} as TrainingTypeId,
        },
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: '' },
      })),
    deleteTrainingTypeSuccess: (loading: boolean, response: TrainingTypeId) =>
      set((state) => ({
        ...state,
        trainingType: { ...state.trainingType, deleteResponse: response },
        loading: { ...state.loading, loadingTrainingType: loading },
      })),
    deleteTrainingTypeFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: loading },
        error: { ...state.error, errorTrainingType: error },
      })),

    emptyResponse: () =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          postResponse: {} as TrainingType,
          updateResponse: {} as TrainingType,
          deleteResponse: {} as TrainingTypeId,
        },
      })),
  }))
);
