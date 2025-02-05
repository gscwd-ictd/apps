/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ReportOnAttendance,
  ReportOnPersonalBusinessPassSlip,
  DetailedReportOnPbPassSlip,
  ReportOnOfficialBusinessPassSlip,
  DetailedReportOnObPassSlip,
  ReportOnEmpForcedLeaveCredits,
  ReportOnEmpLeaveCreditBalance,
  ReportOnEmpLeaveCreditBalanceWMoney,
  ReportOnSummaryLeaveWithoutPay,
  ReportOnEmpSickLeaveCredits,
  ReportOnEmpRehabLeaveCredits,
  DetailedReportOnPbPassSlipCosJo,
  ReportOnUnusedPassSlip,
  ReportOnLeaveApplicationLateFiling,
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

  reportOnEmpForcedLeaveCreditsDoc: ReportOnEmpForcedLeaveCredits;
  setReportOnEmpForcedLeaveCreditsDoc: (reportOnEmpForcedLeaveCreditsDoc: ReportOnEmpForcedLeaveCredits) => void;

  errorReportOnEmpForcedLeaveCreditsDoc: string;
  setErrorReportOnEmpForcedLeaveCreditsDoc: (errorReportOnEmpForcedLeaveCreditsDoc: string) => void;

  reportOnEmpLeaveCreditsBalanceDoc: ReportOnEmpLeaveCreditBalance;
  setReportOnEmpLeaveCreditsBalanceDoc: (reportOnEmpLeaveCreditsBalanceDoc: ReportOnEmpLeaveCreditBalance) => void;

  errorReportOnEmpLeaveCreditsBalanceDoc: string;
  setErrorReportOnEmpLeaveCreditsBalanceDoc: (errorReportOnEmpForcedLeaveCreditsDoc: string) => void;

  reportOnEmpLeaveCreditsBalanceWMoneyDoc: ReportOnEmpLeaveCreditBalanceWMoney;
  setReportOnEmpLeaveCreditsBalanceWMoneyDoc: (
    reportOnEmpLeaveCreditsBalanceWMoneyDoc: ReportOnEmpLeaveCreditBalanceWMoney
  ) => void;

  errorReportOnEmpLeaveCreditsBalanceWMoneyDoc: string;
  setErrorReportOnEmpLeaveCreditsBalanceWMoneyDoc: (errorReportOnEmpLeaveCreditsBalanceWMoneyDoc: string) => void;

  reportOnSummaryLeaveWithoutPayDoc: ReportOnSummaryLeaveWithoutPay;
  setReportOnSummaryLeaveWithoutPayDoc: (
    reportOnEmpLeaveCreditsBalanceWMoneyDoc: ReportOnSummaryLeaveWithoutPay
  ) => void;

  errorReportOnSummaryLeaveWithoutPayDoc: string;
  setErrorReportOnSummaryLeaveWithoutPayDoc: (errorReportOnSummaryLeaveWithoutPayDoc: string) => void;

  reportOnEmpSickLeaveCreditsDoc: ReportOnEmpSickLeaveCredits;
  setReportOnEmpSickLeaveCreditsDoc: (reportOnEmpSickLeaveCreditsDoc: ReportOnEmpSickLeaveCredits) => void;

  errorReportOnEmpSickLeaveCreditsDoc: string;
  setErrorReportOnEmpSickLeaveCreditsDoc: (errorReportOnEmpSickLeaveCreditsDoc: string) => void;

  reportOnEmpRehabLeaveDoc: ReportOnEmpRehabLeaveCredits;
  setReportOnEmpRehabLeaveDoc: (reportOnEmpRehabLeaveDoc: ReportOnEmpRehabLeaveCredits) => void;

  errorReportOnEmpRehabLeaveDoc: string;
  setErrorReportOnEmpRehabLeaveDoc: (errorReportOnEmpRehabLeaveDoc: string) => void;

  detailedReportOnPbPassSlipCosJoDoc: DetailedReportOnPbPassSlipCosJo;
  setDetailedReportOnPbPassSlipCosJoDoc: (detailedReportOnPbPassSlipCosJoDoc: DetailedReportOnPbPassSlipCosJo) => void;

  errorDetailedReportOnPbPassSlipCosJoDoc: string;
  setErrorDetailedReportOnPbPassSlipCosJoDoc: (errorDetailedReportOnPbPassSlipCosJoDoc: string) => void;

  reportOnUnusedPassSlipDoc: ReportOnUnusedPassSlip;
  setReportOnUnusedPassSlipDoc: (reportOnUnusedPassSlipDoc: ReportOnUnusedPassSlip) => void;

  errorReportOnUnusedPassSlipDoc: string;
  setErrorReportOnUnusedPassSlipDoc: (errorReportOnUnusedPassSlipDoc: string) => void;

  reportOnLeaveApplicationLateFilingDoc: ReportOnLeaveApplicationLateFiling;
  setReportOnLeaveApplicationLaeFilingDoc: (
    reportOnLeaveApplicationLateFilingDoc: ReportOnLeaveApplicationLateFiling
  ) => void;

  errorReportOnLeaveApplicationLateFilingDoc: string;
  setErrorReportOnLeaveApplicationLateFilingDoc: (errorReportOnLeaveApplicationLateFilingDoc: string) => void;

  emptyResponse: () => void;
};

