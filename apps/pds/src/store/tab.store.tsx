import { create } from 'zustand';

export type TabState = {
  selectedTab: number;
  numberOfTabs: number;
  setNumberOfTabs: (numberOfTabs: number) => void;
  setSelectedTab: (selectedTab: number) => void;
  handlePrevTab: (selectedTab: number) => void;
  handleNextTab: (selectedTab: number) => void;
  background: string;
  setBackground: (background: string) => void;
};

export const useTabStore = create<TabState>((set, get) => ({
  selectedTab: 1,
  numberOfTabs: 0,
  background: 'bg-gray-100',
  setNumberOfTabs: (numberOfTabs: number) => {
    set((state) => ({ ...state, numberOfTabs }));
  },
  setSelectedTab: (selectedTab: number) => {
    set((state) => ({ ...state, selectedTab }));
  },

  handleNextTab: async (selectedTab: number) => {
    if (selectedTab < get().numberOfTabs) {
      set((state) => ({ ...state, selectedTab: selectedTab + 1 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  handlePrevTab: async (selectedTab: number) => {
    if (selectedTab > 0) {
      set((state) => ({ ...state, selectedTab: selectedTab - 1 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  setBackground: (background: string) => {
    set((state) => ({ ...state, background }));
  },
}));
