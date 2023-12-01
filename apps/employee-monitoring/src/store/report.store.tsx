/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ReportOnAttendance } from '../utils/types/report.type';

export type ReportsState = {
  reportOnAttendanceDoc: ReportOnAttendance;
  setReportOnAttendanceDoc: (getReportOnAttendanceDoc: ReportOnAttendance) => void;

  errorReportOnAttendanceDoc: string;
  setErrorReportOnAttendanceDoc: (errorReportOnAttendanceDoc: string) => void;

  emptyResponse: () => void;
};

export const useReportsStore = create<ReportsState>()(
  devtools((set) => ({
    reportOnAttendanceDoc: {} as ReportOnAttendance,
    setReportOnAttendanceDoc: (reportOnAttendanceDoc) => set({ reportOnAttendanceDoc }),

    errorReportOnAttendanceDoc: '',
    setErrorReportOnAttendanceDoc: (errorReportOnAttendanceDoc) => set({ errorReportOnAttendanceDoc }),

    emptyResponse: () =>
      set({
        reportOnAttendanceDoc: {} as ReportOnAttendance,

        errorReportOnAttendanceDoc: '',
      }),
  }))
);
