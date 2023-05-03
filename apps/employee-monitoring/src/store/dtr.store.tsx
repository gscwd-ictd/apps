import { create } from 'zustand';
import { EmployeeRowData } from '../utils/types/table-row-types/monitoring/employee.type';

type LoadingDtrEmployee = {
  loadingEmployeesAsOption: boolean;
};

type ErrorDtrEmployee = {
  errorEmployeesAsOption: string;
};

export type DailyTimeRecordState = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedAssignment: string;
  setSelectedAssignment: (selectedAssignment: string) => void;
  dropdownAction: string;
  setDropdownAction: (dropdownAction: string) => void;
  employees: Array<EmployeeRowData>;

  loading: LoadingDtrEmployee;
  error: ErrorDtrEmployee;

  getDtrEmployees: () => void;
  getDtrEmployeesFail: (error: string) => void;
  getDtrEmployeesSuccess: (response: Array<EmployeeRowData>) => void;
};

export const useDtrStore = create<DailyTimeRecordState>((set) => ({
  searchValue: '',
  selectedAssignment: '',
  dropdownAction: '',
  employees: [],
  setSearchValue: (searchValue: string) => {
    set((state) => ({ ...state, searchValue }));
  },
  setSelectedAssignment: (selectedAssignment: string) => {
    set((state) => ({ ...state, selectedAssignment }));
  },
  setDropdownAction: (dropdownAction: string) => {
    set((state) => ({ ...state, dropdownAction }));
  },

  loading: { loadingEmployeesAsOption: false },
  error: { errorEmployeesAsOption: '' },

  getDtrEmployees: () =>
    set((state) => ({
      ...state,
      employees: [],
      loading: { ...state.loading, loadingEmployeesAsOption: true },
    })),

  getDtrEmployeesSuccess: (response: Array<EmployeeRowData>) =>
    set((state) => ({
      ...state,
      employees: response,
      loading: { ...state.loading, loadingEmployeesAsOption: false },
    })),

  getDtrEmployeesFail: (error: string) =>
    set((state) => ({
      ...state,
      loading: { ...state.loading, loadingEmployeesAsOption: false },
      error: { ...state.error, errorEmployeesAsOption: error },
    })),
}));
