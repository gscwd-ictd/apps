/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VacancyDetails } from '../types/vacancies.type';

export type VacanciesState = {
  vacancies: Array<VacancyDetails>;
  loading: {
    loadingVacancies: boolean;
  };
  error: {
    errorVacancies: string;
  };

  getVacancies: (loading: boolean) => void;
  getVacanciesSuccess: (loading: boolean, response) => void;
  getVacanciesFail: (loading: boolean, error: string) => void;
};

export const useVacanciesStore = create<VacanciesState>()(
  devtools((set) => ({
    vacancies: [],
    loading: {
      loadingVacancies: false,
    },
    error: {
      errorVacancies: '',
    },

    //GET VACANCIES ACTIONS
    getVacancies: (loading: boolean) => {
      set((state) => ({
        ...state,
        vacancies: [],
        loading: {
          ...state.loading,
          loadingVacancies: loading,
        },
        error: {
          ...state.error,
          errorVacancies: '',
        },
      }));
    },
    getVacanciesSuccess: (loading: boolean, response: Array<VacancyDetails>) => {
      set((state) => ({
        ...state,
        vacancies: response,
        loading: {
          ...state.loading,
          loadingVacancies: loading,
        },
      }));
    },
    getVacanciesFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingVacancies: loading,
        },
        error: {
          ...state.error,
          errorVacancies: error,
        },
      }));
    },
  }))
);
