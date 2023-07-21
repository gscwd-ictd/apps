/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { EmployeeRowData } from '../utils/types/table-row-types/monitoring/employee.type';
import { devtools } from 'zustand/middleware';
import {
  EmployeeDtrWithSchedule,
  EmployeeDtrWithScheduleAndSummary,
  EmployeeDtrWithSummary,
  EmployeeTimeLog,
} from 'libs/utils/src/lib/types/dtr.type';

type LoadingDtrEmployee = {
  loadingEmployeesAsOption: boolean;
  loadingEmployeeWithSchedule: boolean;
  loadingEmployeeDtr: boolean;
  loadingUpdateEmployeeDtr: boolean;
};

type ErrorDtrEmployee = {
  errorEmployeesAsOption: string;
  errorEmployeeWithSchedule: string;
  errorEmployeeDtr: string;
  errorUpdateEmployeeDtr: string;
};

type ResponseDtrEmployee = {
  postResponse: EmployeeSchedule;
};

type EmployeeDtr = {
  companyId: string | null;
  dtrDate: string | null;
  timeIn: string | null;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;
};

export type EmployeeSchedule = {
  employeeId: string;
  employeeName: string;
  schedule: Schedule;
};

export type DailyTimeRecordState = {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  searchValue: string;
  employeeDailyRecord: EmployeeDtr;
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
  employeeDtr: EmployeeDtrWithScheduleAndSummary;
  setEmployeeDtr: (employeeDtr: EmployeeDtrWithScheduleAndSummary) => void;

  getEmployeeDtr: () => void;
  getEmployeeDtrSuccess: (response: EmployeeDtrWithScheduleAndSummary) => void;
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

  updateEmployeeDtr: () => void;
  updateEmployeeDtrSuccess: (response: EmployeeDtr) => void;
  updateEmployeeDtrFail: (error: string) => void;

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
      errorUpdateEmployeeDtr: '',
    },
    loading: {
      loadingEmployeesAsOption: false,
      loadingEmployeeWithSchedule: false,
      loadingEmployeeDtr: false,
      loadingUpdateEmployeeDtr: false,
    },
    employeeDailyRecord: {} as EmployeeDtr,
    isDateSearched: false,
    setIsDateSearched: (isDateSearched: boolean) =>
      set((state) => ({ ...state, isDateSearched })),

    selectedMonth: '--',
    selectedYear: '--',
    employeeDtr: {
      dtrDays: [],
      summary: {
        lateDates: [],
        noAttendance: [],
        noOfTimesHalfDay: null,
        noOfTimesLate: null,
        noOfTimesUndertime: null,
        totalMinutesLate: null,
        totalMinutesUndertime: null,
        undertimeDates: [],
      } as EmployeeDtrWithSummary,
    },

    setEmployeeDtr: (response: EmployeeDtrWithScheduleAndSummary) =>
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
          errorUpdateEmployeeDtr: '',
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
        employeeDtr: {
          dtrDays: [],
          summary: {
            lateDates: [],
            noAttendance: [],
            noOfTimesHalfDay: null,
            noOfTimesLate: null,
            noOfTimesUndertime: null,
            totalMinutesLate: null,
            totalMinutesUndertime: null,
            undertimeDates: [],
          } as EmployeeDtrWithSummary,
        } as EmployeeDtrWithScheduleAndSummary,
        // isDateSearched: true,
      })),

    getEmployeeDtrSuccess: (response: EmployeeDtrWithScheduleAndSummary) =>
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

    updateEmployeeDtr: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateEmployeeDtr: true },
        employeeDailyRecord: {} as EmployeeDtr,
        error: { ...state.error, errorUpdateEmployeeDtr: '' },
      })),

    updateEmployeeDtrSuccess: (response: EmployeeDtr) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateEmployeeDtr: false },
        employeeDailyRecord: response,
      })),

    updateEmployeeDtrFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateEmployeeDtr: true },
        error: { ...state.error, errorUpdateEmployeeDtr: error },
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
