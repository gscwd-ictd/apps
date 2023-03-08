import { create } from 'zustand';
import { User } from '../types/user.type';

export type UserState = {
  user: any;
  setUser: (user: any) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {} as any,
  setUser: (user: any) => {
    set((state) => ({ ...state, user }));
  },
}));
