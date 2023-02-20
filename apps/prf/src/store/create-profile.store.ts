import create from 'zustand';
import { PendingUser } from '../types/user.type';

export type CreateProfileState = {
  currentPage: number;
  setNextPage: () => void;
  setPrevPage: () => void;
  pendingUser: PendingUser;
  setPendingUser: (pendingUser: PendingUser) => void;
};

export const useProfileStore = create<CreateProfileState>((set) => ({
  currentPage: 1,
  setNextPage: () => {
    set((state) => ({ ...state, currentPage: state.currentPage + 1 }));
  },
  setPrevPage: () => {
    set((state) => ({ ...state, currentPage: state.currentPage - 1 }));
  },
  pendingUser: {} as PendingUser,
  setPendingUser: (pendingUser: PendingUser) => {
    set((state) => ({ ...state, pendingUser }));
  },
}));
