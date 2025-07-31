import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MonthlyTardinessChartData, DashboardStats } from '../utils/types/chart.type';
import { boolean } from 'yup';

export type ChartsState = {
  getTardinessChartData: MonthlyTardinessChartData;
  setGetTardinessChartData: (getTardinessChartData: MonthlyTardinessChartData) => void;

  errorTardinessChartData: string;
  setErrorTardinessChartData: (errorTardinessChartData: string) => void;

  getDashboardStats: DashboardStats;
  setGetDashboardStats: (getDashboardStats: DashboardStats) => void;

  loadingDashboardStats: boolean;
  setLoadingDashboardStats: (loadingDashboardStats: boolean) => void;

  errorDashboardStats: string;
  setErrorDashboardStats: (errorDashboardStats: string) => void;

  emptyResponse: () => void;
};

export const useChartsStore = create<ChartsState>()(
  devtools((set) => ({
    getTardinessChartData: {} as MonthlyTardinessChartData,
    setGetTardinessChartData: (getTardinessChartData) => set({ getTardinessChartData }),

    errorTardinessChartData: '',
    setErrorTardinessChartData: (errorTardinessChartData) => set({ errorTardinessChartData }),

    getDashboardStats: {} as DashboardStats,
    setGetDashboardStats: (getDashboardStats) => set({ getDashboardStats }),

    loadingDashboardStats: false,
    setLoadingDashboardStats: (loadingDashboardStats) => set({ loadingDashboardStats }),

    errorDashboardStats: '',
    setErrorDashboardStats: (errorDashboardStats) => set({ errorDashboardStats }),

    emptyResponse: () =>
      set({
        errorTardinessChartData: '',
      }),
  }))
);
