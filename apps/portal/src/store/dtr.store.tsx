/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { devtools } from 'zustand/middleware';

export type DtrState = {
  employeeDtr: Array<EmployeeDtrWithSchedule>;
  loadingDtr: boolean;
  errorDtr: string;

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
};

export const useDtrStore = create<DtrState>()(
  devtools((set) => ({
    employeeDtr: [],
    loadingDtr: false,
    errorDtr: '',
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
        employeeDtr: [],
        loadingDtr: loading,
        errorDtr: '',
      }));
    },
    getEmployeeDtrSuccess: (
      loading: boolean,
      response: Array<EmployeeDtrWithSchedule>
    ) => {
      set((state) => ({
        ...state,
        employeeDtr: response,
        loadingDtr: loading,
      }));
    },
    getEmployeeDtrFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loadingDtr: loading,
        errorDtr: error,
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        errorDtr: '',
      }));
    },
  }))
);
