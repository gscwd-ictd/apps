/* eslint-disable @nx/enforce-module-boundaries */
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { create } from 'zustand';
import { EmployeeRowData } from '../utils/types/table-row-types/monitoring/employee.type';
import { devtools } from 'zustand/middleware';
import {
  EmployeeDtrWithScheduleAndSummary,
  EmployeeDtrWithSummary,
  DtrRemarksToSelectedDates,
  DtrRemarks,
} from 'libs/utils/src/lib/types/dtr.type';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

type LoadingDtrEmployee = {
  loadingEmployeesAsOption: boolean;
  loadingEmployeeWithSchedule: boolean;
  loadingEmployeeDtr: boolean;
  loadingUpdateEmployeeDtr: boolean;
  loadingAddDtrRemarksToSelectedDates: boolean;
  loadingUpdateDtrRemarks: boolean;
};

type ErrorDtrEmployee = {
  errorEmployeesAsOption: string;
  errorEmployeeWithSchedule: string;
  errorEmployeeDtr: string;
  errorUpdateEmployeeDtr: string;
  errorAddDtrRemarksToSelectedDates: string;
  errorUpdateDtrRemarks: string;
};

type ResponseDtrEmployee = {
  postResponse: EmployeeSchedule;
};

type ResponseDtrRemarksToSelectedDates = {
  postResponse: DtrRemarksToSelectedDates;
};

type ResponseDtrRemarks = {
  patchResponse: DtrRemarks;
};

export type EmployeeDtr = {
  companyId: string;
  dtrDate: string;
  timeIn: string | null;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;
  shift: ScheduleShifts | null;
  withLunch: boolean;
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

  dtrRemarksToSelectedDates: ResponseDtrRemarksToSelectedDates;
  dtrRemarks: ResponseDtrRemarks;

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

  addDtrRemarksToSelectedDates: () => void;
  addDtrRemarksToSelectedDatesSuccess: (response: DtrRemarksToSelectedDates) => void;
  addDtrRemarksToSelectedDatesFail: (error: string) => void;

  updateDtrRemarks: () => void;
  updateDtrRemarksSuccess: (response: DtrRemarks) => void;
  updateDtrRemarksFail: (error: string) => void;

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
    dtrRemarksToSelectedDates: { postResponse: {} as DtrRemarksToSelectedDates },
    dtrRemarks: { patchResponse: {} as DtrRemarks },
    date: '',
    error: {
      errorEmployeesAsOption: '',
      errorEmployeeWithSchedule: '',
      errorEmployeeDtr: '',
      errorUpdateEmployeeDtr: '',
      errorAddDtrRemarksToSelectedDates: '',
      errorUpdateDtrRemarks: '',
    },
    loading: {
      loadingEmployeesAsOption: false,
      loadingEmployeeWithSchedule: false,
      loadingEmployeeDtr: false,
      loadingUpdateEmployeeDtr: false,
      loadingAddDtrRemarksToSelectedDates: false,
      loadingUpdateDtrRemarks: false,
    },
    employeeDailyRecord: {} as EmployeeDtr,
    isDateSearched: false,
    setIsDateSearched: (isDateSearched: boolean) => set((state) => ({ ...state, isDateSearched })),

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

    setSelectedMonth: (value: string) => set((state) => ({ ...state, selectedMonth: value })),

    setSelectedYear: (value: string) => set((state) => ({ ...state, selectedYear: value })),

    emptyErrorsAndResponse: () =>
      set((state) => ({
        ...state,
        error: {
          errorEmployeesAsOption: '',
          errorEmployeeWithSchedule: '',
          errorEmployeeDtr: '',
          errorUpdateEmployeeDtr: '',
          errorAddDtrRemarksToSelectedDates: '',
          errorUpdateDtrRemarks: '',
        },
        employeeSchedule: { postResponse: {} as EmployeeSchedule },
        dtrRemarksToSelectedDates: { postResponse: {} as DtrRemarksToSelectedDates },
        dtrRemarks: { patchResponse: {} as DtrRemarks },
      })),
    setEmployeeWithSchedule: (employeeWithSchedule: EmployeeSchedule) =>
      set((state) => ({ ...state, employeeWithSchedule })),

    setSelectedEmployee: (selectedEmployee: EmployeeRowData) => set((state) => ({ ...state, selectedEmployee })),
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
        // isDateSearched: false,
      })),

    getEmployeeDtrFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingEmployeeDtr: false },
        error: { ...state.error, errorEmployeeDtr: error },
        // isDateSearched: false,
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
        // isDateSearched: true,
      })),

    updateEmployeeDtrFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateEmployeeDtr: false },
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

    addDtrRemarksToSelectedDates: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingAddDtrRemarksToSelectedDates: true },
        dtrRemarksToSelectedDates: { postResponse: {} as DtrRemarksToSelectedDates },
        error: { ...state.error, errorAddDtrRemarksToSelectedDates: '' },
      })),

    addDtrRemarksToSelectedDatesSuccess: (response: DtrRemarksToSelectedDates) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingAddDtrRemarksToSelectedDates: false },
        dtrRemarksToSelectedDates: { postResponse: response },
      })),

    addDtrRemarksToSelectedDatesFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingAddDtrRemarksToSelectedDates: false },
        error: { ...state.error, errorAddDtrRemarksToSelectedDates: error },
      })),

    updateDtrRemarks: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateDtrRemarks: true },
        dtrRemarks: { patchResponse: {} as DtrRemarks },
        error: { ...state.error, errorUpdateDtrRemarks: '' },
      })),

    updateDtrRemarksSuccess: (response: DtrRemarks) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateDtrRemarks: false },
        dtrRemarks: { patchResponse: response },
      })),

    updateDtrRemarksFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateDtrRemarks: false },
        error: { ...state.error, errorUpdateDtrRemarks: error },
      })),
  }))
);
