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

    loading: {
      loadingTimeLogs: false,
    },
    error: {
      errorTimeLogs: '',
    },

    //GET PASS SLIP ACTIONS
    getTimeLogs: (loading: boolean) => {
      set((state) => ({
        ...state,
        dtr: {} as EmployeeTimeLog,
        schedule: {} as Schedule & EmployeeRestDay,
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
    getTimeLogsSuccess: (
      loading: boolean,
      response: EmployeeDtrWithSchedule
    ) => {
      set((state) => ({
        ...state,
        dtr: response.dtr,
        schedule: response.schedule,
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
