import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SystemLog, SystemLogId } from '../utils/types/system-logs.type';

// comment

export type SystemLogsState = {
  getSystemLogs: Array<SystemLog>;
  setGetSystemLogs: (getSystemLogs: Array<SystemLog>) => void;

  getSystemLogDetails: SystemLogId;
  setGetSystemLogDetails: (getSystemLogDetails: SystemLogId) => void;

  errorSystemLogs: string;
  setErrorSystemLogs: (errorSystemLogs: string) => void;

  errorSystemLog: string;
  setErrorSystemLog: (errorSystemLog: string) => void;

  emptyResponse: () => void;
};

export const useSystemLogsStore = create<SystemLogsState>()(
  devtools((set) => ({
    getSystemLogs: [],
    setGetSystemLogs: (getSystemLogs) => set({ getSystemLogs }),

    getSystemLogDetails: {} as SystemLogId,
    setGetSystemLogDetails: (getSystemLogDetails) => set({ getSystemLogDetails }),

    errorSystemLogs: '',
    setErrorSystemLogs: (errorSystemLogs) => set({ errorSystemLogs }),

    errorSystemLog: '',
    setErrorSystemLog: (errorSystemLog) => set({ errorSystemLog }),

    emptyResponse: () =>
      set({
        errorSystemLogs: '',
        errorSystemLog: '',
      }),
  }))
);
