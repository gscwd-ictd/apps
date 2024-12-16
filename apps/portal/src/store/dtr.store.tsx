/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { DtrCorrectionForm, EmployeeDtrWithScheduleAndSummary } from 'libs/utils/src/lib/types/dtr.type';
import { devtools } from 'zustand/middleware';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

export type EmployeeDtr = {
  dtrId: string;
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
  employeeDtrPdf: EmployeeDtrWithScheduleAndSummary;

  response: {
    employeeDailyRecord: DtrCorrectionForm; // for response
  };
  loading: {
    loadingDtr: boolean;
    loadingDtrPdf: boolean;
    loadingUpdateEmployeeDtr: boolean;
  };

  error: {
    errorDtr: string;
    errorDtrPdf: string;
    errorUpdateEmployeeDtr: string;
  };

  selectedYear: string;
  setSelectedYear: (value: string) => void;

  selectedMonth: string;
  setSelectedMonth: (value: string) => void;

  date: string;
  setDate: (value: string) => void;

  //for web view purposes
  getEmployeeDtr: (loading: boolean) => void;
  getEmployeeDtrSuccess: (loading: boolean, response) => void;
  getEmployeeDtrFail: (loading: boolean, error: string) => void;

  //for PDF purposes - can contain 1st or 2nd half od DTR only
  getEmployeeDtrPdf: (loading: boolean) => void;
  getEmployeeDtrPdfSuccess: (loading: boolean, response) => void;
  getEmployeeDtrPdfFail: (loading: boolean, error: string) => void;

  emptyResponseAndError: () => void;

  updateEmployeeDtr: () => void;
  updateEmployeeDtrSuccess: (response: DtrCorrectionForm) => void;
  updateEmployeeDtrFail: (error: string) => void;

  confirmUpdateModalIsOpen: boolean;
  setConfirmUpdateModalIsOpen: (confirmUpdateModalIsOpen: boolean) => void;

  dtrModalIsOpen: boolean;
  setDtrModalIsOpen: (dtrModalIsOpen: boolean) => void;

  dtrPdfModalIsOpen: boolean;
  setDtrPdfModalIsOpen: (dtrPdfModalIsOpen: boolean) => void;

  dtrPeriod: number;
  setDtrPeriod: (dtrPeriod: number) => void;
};

export const useDtrStore = create<DtrState>()(
  devtools((set) => ({
    employeeDtr: {} as EmployeeDtrWithScheduleAndSummary,
    employeeDtrPdf: {} as EmployeeDtrWithScheduleAndSummary,
    response: {
      employeeDailyRecord: {} as DtrCorrectionForm,
    },
    loading: {
      loadingDtr: false,
      loadingDtrPdf: false,
      loadingUpdateEmployeeDtr: false,
    },

    error: {
      errorDtr: '',
      errorDtrPdf: '',
      errorUpdateEmployeeDtr: '',
    },
    selectedYear: '',
    selectedMonth: '',
    date: '01-0001',

    dtrPeriod: 1,
    setDtrPeriod: (dtrPeriod: number) => {
      set((state) => ({ ...state, dtrPeriod }));
    },

    dtrModalIsOpen: false,
    setDtrModalIsOpen: (dtrModalIsOpen: boolean) => {
      set((state) => ({ ...state, dtrModalIsOpen }));
    },

    dtrPdfModalIsOpen: false,
    setDtrPdfModalIsOpen: (dtrPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, dtrPdfModalIsOpen }));
    },

    confirmUpdateModalIsOpen: false,
    setConfirmUpdateModalIsOpen: (confirmUpdateModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmUpdateModalIsOpen }));
    },

    setSelectedYear: (selectedYear: string) => {
      set((state) => ({ ...state, selectedYear }));
    },
    setSelectedMonth: (selectedMonth: string) => {
      set((state) => ({ ...state, selectedMonth }));
    },
    setDate: (date: string) => {
      set((state) => ({ ...state, date }));
    },

    //GET DTR ACTIONS - WEB VIEW
    getEmployeeDtr: (loading: boolean) => {
      set((state) => ({
        ...state,
        employeeDtr: {} as EmployeeDtrWithScheduleAndSummary,
        loading: { ...state.loading, loadingDtr: loading },
        error: { ...state.error, errorDtr: '' },
      }));
    },
    getEmployeeDtrSuccess: (loading: boolean, response: EmployeeDtrWithScheduleAndSummary) => {
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

    //GET DTR ACTIONS _PDF VIEW
    getEmployeeDtrPdf: (loading: boolean) => {
      set((state) => ({
        ...state,
        employeeDtrPdf: {} as EmployeeDtrWithScheduleAndSummary,
        loading: { ...state.loading, loadingDtrPdf: loading },
        error: { ...state.error, errorDtrPdf: '' },
      }));
    },
    getEmployeeDtrPdfSuccess: (loading: boolean, response: EmployeeDtrWithScheduleAndSummary) => {
      set((state) => ({
        ...state,
        employeeDtrPdf: response,
        loading: { ...state.loading, loadingDtrPdf: loading },
      }));
    },
    getEmployeeDtrPdfFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingDtrPdf: loading },
        error: { ...state.error, errorDtrPdf: error },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: { ...state.response, employeeDailyRecord: {} as DtrCorrectionForm },
        error: { ...state.error, errorDtr: '' },
      }));
    },

    updateEmployeeDtr: () =>
      set((state) => ({
        ...state,
        response: { ...state.response, employeeDailyRecord: {} as DtrCorrectionForm },
        loading: { ...state.loading, loadingUpdateEmployeeDtr: true },
        error: { ...state.error, errorUpdateEmployeeDtr: '' },
      })),

    updateEmployeeDtrSuccess: (response: DtrCorrectionForm) =>
      set((state) => ({
        ...state,
        response: { ...state.response, employeeDailyRecord: response },
        loading: { ...state.loading, loadingUpdateEmployeeDtr: false },
      })),

    updateEmployeeDtrFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUpdateEmployeeDtr: true },
        error: { ...state.error, errorUpdateEmployeeDtr: error },
      })),
  }))
);
