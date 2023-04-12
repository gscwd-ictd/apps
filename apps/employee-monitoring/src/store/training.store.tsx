import { EmployeeAsOption } from 'libs/utils/src/lib/types/employee.type';
import { Training, TrainingId } from 'libs/utils/src/lib/types/training.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ResponseTraining = {
  postResponse: Training;
  updateResponse: Training;
  deleteResponse: TrainingId;
};

type LoadingTraining = {
  loadingEmployees: boolean;
  loadingTrainings: boolean;
  loadingTraining: boolean;
};

type ErrorTraining = {
  errorTrainings: string;
  errorTraining: string;
  errorEmployees: string;
};

export type TrainingsState = {
  trainings: Array<Training>;
  training: ResponseTraining;
  loading: LoadingTraining;
  error: ErrorTraining;
  assignedEmployees: Array<EmployeeAsOption>;
  employeeIdsForRemove: Array<string>;
  setAssignedEmployees: (assignedEmployees: Array<EmployeeAsOption>) => void;
  setEmployeeIdsForRemove: (employeeId: string) => void;

  getAssignedEmployees: () => void;
  getAssignedEmployeesSuccess: (response: Array<EmployeeAsOption>) => void;
  getAssignedEmployeesFail: (error: string) => void;

  getTrainings: (loading: boolean) => void;
  getTrainingsSuccess: (response: Array<Training>) => void;
  getTrainingsFail: (error: string) => void;

  postTraining: (loading: boolean) => void;
  postTrainingSuccess: (response: Training) => void;
  postTrainingFail: (error: string) => void;

  updateTraining: (loading: boolean) => void;
  updateTrainingSuccess: (response: Training) => void;
  updateTrainingFail: (error: string) => void;

  deleteTraining: (loading: boolean) => void;
  deleteTrainingSuccess: (response: TrainingId) => void;
  deleteTrainingFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useTrainingsStore = create<TrainingsState>()(
  devtools((set, get) => ({
    trainings: [],
    assignedEmployees: [],
    employeeIdsForRemove: [],
    training: {
      postResponse: {} as Training,
      updateResponse: {} as Training,
      deleteResponse: {} as TrainingId,
    },
    loading: {
      loadingTrainings: false,
      loadingTraining: false,
      loadingEmployees: false,
    },
    error: {
      errorTrainings: '',
      errorTraining: '',
      errorEmployees: '',
    },

    setEmployeeIdsForRemove: (employeeId: string) => {
      const empIds = get().employeeIdsForRemove;
      set((state) => ({
        ...state,
        employeeIdsForRemove: [...empIds, employeeId],
      }));
    },

    setAssignedEmployees: (assignedEmployees: Array<EmployeeAsOption>) =>
      set((state) => ({ ...state, assignedEmployees })),

    getAssignedEmployees: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployees: true },
        error: { ...state.error, errorEmployees: '' },
      })),

    getAssignedEmployeesSuccess: (response: Array<EmployeeAsOption>) =>
      set((state) => ({
        ...state,
        assignedEmployees: response,
        loading: { ...state.loading, loadingEmployees: false },
      })),

    getAssignedEmployeesFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorEmployees: error },
      })),

    getTrainings: (loading: boolean) =>
      set((state) => ({
        ...state,
        trainings: [],
        loading: { ...state.loading, loadingTrainings: loading },
        error: { ...state.error, errorTrainings: '' },
      })),
    getTrainingsSuccess: (response: Array<Training>) =>
      set((state) => ({
        ...state,
        trainings: response,
        loading: { ...state.loading, loadingTrainings: false },
      })),
    getTrainingsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTrainings: false },
        error: { ...state.error, errorTrainings: error },
      })),

    postTraining: () =>
      set((state) => ({
        ...state,
        training: {
          ...state.training,
          postResponse: {} as Training,
        },
        loading: { ...state.loading, loadingTraining: true },
        error: { ...state.error, errorTraining: '' },
      })),
    postTrainingSuccess: (response: Training) =>
      set((state) => ({
        ...state,
        training: { ...state.training, postResponse: response },
        loading: { ...state.loading, loadingTraining: false },
      })),
    postTrainingFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTraining: false },
        error: { ...state.error, errorTraining: error },
      })),

    updateTraining: () =>
      set((state) => ({
        ...state,
        training: {
          ...state.training,
          updateResponse: {} as Training,
        },
        loading: { ...state.loading, loadingTraining: true },
        error: { ...state.error, errorTraining: '' },
      })),
    updateTrainingSuccess: (response: Training) =>
      set((state) => ({
        ...state,
        training: {
          ...state.training,
          updateResponse: response,
        },
        loading: { ...state.loading, loadingTraining: false },
      })),
    updateTrainingFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTraining: false },
        error: { ...state.error, errorTraining: error },
      })),

    deleteTraining: () =>
      set((state) => ({
        ...state,
        training: {
          ...state.training,
          deleteResponse: {} as TrainingId,
        },
        loading: { ...state.loading, loadingTraining: true },
        error: { ...state.error, errorTraining: '' },
      })),
    deleteTrainingSuccess: (response: TrainingId) =>
      set((state) => ({
        ...state,
        training: { ...state.training, deleteResponse: response },
        loading: { ...state.loading, loadingTraining: false },
      })),
    deleteTrainingFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingTraining: false },
        error: { ...state.error, errorTraining: error },
      })),

    emptyResponse: () =>
      set((state) => ({
        ...state,
        training: {
          ...state.training,
          postResponse: {} as Training,
          updateResponse: {} as Training,
          deleteResponse: {} as TrainingId,
        },
        error: {
          ...state.error,
          errorTrainings: '',
          errorTraining: '',
        },
      })),
  }))
);
