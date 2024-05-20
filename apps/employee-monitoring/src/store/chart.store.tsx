import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MonthlyTardinessChartData, DashboardStats } from '../utils/types/chart.type';

export type ChartsState = {
  getTardinessChartData: MonthlyTardinessChartData;
  setGetTardinessChartData: (getTardinessChartData: MonthlyTardinessChartData) => void;

  errorTardinessChartData: string;
  setErrorTardinessChartData: (errorTardinessChartData: string) => void;

  getDashboardStats: DashboardStats;
  setGetDashboardStats: (getDashboardStats: DashboardStats) => void;

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

    errorDashboardStats: '',
    setErrorDashboardStats: (errorDashboardStats) => set({ errorDashboardStats }),

    emptyResponse: () =>
      set({
        errorTardinessChartData: '',
      }),
  }))
);
