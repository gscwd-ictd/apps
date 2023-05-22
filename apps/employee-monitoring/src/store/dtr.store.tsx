/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { EmployeeRowData } from '../utils/types/table-row-types/monitoring/employee.type';

type LoadingDtrEmployee = {
  loadingEmployeesAsOption: boolean;
  loadingEmployeeWithSchedule: boolean;
};

type ErrorDtrEmployee = {
  errorEmployeesAsOption: string;
  errorEmployeeWithSchedule: string;
};

type ResponseDtrEmployee = {
  postResponse: EmployeeSchedule;
};

export type EmployeeSchedule = {
  employeeId: string;
  employeeName: string;
  schedule: Schedule;
};

export type DailyTimeRecordState = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedAssignment: string;
  setSelectedAssignment: (selectedAssignment: string) => void;
  dropdownAction: string;
  setDropdownAction: (dropdownAction: string) => void;
  selectedEmployee: EmployeeRowData;
  setSelectedEmployee: (selectedEmployee: EmployeeRowData) => void;
  employees: Array<EmployeeRowData>;
  employeeWithSchedule: EmployeeSchedule;
  setEmployeeWithSchedule: (employeeWithSchedule: EmployeeSchedule) => void;
  loading: LoadingDtrEmployee;
  error: ErrorDtrEmployee;
  employeeDtr: ResponseDtrEmployee;

  getDtrEmployees: () => void;
  getDtrEmployeesFail: (error: string) => void;
  getDtrEmployeesSuccess: (response: Array<EmployeeRowData>) => void;

  getEmployeeSchedule: () => void;
  getEmployeeScheduleFail: (error: string) => void;
  getEmployeeScheduleSuccess: (response: EmployeeSchedule) => void;

  defineSchedule: () => void;
  defineScheduleSuccess: (response: EmployeeSchedule) => void;
  defineScheduleFail: (error: string) => void;
};

export const useDtrStore = create<DailyTimeRecordState>((set) => ({
  searchValue: '',
  selectedAssignment: '',
  dropdownAction: '',
  employees: [],
  employeeWithSchedule: {} as EmployeeSchedule,
  selectedEmployee: {} as EmployeeRowData,
  employeeDtr: { postResponse: {} as EmployeeSchedule },
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

  defineSchedule: () =>
    set((state) => ({
      ...state,
      loading: { ...state.loading, loadingEmployeeWithSchedule: true },
      employeeDtr: {
        ...state.employeeDtr,
        postResponse: {} as EmployeeSchedule,
      },
      error: { ...state.error, errorEmployeeWithSchedule: '' },
    })),

  defineScheduleSuccess: (response: EmployeeSchedule) =>
    set((state) => ({
      ...state,
      loading: { ...state.loading, loadingEmployeeWithSchedule: true },
      employeeDtr: { ...state.employeeDtr, postResponse: response },
    })),

  defineScheduleFail: (error: string) =>
    set((state) => ({
      ...state,
      loading: { ...state.loading, loadingEmployeeWithSchedule: true },
      error: { ...state.error, errorEmployeeWithSchedule: error },
    })),

  loading: {
    loadingEmployeesAsOption: false,
    loadingEmployeeWithSchedule: false,
  },
  error: { errorEmployeesAsOption: '', errorEmployeeWithSchedule: '' },

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
}));
