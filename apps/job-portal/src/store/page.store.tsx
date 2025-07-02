import create from 'zustand';

type Progress = {
  firstStep: boolean;
  secondStep: boolean;
  thirdStep: boolean;
};

type PageState = {
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  progress: Progress;
  setProgress: (progress: Progress) => void;
  hasPds: boolean;
  setHasPds: (hasPds: boolean) => void;
};

export const usePageStore = create<PageState>((set) => ({
  page: 1,
  setPage: (page: number) => {
    set((state) => ({ ...state, page }));
  },
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }));
  },
  progress: { firstStep: false, secondStep: false, thirdStep: false } as Progress,
  setProgress: (progress: Progress) => {
    set((state) => ({ ...state, progress }));
  },
  hasPds: false,
  setHasPds: (hasPds: boolean) => {
    set((state) => ({ ...state, hasPds }));
  },
}));
