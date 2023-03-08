import { create } from 'zustand';
import { ErrorState, ModalState } from '../types/modal.type';

export type CreateModalState = {
  modal: ModalState;
  setModal: () => void;
  action: string;
  setAction: (action: string) => void;
  tab: number;
  setTab: (tab: number) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
};

export const useModalStore = create<CreateModalState>((set) => ({
  modal: { isOpen: false, page: 1, subtitle: '', title: '' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setModal: () => {},
  action: '',
  setAction: (action: string) => {
    set((state) => ({ ...state, action }));
  },
  tab: 1,
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
  error: {} as ErrorState,
  setError: (error: ErrorState) => {
    set((state) => ({ ...state, error }));
  },
}));
