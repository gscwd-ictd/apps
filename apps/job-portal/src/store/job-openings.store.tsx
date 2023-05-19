import { create } from 'zustand';

type Modal = {
  isOpen: boolean;
  page: number;
  title: string;
  subtitle: string;
};

type JobOpeningsState = {
  modal: Modal;
  setModal: (modal: Modal) => void;
  actionSelection: string;
  setActionSelection: (actionSelection: string) => void;
  checkboxTerms: boolean;
  setCheckboxTerms: (checkboxTerms: boolean) => void;
  positionTab: number;
  setPositionTab: (positionTab: number) => void;
};

const MODAL: Modal = {
  isOpen: false,
  page: 1,
  title: '',
  subtitle: '',
};

export const useJobOpeningsStore = create<JobOpeningsState>((set) => ({
  modal: MODAL,
  actionSelection: '',
  checkboxTerms: false,
  positionTab: 0,
  setPositionTab: (positionTab: number) => {
    set((state) => ({ ...state, positionTab }));
  },
  setModal: (modal: Modal) => {
    set((state) => ({ ...state, modal }));
  },
  setActionSelection: (actionSelection: string) => {
    set((state) => ({ ...state, actionSelection }));
  },
  setCheckboxTerms: (checkboxTerms: boolean) => {
    set((state) => ({ ...state, checkboxTerms }));
  },
}));
