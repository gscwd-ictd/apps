import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MonthlyTardinessChartData } from '../utils/types/chart.type';

export type ChartsState = {
  getTardinessChartData: MonthlyTardinessChartData;
  setGetTardinessChartData: (getTardinessChartData: MonthlyTardinessChartData) => void;

  errorTardinessChartData: string;
  setErrorTardinessChartData: (errorTardinessChartData: string) => void;

  emptyResponse: () => void;
};

export const useChartsStore = create<ChartsState>()(
  devtools((set) => ({
    getTardinessChartData: {} as MonthlyTardinessChartData,
    setGetTardinessChartData: (getTardinessChartData) => set({ getTardinessChartData }),

    errorTardinessChartData: '',
    setErrorTardinessChartData: (errorTardinessChartData) => set({ errorTardinessChartData }),

    emptyResponse: () =>
      set({
        errorTardinessChartData: '',
      }),
  }))
);
