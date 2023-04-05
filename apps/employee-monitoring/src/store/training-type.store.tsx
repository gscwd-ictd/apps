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

  postTrainingType: () => void;
  postTrainingTypeSuccess: (response: TrainingType) => void;
  postTrainingTypeFail: (error: string) => void;

  updateTrainingType: () => void;
  updateTrainingTypeSuccess: (response: TrainingType) => void;
  updateTrainingTypeFail: (error: string) => void;

  deleteTrainingType: () => void;
  deleteTrainingTypeSuccess: (response: TrainingTypeId) => void;
  deleteTrainingTypeFail: (error: string) => void;

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

    postTrainingType: () =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          postResponse: {} as TrainingType,
        },
        loading: { ...state.loading, loadingTrainingType: true },
        error: { ...state.error, errorTrainingType: '' },
      })),
    postTrainingTypeSuccess: (response: TrainingType) =>
      set((state) => ({
        ...state,
        trainingType: { ...state.trainingType, postResponse: response },
        loading: { ...state.loading, loadingTrainingType: false },
      })),
    postTrainingTypeFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: false },
        error: { ...state.error, errorTrainingType: error },
      })),

    updateTrainingType: () =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          updateResponse: {} as TrainingType,
        },
        loading: { ...state.loading, loadingTrainingType: true },
        error: { ...state.error, errorTrainingType: '' },
      })),
    updateTrainingTypeSuccess: (response: TrainingType) =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          updateResponse: response,
        },
        loading: { ...state.loading, loadingTrainingType: false },
      })),
    updateTrainingTypeFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: false },
        error: { ...state.error, errorTrainingType: error },
      })),

    deleteTrainingType: () =>
      set((state) => ({
        ...state,
        trainingType: {
          ...state.trainingType,
          deleteResponse: {} as TrainingTypeId,
        },
        loading: { ...state.loading, loadingTrainingType: true },
        error: { ...state.error, errorTrainingType: '' },
      })),
    deleteTrainingTypeSuccess: (response: TrainingTypeId) =>
      set((state) => ({
        ...state,
        trainingType: { ...state.trainingType, deleteResponse: response },
        loading: { ...state.loading, loadingTrainingType: false },
      })),
    deleteTrainingTypeFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainingType: false },
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
        error: {
          ...state.error,
          errorTrainingTypes: '',
          errorTrainingType: '',
        },
      })),
  }))
);
