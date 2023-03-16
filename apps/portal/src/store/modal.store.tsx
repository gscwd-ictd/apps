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
  setModal: (modal: ModalState) => void;
  modalAction: Actions | null;
  setModalAction: (action: Actions) => void;

  openModal: () => void;
  closeModal: () => void;
  setModalPage: (page: number) => void;
};

export const useModalStore = create<ModalStoreState>((set, get) => ({
  modal: { isOpen: false, page: 1 },
  setModal: (modal: ModalState) => set((state) => ({ ...state, modal })),
  modalAction: null,
  setModalAction: (action: Actions) => {
    set((state) => ({ ...state, action }));
  },
  openModal: () =>
    set((state) => ({ ...state, modal: { isOpen: true, page: 1 } })),

  closeModal: () =>
    set((state) => ({ ...state, modal: { isOpen: false, page: 1 } })),

  setModalPage: (page: number) =>
    set((state) => ({ ...state, modal: { ...state.modal, page } })),
}));
