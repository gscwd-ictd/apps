import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Holiday, HolidayId } from '../utils/types/holiday.type';

type ResponseHoliday = {
  postResponse: Holiday;
  updateResponse: Holiday;
  deleteResponse: HolidayId;
};

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
  holiday: ResponseHoliday;
  loading: LoadingHoliday;
  error: ErrorHoliday;

  getHolidays: (loading: boolean) => void;
  getHolidaysSuccess: (loading: boolean, response: Array<Holiday>) => void;
  getHolidaysFail: (loading: boolean, error: string) => void;

  postHoliday: () => void;
  postHolidaySuccess: (response: Holiday) => void;
  postHolidayFail: (error: string) => void;

  updateHoliday: () => void;
  updateHolidaySuccess: (response: Holiday) => void;
  updateHolidayFail: (error: string) => void;

  deleteHoliday: () => void;
  deleteHolidaySuccess: (response: HolidayId) => void;
  deleteHolidayFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useHolidaysStore = create<HolidaysState>()(
  devtools((set) => ({
    holidays: [],
    holiday: {
      postResponse: {} as Holiday,
      updateResponse: {} as Holiday,
      deleteResponse: {} as HolidayId,
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
        holiday: { ...state.holiday, postResponse: {} as Holiday },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    postHolidaySuccess: (response: Holiday) =>
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
        holiday: { ...state.holiday, updateResponse: {} as Holiday },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    updateHolidaySuccess: (response: Holiday) =>
      set((state) => ({
        ...state,
        holiday: {
          ...state.holiday,
          updateResponse: response,
        },
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
        holiday: { ...state.holiday, deleteResponse: {} as HolidayId },
        loading: { ...state.loading, loadingHoliday: true },
        error: { ...state.error, errorHoliday: '' },
      })),
    deleteHolidaySuccess: (response: HolidayId) =>
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

    emptyResponse: () =>
      set((state) => ({
        ...state,
        holiday: {
          ...state.holiday,
          postResponse: {} as Holiday,
          updateResponse: {} as Holiday,
          deleteResponse: {} as HolidayId,
        },
        error: {
          ...state.error,
          errorHolidays: '',
          errorHoliday: '',
        },
      })),
  }))
);
