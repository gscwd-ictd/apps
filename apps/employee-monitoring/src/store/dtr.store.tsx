/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { EmployeeRowData } from '../utils/types/table-row-types/monitoring/employee.type';
import { devtools } from 'zustand/middleware';

type LoadingDtrEmployee = {
  loadingEmployeesAsOption: boolean;
  loadingEmployeeWithSchedule: boolean;
  loadingEmployeeDtr: boolean;
};

type ErrorDtrEmployee = {
  errorEmployeesAsOption: string;
  errorEmployeeWithSchedule: string;
  errorEmployeeDtr: string;
};

type ResponseDtrEmployee = {
  postResponse: EmployeeSchedule;
};

export type EmployeeSchedule = {
  employeeId: string;
  employeeName: string;
  schedule: Schedule;
};

export type EmployeeAttendance = {
  employeeId?: string;
  employeeName?: string;
  id: number;
  date: string;
  timeIn: string;
  timeOut: string;
  lunchIn: string;
  lunchOut: string;
  schedule: string;
  remarks?: string;
};

type Dtr = {
  id: string;
  companyId: string;
  dtrDate: string;
  timeIn: string | null;
  timeOut: string | null;
  lunchIn: string | null;
  lunchOut: string | null;
};

export type DtrWithSchedule = {
  day: string;
  companyId: string;
  schedule: Schedule & { restDaysNumbers: string; restDaysNames: string };
  dtr: Dtr & { remarks: string };
};

export type DailyTimeRecordState = {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedAssignment: string;
  setSelectedAssignment: (selectedAssignment: string) => void;
  dropdownAction: string;
  setDropdownAction: (dropdownAction: string) => void;
  selectedEmployee: EmployeeRowData;
  setSelectedEmployee: (selectedEmployee: EmployeeRowData) => void;
  employees: Array<EmployeeRowData>;
  isDateSearched: boolean;
  setIsDateSearched: (isDateSearched: boolean) => void;

  employeeWithSchedule: EmployeeSchedule;
  setEmployeeWithSchedule: (employeeWithSchedule: EmployeeSchedule) => void;
  loading: LoadingDtrEmployee;
  error: ErrorDtrEmployee;
  employeeSchedule: ResponseDtrEmployee;
  employeeDtr: Array<DtrWithSchedule>;
  setEmployeeDtr: (employeeDtr: Array<DtrWithSchedule>) => void;
  shouldFetchDtr: boolean;
  setShouldFetchDtr: (shouldFetchDtr: boolean) => void;

  getEmployeeDtr: () => void;
  getEmployeeDtrSuccess: (response: Array<DtrWithSchedule>) => void;
  getEmployeeDtrFail: (error: string) => void;

  getDtrEmployees: () => void;
  getDtrEmployeesFail: (error: string) => void;
  getDtrEmployeesSuccess: (response: Array<EmployeeRowData>) => void;

  getEmployeeSchedule: () => void;
  getEmployeeScheduleFail: (error: string) => void;
  getEmployeeScheduleSuccess: (response: EmployeeSchedule) => void;

  defineSchedule: () => void;
  defineScheduleSuccess: (response: EmployeeSchedule) => void;
  defineScheduleFail: (error: string) => void;

  emptyErrorsAndResponse: () => void;
};

export const useDtrStore = create<DailyTimeRecordState>()(
  devtools((set) => ({
    searchValue: '',
    selectedAssignment: '',
    dropdownAction: '',
    employees: [],
    employeeWithSchedule: {} as EmployeeSchedule,
    selectedEmployee: {} as EmployeeRowData,
    employeeSchedule: { postResponse: {} as EmployeeSchedule },
    date: '',
    error: {
      errorEmployeesAsOption: '',
      errorEmployeeWithSchedule: '',
      errorEmployeeDtr: '',
    },
    loading: {
      loadingEmployeesAsOption: false,
      loadingEmployeeWithSchedule: false,
      loadingEmployeeDtr: false,
    },
    isDateSearched: false,
    shouldFetchDtr: false,
    setShouldFetchDtr: (shouldFetchDtr: boolean) =>
      set((state) => ({ ...state, shouldFetchDtr })),
    setIsDateSearched: (isDateSearched: boolean) =>
      set((state) => ({ ...state, isDateSearched })),

    selectedMonth: '--',
    selectedYear: '--',
    employeeDtr: [],

    setEmployeeDtr: (response: Array<DtrWithSchedule>) =>
      set((state) => ({ ...state, employeeDtr: response })),

    setDate: (value: string) => set((state) => ({ ...state, date: value })),

    setSelectedMonth: (value: string) =>
      set((state) => ({ ...state, selectedMonth: value })),

    setSelectedYear: (value: string) =>
      set((state) => ({ ...state, selectedYear: value })),

    emptyErrorsAndResponse: () =>
      set((state) => ({
        ...state,
        error: {
          errorEmployeesAsOption: '',
          errorEmployeeWithSchedule: '',
          errorEmployeeDtr: '',
        },
        employeeSchedule: { postResponse: {} as EmployeeSchedule },
      })),
    setEmployeeWithSchedule: (employeeWithSchedule: EmployeeSchedule) =>
      set((state) => ({ ...state, employeeWithSchedule })),

    setSelectedEmployee: (selectedEmployee: EmployeeRowData) =>
      set((state) => ({ ...state, selectedEmployee })),
    setSearchValue: (searchValue: string) => {
      set((state) => ({ ...state, searchValue }));
    },
    setSelectedAssignment: (selectedAssignment: string) => {
      set((state) => ({ ...state, selectedAssignment }));
    },
    setDropdownAction: (dropdownAction: string) => {
      set((state) => ({ ...state, dropdownAction }));
    },

    getEmployeeDtr: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeDtr: true },
        error: { ...state.error, errorEmployeeDtr: '' },
        employeeDtr: [],
        // isDateSearched: true,
      })),

    getEmployeeDtrSuccess: (response: Array<DtrWithSchedule>) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeDtr: false },
        employeeDtr: response,
        isDateSearched: false,
      })),

    getEmployeeDtrFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeDtr: false },
        error: { ...state.error, errorEmployeeDtr: error },
        isDateSearched: false,
      })),

    defineSchedule: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: true },
        employeeSchedule: {
          ...state.employeeSchedule,
          postResponse: {} as EmployeeSchedule,
        },
        error: { ...state.error, errorEmployeeWithSchedule: '' },
      })),

    defineScheduleSuccess: (response: EmployeeSchedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: false },
        employeeSchedule: { ...state.employeeSchedule, postResponse: response },
      })),

    defineScheduleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: false },
        error: { ...state.error, errorEmployeeWithSchedule: error },
      })),

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

    getEmployeeSchedule: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: true },
        employeeWithSchedule: {} as EmployeeSchedule,
        error: { ...state.error, errorEmployeeWithSchedule: '' },
      })),

    getEmployeeScheduleSuccess: (response: EmployeeSchedule) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: false },
        employeeWithSchedule: response,
      })),

    getEmployeeScheduleFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeWithSchedule: false },
        error: { ...state.error, errorEmployeeWithSchedule: error },
      }));
    },
  }))
);
