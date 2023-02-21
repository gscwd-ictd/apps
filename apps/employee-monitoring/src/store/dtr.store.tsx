import { create } from 'zustand';

export type DailyTimeRecordState = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  selectedAssignment: string;
  setSelectedAssignment: (selectedAssignment: string) => void;
};

export const useDtrStore = create<DailyTimeRecordState>((set) => ({
  searchValue: '',
  selectedAssignment: '',
  setSearchValue: (searchValue: string) => {
    set((state) => ({ ...state, searchValue }));
  },
  setSelectedAssignment: (selectedAssignment: string) => {
    set((state) => ({ ...state, selectedAssignment }));
  },
}));
