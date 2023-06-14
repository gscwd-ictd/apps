/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { EmployeeTimeLog } from 'libs/utils/src/lib/types/dtr.type';
import { devtools } from 'zustand/middleware';

export type DtrState = {
  employeeDtr: Array<EmployeeTimeLog>;
  responseDtr: Array<EmployeeTimeLog>;
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
};

export const useDtrStore = create<DtrState>()(
  devtools((set) => ({
    employeeDtr: [],
    responseDtr: [],
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
      response: Array<EmployeeTimeLog>
    ) => {
      set((state) => ({
        ...state,
        responseDtr: response,
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
  }))
);
