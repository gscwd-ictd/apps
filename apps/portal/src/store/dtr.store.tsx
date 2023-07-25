/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import {
  EmployeeDtrWithSchedule,
  EmployeeDtrWithScheduleAndSummary,
} from 'libs/utils/src/lib/types/dtr.type';
import { devtools } from 'zustand/middleware';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

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

export type DtrState = {
  employeeDtr: EmployeeDtrWithScheduleAndSummary;
  employeeDailyRecord: EmployeeDtr;

  loading: {
    loadingDtr: boolean;
    loadingUpdateEmployeeDtr: boolean;
  };

  error: {
    errorDtr: string;
    errorUpdateEmployeeDtr: string;
  };

  selectedYear: string;
  setSelectedYear: (value: string) => void;

  selectedMonth: string;
  setSelectedMonth: (value: string) => void;

  date: string;
  setDate: (value: string) => void;

  getEmployeeDtr: (loading: boolean) => void;
  getEmployeeDtrSuccess: (loading: boolean, response) => void;
  getEmployeeDtrFail: (loading: boolean, error: string) => void;

  emptyResponseAndError: () => void;

  updateEmployeeDtr: () => void;
  updateEmployeeDtrSuccess: (response: EmployeeDtr) => void;
  updateEmployeeDtrFail: (error: string) => void;
};

export const useDtrStore = create<DtrState>()(
  devtools((set) => ({
    employeeDtr: {} as EmployeeDtrWithScheduleAndSummary,
    employeeDailyRecord: {} as EmployeeDtr,
    loading: {
      loadingDtr: false,
      loadingUpdateEmployeeDtr: false,
    },

    error: {
      errorDtr: '',
      errorUpdateEmployeeDtr: '',
    },
    selectedYear: '',
    selectedMonth: '',
    date: '01-0001',

    setSelectedYear: (selectedYear: string) => {
      set((state) => ({ ...state, selectedYear }));
    },
    setSelectedMonth: (selectedMonth: string) => {
      set((state) => ({ ...state, selectedMonth }));
    },
    setDate: (date: string) => {
      set((state) => ({ ...state, date }));
    },

    //GET DTR ACTIONS
    getEmployeeDtr: (loading: boolean) => {
      set((state) => ({
        ...state,
        employeeDtr: {} as EmployeeDtrWithScheduleAndSummary,
        loading: { ...state.loading, loadingDtr: loading },
        error: { ...state.error, errorDtr: '' },
      }));
    },
    getEmployeeDtrSuccess: (
      loading: boolean,
      response: EmployeeDtrWithScheduleAndSummary
    ) => {
      set((state) => ({
        ...state,
        employeeDtr: response,
        loading: { ...state.loading, loadingDtr: loading },
      }));
    },
    getEmployeeDtrFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingDtr: loading },
        error: { ...state.error, errorDtr: error },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        error: { ...state.error, errorDtr: '' },
      }));
    },

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
  }))
);
