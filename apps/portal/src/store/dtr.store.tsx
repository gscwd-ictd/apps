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
    loadingDtrPdf: boolean;
    loadingDtr: boolean;
    loadingUpdateEmployeeDtr: boolean;
  };

  error: {
    errorDtrPdf: string;
    errorDtr: string;
    errorUpdateEmployeeDtr: string;
  };

  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;

  selectedYear: string;
  setSelectedYear: (value: string) => void;

  selectedMonth: string;
  setSelectedMonth: (value: string) => void;

  date: string;
  setDate: (value: string) => void;

  getEmployeeDtr: (loading: boolean) => void;
  getEmployeeDtrSuccess: (loading: boolean, response) => void;
  getEmployeeDtrFail: (loading: boolean, error: string) => void;

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
};

export const useDtrStore = create<DtrState>()(
  devtools((set) => ({
    employeeDtr: {} as EmployeeDtrWithScheduleAndSummary,
    employeeDtrPdf: {} as EmployeeDtrWithScheduleAndSummary,

    response: {
      employeeDailyRecord: {} as DtrCorrectionForm,
    },
    loading: {
      loadingDtrPdf: false,
      loadingDtr: false,
      loadingUpdateEmployeeDtr: false,
    },

    error: {
      errorDtrPdf: '',
      errorDtr: '',
      errorUpdateEmployeeDtr: '',
    },
    selectedPeriod: '',
    selectedYear: '',
    selectedMonth: '',
    date: '01-0001',

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

    setSelectedPeriod: (selectedPeriod: string) => {
      set((state) => ({ ...state, selectedPeriod }));
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

    //GET DTR ACTIONS WEB VIEW/FULL
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

    //GET DTR ACTIONS PDF VIEW
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
        error: { ...state.error, errorDtr: '', errorDtrPdf: '' },
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
