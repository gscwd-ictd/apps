import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { ErrorState, ModalState } from '../types/modal.type';

export type DtrState = {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  tab: number;
  setTab: (tab: number) => void;
};

export const useDtrStore = create<DtrState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedYear: '',
  selectedMonth: '',
  date: '01-0001',
  isLoading: false,
  tab: 1,
  setAlert: (alert: AlertState) => {
    set((state) => ({ ...state, alert }));
  },
  setModal: (modal: ModalState) => {
    set((state) => ({ ...state, modal }));
  },
  setAction: (action: string) => {
    set((state) => ({ ...state, action }));
  },
  setError: (error: ErrorState) => {
    set((state) => ({ ...state, error }));
  },
  setSelectedYear: (selectedYear: string) => {
    set((state) => ({ ...state, selectedYear }));
  },
  setSelectedMonth: (selectedMonth: string) => {
    set((state) => ({ ...state, selectedMonth }));
  },
  setDate: (date: string) => {
    set((state) => ({ ...state, date }));
  },
  setIsLoading: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }));
  },
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
}));
