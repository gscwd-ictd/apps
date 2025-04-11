import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LoadingProgressState = {
  loadingProgress: number;
  setLoadingProgress: (loadingProgress: number) => void;

  emptyResponse: () => void;
};

export const UseLoadingProgressStore = create<LoadingProgressState>()(
  devtools((set) => ({
    loadingProgress: 0,
    setLoadingProgress: (loadingProgress) => set({ loadingProgress }),

    emptyResponse: () =>
      set({
        loadingProgress: 0,
      }),
  }))
);
