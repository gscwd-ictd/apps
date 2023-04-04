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

  getEmployeeAsOptions: (loading: boolean) => void;
  getEmployeeAsOptionsSuccess: (
    loading: boolean,
    response: Array<EmployeeAsOption>
  ) => void;
  getEmployeeAsOptionsFail: (loading: boolean, error: string) => void;

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
    getEmployeeAsOptions: (loading: boolean) =>
      set((state) => ({
        ...state,
        employeeAsOptions: [],
        loading: { ...state.loading, loadingEmployeeAsOptions: loading },
        error: { ...state.error, errorEmployeeAsOptions: '' },
      })),
    getEmployeeAsOptionsSuccess: (
      loading: boolean,
      response: Array<EmployeeAsOption>
    ) =>
      set((state) => ({
        ...state,
        employeeAsOptions: response,
        loading: { ...state.loading, loadingEmployeeAsOptions: loading },
      })),
    getEmployeeAsOptionsFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeAsOptions: loading },
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
