import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PsbMessageContent } from '../types/inbox.type';

export type Holidays = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export type CalendarState = {
  dates: {
    holidays: Array<Holidays>;
  };

  loading: {
    loadingHolidays: boolean;
  };
  error: {
    errorHolidays: string;
  };

  getHolidays: (loading: boolean) => void;
  getHolidaysSuccess: (loading: boolean, response) => void;
  getHolidaysFail: (loading: boolean, error: string) => void;
};

export const useCalendarStore = create<CalendarState>()(
  devtools((set) => ({
    dates: {
      holidays: [] as Array<Holidays>,
    },

    loading: {
      loadingHolidays: false,
    },
    error: {
      errorHolidays: '',
    },

    //GET INBOX MESSAGES
    getHolidays: (loading: boolean) => {
      set((state) => ({
        ...state,
        dates: {
          holidays: [],
        },
        loading: {
          ...state.loading,
          loadingHolidays: loading,
        },
        error: {
          ...state.error,
          errorHolidays: '',
        },
      }));
    },
    getHolidaysSuccess: (loading: boolean, response: Array<Holidays>) => {
      set((state) => ({
        ...state,
        dates: {
          holidays: response,
        },
        loading: {
          ...state.loading,
          loadingHolidays: loading,
        },
      }));
    },
    getHolidaysFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingHolidays: loading,
        },
        error: {
          ...state.error,
          errorHolidays: error,
        },
      }));
    },
  }))
);