export const useReportsStore = create<ReportsState>()(
  devtools((set) => ({
    // Report on Attendance
    reportOnAttendanceDoc: {} as ReportOnAttendance,
    setReportOnAttendanceDoc: (reportOnAttendanceDoc) => set({ reportOnAttendanceDoc }),

    errorReportOnAttendanceDoc: '',
    setErrorReportOnAttendanceDoc: (errorReportOnAttendanceDoc) => set({ errorReportOnAttendanceDoc }),

    // Report on Personal Business Pass Slip
    reportOnPersonalBusinessPassSlipDoc: {} as ReportOnPersonalBusinessPassSlip,
    setReportOnPersonalBusinessPassSlipDoc: (reportOnPersonalBusinessPassSlipDoc) =>
      set({ reportOnPersonalBusinessPassSlipDoc }),

    errorReportOnPersonalBusinessPassSlipDoc: '',
    setErrorReportOnPersonalBusinessPassSlipDoc: (errorReportOnPersonalBusinessPassSlipDoc) =>
      set({ errorReportOnPersonalBusinessPassSlipDoc }),

    // Detailed Report on Personal Business Pass Slip
    detailedReportOnPbPassSlipDoc: {} as DetailedReportOnPbPassSlip,
    setDetailedReportOnPbPassSlipDoc: (detailedReportOnPbPassSlipDoc) => set({ detailedReportOnPbPassSlipDoc }),

    errorDetailedReportOnPbPassSlipDoc: '',
    setErrorDetailedReportOnPbPassSlipDoc: (errorDetailedReportOnPbPassSlipDoc) =>
      set({ errorDetailedReportOnPbPassSlipDoc }),

    // Report on Official Business Pass Slip
    reportOnOfficialBusinessPassSlipDoc: {} as ReportOnOfficialBusinessPassSlip,
    setReportOnOfficialBusinessPassSlipDoc: (reportOnOfficialBusinessPassSlipDoc) =>
      set({ reportOnOfficialBusinessPassSlipDoc }),

    errorReportOnOfficialBusinessPassSlipDoc: '',
    setErrorReportOnOfficialBusinessPassSlipDoc: (errorReportOnOfficialBusinessPassSlipDoc) =>
      set({ errorReportOnOfficialBusinessPassSlipDoc }),

    // Detailed Report on Official Business Pass Slip
    detailedReportOnObPassSlipDoc: {} as DetailedReportOnObPassSlip,
    setDetailedReportOnObPassSlipDoc: (detailedReportOnObPassSlipDoc) => set({ detailedReportOnObPassSlipDoc }),

    errorDetailedReportOnObPassSlipDoc: '',
    setErrorDetailedReportOnObPassSlipDoc: (errorDetailedReportOnObPassSlipDoc) =>
      set({ errorDetailedReportOnObPassSlipDoc }),

    // Report on Employee Forced Leave Credits
    reportOnEmpForcedLeaveCreditsDoc: {} as ReportOnEmpForcedLeaveCredits,
    setReportOnEmpForcedLeaveCreditsDoc: (reportOnEmpForcedLeaveCreditsDoc) =>
      set({ reportOnEmpForcedLeaveCreditsDoc }),

    errorReportOnEmpForcedLeaveCreditsDoc: '',
    setErrorReportOnEmpForcedLeaveCreditsDoc: (errorReportOnEmpForcedLeaveCreditsDoc) =>
      set({ errorReportOnEmpForcedLeaveCreditsDoc }),

    // Report on Employee Leave Credit Balance
    reportOnEmpLeaveCreditsBalanceDoc: {} as ReportOnEmpLeaveCreditBalance,
    setReportOnEmpLeaveCreditsBalanceDoc: (reportOnEmpLeaveCreditsBalanceDoc) =>
      set({ reportOnEmpLeaveCreditsBalanceDoc }),

    errorReportOnEmpLeaveCreditsBalanceDoc: '',
    setErrorReportOnEmpLeaveCreditsBalanceDoc: (errorReportOnEmpLeaveCreditsBalanceDoc) =>
      set({ errorReportOnEmpLeaveCreditsBalanceDoc }),

    // Report on Employee Leave Credit Balance with Money
    reportOnEmpLeaveCreditsBalanceWMoneyDoc: {} as ReportOnEmpLeaveCreditBalanceWMoney,
    setReportOnEmpLeaveCreditsBalanceWMoneyDoc: (reportOnEmpLeaveCreditsBalanceWMoneyDoc) =>
      set({ reportOnEmpLeaveCreditsBalanceWMoneyDoc }),

    errorReportOnEmpLeaveCreditsBalanceWMoneyDoc: '',
    setErrorReportOnEmpLeaveCreditsBalanceWMoneyDoc: (errorReportOnEmpLeaveCreditsBalanceWMoneyDoc) =>
      set({ errorReportOnEmpLeaveCreditsBalanceWMoneyDoc }),

    // Report on Summary of Leave Without Pay
    reportOnSummaryLeaveWithoutPayDoc: {} as ReportOnSummaryLeaveWithoutPay,
    setReportOnSummaryLeaveWithoutPayDoc: (reportOnSummaryLeaveWithoutPayDoc) =>
      set({ reportOnSummaryLeaveWithoutPayDoc }),

    errorReportOnSummaryLeaveWithoutPayDoc: '',
    setErrorReportOnSummaryLeaveWithoutPayDoc: (errorReportOnSummaryLeaveWithoutPayDoc) =>
      set({ errorReportOnSummaryLeaveWithoutPayDoc }),

    reportOnEmpSickLeaveCreditsDoc: {} as ReportOnEmpSickLeaveCredits,
    setReportOnEmpSickLeaveCreditsDoc: (reportOnEmpSickLeaveCreditsDoc) => set({ reportOnEmpSickLeaveCreditsDoc }),

    errorReportOnEmpSickLeaveCreditsDoc: '',
    setErrorReportOnEmpSickLeaveCreditsDoc: (errorReportOnEmpSickLeaveCreditsDoc) =>
      set({ errorReportOnEmpSickLeaveCreditsDoc }),

    reportOnEmpRehabLeaveDoc: {} as ReportOnEmpRehabLeaveCredits,
    setReportOnEmpRehabLeaveDoc: (reportOnEmpRehabLeaveDoc) => set({ reportOnEmpRehabLeaveDoc }),

    errorReportOnEmpRehabLeaveDoc: '',
    setErrorReportOnEmpRehabLeaveDoc: (errorReportOnEmpRehabLeaveDoc) => set({ errorReportOnEmpRehabLeaveDoc }),

    // Detailed Report on Personal Business Pass Slip COS/JO
    detailedReportOnPbPassSlipCosJoDoc: {} as DetailedReportOnPbPassSlipCosJo,
    setDetailedReportOnPbPassSlipCosJoDoc: (detailedReportOnPbPassSlipCosJoDoc) =>
      set({ detailedReportOnPbPassSlipCosJoDoc }),

    errorDetailedReportOnPbPassSlipCosJoDoc: '',
    setErrorDetailedReportOnPbPassSlipCosJoDoc: (errorDetailedReportOnPbPassSlipCosJoDoc) =>
      set({ errorDetailedReportOnPbPassSlipCosJoDoc }),

    reportOnUnusedPassSlipDoc: {} as ReportOnUnusedPassSlip,
    setReportOnUnusedPassSlipDoc: (reportOnUnusedPassSlipDoc) => set({ reportOnUnusedPassSlipDoc }),

    errorReportOnUnusedPassSlipDoc: '',
    setErrorReportOnUnusedPassSlipDoc: (errorReportOnUnusedPassSlipDoc) => set({ errorReportOnUnusedPassSlipDoc }),

    reportOnLeaveApplicationLateFilingDoc: {} as ReportOnLeaveApplicationLateFiling,
    setReportOnLeaveApplicationLaeFilingDoc: (reportOnLeaveApplicationLateFilingDoc) =>
      set({ reportOnLeaveApplicationLateFilingDoc }),

    errorReportOnLeaveApplicationLateFilingDoc: '',
    setErrorReportOnLeaveApplicationLateFilingDoc: (errorReportOnLeaveApplicationLateFilingDoc) =>
      set({ errorReportOnLeaveApplicationLateFilingDoc }),

    emptyResponse: () =>
      set({
        errorReportOnAttendanceDoc: '',
        errorReportOnPersonalBusinessPassSlipDoc: '',
        errorDetailedReportOnPbPassSlipDoc: '',
        errorReportOnOfficialBusinessPassSlipDoc: '',
        errorDetailedReportOnObPassSlipDoc: '',
        errorReportOnEmpForcedLeaveCreditsDoc: '',
        errorReportOnEmpLeaveCreditsBalanceDoc: '',
        errorReportOnEmpLeaveCreditsBalanceWMoneyDoc: '',
        errorReportOnSummaryLeaveWithoutPayDoc: '',
        errorDetailedReportOnPbPassSlipCosJoDoc: '',
        errorReportOnUnusedPassSlipDoc: '',
        errorReportOnLeaveApplicationLateFilingDoc: '',
      }),
  }))
);
