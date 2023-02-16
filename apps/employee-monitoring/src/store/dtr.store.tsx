import { create } from 'zustand';

export type DailyTimeRecordState = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
};

export const useDtrStore = create<DailyTimeRecordState>((set) => ({
  searchValue: '',
  setSearchValue: (searchValue: string) => {
    set((state) => ({ ...state, searchValue }));
  },
}));
