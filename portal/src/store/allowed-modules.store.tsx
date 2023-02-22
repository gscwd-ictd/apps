import create from 'zustand';
import { Card } from '../types/allowed-modules.type';

export type AllowedModulesState = {
  allowedModules: Array<Card>;
  setAllowedModules: (allowedModules: Array<Card>) => void;
};

export const useAllowedModulesStore = create<AllowedModulesState>((set) => ({
  allowedModules: [],
  setAllowedModules: (allowedModules: Array<Card>) => {
    set((state) => ({ ...state, allowedModules }));
  },
}));
