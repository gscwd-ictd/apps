import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  EmployeeProfile,
  EmployeeId,
  EmployeeAsOption,
} from '../../../../libs/utils/src/lib/types/employee.type';

type LoadingEmployee = {
  loadingEmployees: boolean;
  loadingEmployeeAsOptions: boolean;
};

type ErrorEmployee = {
  errorEmployees: string;
  errorEmployeeAsOptions: string;
};

export type EmployeesState = {
  employees: Array<EmployeeProfile>;
  employeeIds: Array<EmployeeId>;
  employeeAsOptions: Array<EmployeeAsOption>;

  loading: LoadingEmployee;
  error: ErrorEmployee;

  getEmployeeAsOptions: () => void;
  getEmployeeAsOptionsSuccess: (response: Array<EmployeeAsOption>) => void;
  getEmployeeAsOptionsFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useEmployeeStore = create<EmployeesState>()(
  devtools((set) => ({
    employees: [],
    employeeIds: [],
    employeeAsOptions: [],
    loading: {
      loadingEmployees: false,
      loadingEmployeeAsOptions: false,
    },
    error: {
      errorEmployees: '',
      errorEmployeeAsOptions: '',
    },

    // actions to get list employee for dropdown option (id | fullName)
    getEmployeeAsOptions: () =>
      set((state) => ({
        ...state,
        employeeAsOptions: [],
        loading: { ...state.loading, loadingEmployeeAsOptions: true },
        error: { ...state.error, errorEmployeeAsOptions: '' },
      })),
    getEmployeeAsOptionsSuccess: (response: Array<EmployeeAsOption>) =>
      set((state) => ({
        ...state,
        employeeAsOptions: response,
        loading: { ...state.loading, loadingEmployeeAsOptions: false },
      })),
    getEmployeeAsOptionsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeAsOptions: false },
        error: { ...state.error, errorEmployeeAsOptions: error },
      })),

    // action to empty response and error states
    emptyResponse: () =>
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorEmployees: '',
          errorEmployeeAsOptions: '',
        },
      })),
  }))
);
