import { create } from 'zustand';

export type PageTypeState = {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
};

export const usePageStore = create<PageTypeState>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => {
    set((state) => ({ ...state, isMobile }));
  },
}));
