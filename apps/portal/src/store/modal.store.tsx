/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/no-empty-function
import { create } from 'zustand';

export enum Actions {
  CREATE = 'create',
  UPDATE = 'update',
}

type ModalState = {
  isOpen: boolean;
  page: number;
};

export type ModalStoreState = {
  modal: ModalState;
  modalAction: Actions | null;
  setModalAction: (action: Actions) => void;
  setModalIsOpen: (isOpen: boolean) => void;
  setModalPage: (page: number) => void;
};

export const useModalStore = create<ModalStoreState>((set, get) => ({
  modal: { isOpen: false, page: 1 },
  modalAction: null,
  setModalAction: (action: Actions) => {
    set((state) => ({ ...state, action }));
  },
  setModalIsOpen: (isOpen: boolean) =>
    set((state) => ({ ...state, ...state.modal, isOpen, page: 1 })),
  setModalPage: (page: number) =>
    set((state) => ({ ...state, modal: { ...state.modal, page } })),
}));
