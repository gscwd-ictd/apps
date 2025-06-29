/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import {
  EmployeeDtrWithSchedule,
  EmployeeRestDay,
  EmployeeTimeLog,
} from '../../../../libs/utils/src/lib/types/dtr.type';
import { devtools } from 'zustand/middleware';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';

export type TimeLogState = {
  dtr: EmployeeTimeLog;
  schedule: Schedule & EmployeeRestDay;
  isHoliday: boolean | null;
  isRestDay: boolean | null;
  suspensionHours: number;
  loading: {
    loadingTimeLogs: boolean;
  };
  error: {
    errorTimeLogs: string;
  };

  getTimeLogs: (loading: boolean) => void;
  getTimeLogsSuccess: (loading: boolean, response) => void;
  getTimeLogsFail: (loading: boolean, error: string) => void;
};

export const useTimeLogStore = create<TimeLogState>()(
  devtools((set) => ({
    dtr: {} as EmployeeTimeLog,
    schedule: {} as Schedule & EmployeeRestDay,
    isHoliday: false,
    isRestDay: false,
    suspensionHours: 0,
    loading: {
      loadingTimeLogs: false,
    },
    error: {
      errorTimeLogs: '',
    },

    //GET TIME LOGS ACTIONS
    getTimeLogs: (loading: boolean) => {
      set((state) => ({
        ...state,
        dtr: {} as EmployeeTimeLog,
        schedule: {} as Schedule & EmployeeRestDay,
        isHoliday: null,
        isRestDay: null,
        suspensionHours: 0,
        loading: {
          ...state.loading,
          loadingTimeLogs: loading,
        },
        error: {
          ...state.error,
          errorTimeLogs: '',
        },
      }));
    },
    getTimeLogsSuccess: (loading: boolean, response: EmployeeDtrWithSchedule) => {
      set((state) => ({
        ...state,
        dtr: response.dtr,
        schedule: response.schedule,
        isHoliday: response.isHoliday,
        isRestDay: response.isRestDay,
        suspensionHours: response.suspensionHours,
        loading: {
          ...state.loading,
          loadingTimeLogs: loading,
        },
      }));
    },
    getTimeLogsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingTimeLogs: loading,
        },
        error: {
          ...state.error,
          errorTimeLogs: error,
        },
      }));
    },
  }))
);
