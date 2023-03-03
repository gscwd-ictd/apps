import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Holiday } from '../utils/types/holiday.type';

type LoadingHoliday = {
  loadingHolidays: boolean;
  loadingHoliday: boolean;
};

type ErrorHoliday = {
  errorHolidays: string;
  errorHoliday: string;
};

export type HolidaysState = {
  holidays: Array<Holiday>;
  holiday: object;
  loading: LoadingHoliday;
  error: ErrorHoliday;
  getHolidays: (loading: boolean) => void;
  getHolidaysSuccess: (loading: boolean, response: Array<Holiday>) => void;
  getHolidaysFail: (loading: boolean, error: string) => void;
};

export const useHolidaysStore = create<HolidaysState>()(
  devtools((set) => ({
    holidays: [],
    holiday: {
      postResponse: {},
      updateResponse: {},
      deleteResponse: {},
    },
    loading: {
      loadingHolidays: false,
      loadingHoliday: false,
    },
    error: {
      errorHolidays: '',
      errorHoliday: '',
    },

    getHolidays: (loading: boolean) =>
      set((state) => ({
        ...state,
        holidays: [],
        loading: { ...state.loading, loadingHolidays: loading },
        error: { ...state.error, errorHolidays: '' },
      })),
    getHolidaysSuccess: (loading: boolean, response: Array<Holiday>) =>
      set((state) => ({
        ...state,
        holidays: response,
        loading: { ...state.loading, loadingHolidays: loading },
      })),
    getHolidaysFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingHolidays: loading },
        error: { ...state.error, errorHolidays: error },
      })),

    postHoliday: () =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, postResponse: {} },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    postHolidaySuccess: (response: unknown) =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, postResponse: response },
        loading: { ...state.loading, loadingHoliday: false },
      })),
    postHolidayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingHoliday: false },
        error: { ...state.error, errorHoliday: error },
      })),

    updateHoliday: () =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, updateResponse: {} },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    updateHolidaySuccess: (response: unknown) =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, updateResponse: response },
        loading: { ...state.loading, loadingHoliday: false },
      })),
    updateHolidayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingHoliday: false },
        error: { ...state.error, errorHoliday: error },
      })),

    deleteHoliday: () =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, deleteResponse: {} },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    deleteHolidaySuccess: (response: unknown) =>
      set((state) => ({
        ...state,
        holiday: { ...state.holiday, deleteResponse: response },
        loading: { ...state.loading, loadingHoliday: false },
      })),
    deleteHolidayFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingHoliday: false },
        error: { ...state.error, errorHoliday: error },
      })),
  }))
);
