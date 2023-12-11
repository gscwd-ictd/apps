/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ReportOnAttendance,
  ReportOnPersonalBusinessPassSlip,
  DetailedReportOnPbPassSlip,
  ReportOnOfficialBusinessPassSlip,
  DetailedReportOnObPassSlip,
} from '../utils/types/report.type';

export type ReportsState = {
  reportOnAttendanceDoc: ReportOnAttendance;
  setReportOnAttendanceDoc: (reportOnAttendanceDoc: ReportOnAttendance) => void;

  errorReportOnAttendanceDoc: string;
  setErrorReportOnAttendanceDoc: (errorReportOnAttendanceDoc: string) => void;

  reportOnPersonalBusinessPassSlipDoc: ReportOnPersonalBusinessPassSlip;
  setReportOnPersonalBusinessPassSlipDoc: (
    reportOnPersonalBusinessPassSlipDoc: ReportOnPersonalBusinessPassSlip
  ) => void;

  errorReportOnPersonalBusinessPassSlipDoc: string;
  setErrorReportOnPersonalBusinessPassSlipDoc: (errorReportOnAttendanceDoc: string) => void;

  detailedReportOnPbPassSlipDoc: DetailedReportOnPbPassSlip;
  setDetailedReportOnPbPassSlipDoc: (detailedReportOnPbPassSlipDoc: DetailedReportOnPbPassSlip) => void;

  errorDetailedReportOnPbPassSlipDoc: string;
  setErrorDetailedReportOnPbPassSlipDoc: (errorDetailedReportOnPbPassSlipDoc: string) => void;

  reportOnOfficialBusinessPassSlipDoc: ReportOnOfficialBusinessPassSlip;
  setReportOnOfficialBusinessPassSlipDoc: (
    reportOnOfficialBusinessPassSlipDoc: ReportOnOfficialBusinessPassSlip
  ) => void;

  errorReportOnOfficialBusinessPassSlipDoc: string;
  setErrorReportOnOfficialBusinessPassSlipDoc: (errorReportOnOfficialBusinessPassSlipDoc: string) => void;

  detailedReportOnObPassSlipDoc: DetailedReportOnObPassSlip;
  setDetailedReportOnObPassSlipDoc: (detailedReportOnObPassSlipDoc: DetailedReportOnObPassSlip) => void;

  errorDetailedReportOnObPassSlipDoc: string;
  setErrorDetailedReportOnObPassSlipDoc: (errorDetailedReportOnObPassSlipDoc: string) => void;

  emptyResponse: () => void;
};

export const useReportsStore = create<ReportsState>()(
  devtools((set) => ({
    reportOnAttendanceDoc: {} as ReportOnAttendance,
    setReportOnAttendanceDoc: (reportOnAttendanceDoc) => set({ reportOnAttendanceDoc }),

    errorReportOnAttendanceDoc: '',
    setErrorReportOnAttendanceDoc: (errorReportOnAttendanceDoc) => set({ errorReportOnAttendanceDoc }),

    reportOnPersonalBusinessPassSlipDoc: {} as ReportOnPersonalBusinessPassSlip,
    setReportOnPersonalBusinessPassSlipDoc: (reportOnPersonalBusinessPassSlipDoc) =>
      set({ reportOnPersonalBusinessPassSlipDoc }),

    errorReportOnPersonalBusinessPassSlipDoc: '',
    setErrorReportOnPersonalBusinessPassSlipDoc: (errorReportOnPersonalBusinessPassSlipDoc) =>
      set({ errorReportOnPersonalBusinessPassSlipDoc }),

    detailedReportOnPbPassSlipDoc: {} as DetailedReportOnPbPassSlip,
    setDetailedReportOnPbPassSlipDoc: (detailedReportOnPbPassSlipDoc) => set({ detailedReportOnPbPassSlipDoc }),

    errorDetailedReportOnPbPassSlipDoc: '',
    setErrorDetailedReportOnPbPassSlipDoc: (errorDetailedReportOnPbPassSlipDoc) =>
      set({ errorDetailedReportOnPbPassSlipDoc }),

    reportOnOfficialBusinessPassSlipDoc: {} as ReportOnOfficialBusinessPassSlip,
    setReportOnOfficialBusinessPassSlipDoc: (reportOnOfficialBusinessPassSlipDoc) =>
      set({ reportOnOfficialBusinessPassSlipDoc }),

    errorReportOnOfficialBusinessPassSlipDoc: '',
    setErrorReportOnOfficialBusinessPassSlipDoc: (errorReportOnOfficialBusinessPassSlipDoc) =>
      set({ errorReportOnOfficialBusinessPassSlipDoc }),

    detailedReportOnObPassSlipDoc: {} as DetailedReportOnObPassSlip,
    setDetailedReportOnObPassSlipDoc: (detailedReportOnObPassSlipDoc) => set({ detailedReportOnObPassSlipDoc }),

    errorDetailedReportOnObPassSlipDoc: '',
    setErrorDetailedReportOnObPassSlipDoc: (errorDetailedReportOnObPassSlipDoc) =>
      set({ errorDetailedReportOnObPassSlipDoc }),

    emptyResponse: () =>
      set({
        errorReportOnAttendanceDoc: '',
        errorReportOnPersonalBusinessPassSlipDoc: '',
        errorDetailedReportOnPbPassSlipDoc: '',
        errorReportOnOfficialBusinessPassSlipDoc: '',
        errorDetailedReportOnObPassSlipDoc: '',
      }),
  }))
);
