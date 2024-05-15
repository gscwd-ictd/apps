/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/no-empty-function
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export enum Actions {
  CREATE = 'create',
  UPDATE = 'update',
  VIEW = 'view',
}

type ModalState = {
  isOpen: boolean;
  page: number;
};

export type ModalStoreState = {
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: Actions | null;
  setAction: (action: Actions) => void;

  nextPage: () => void;
  prevPage: () => void;

  openModal: () => void;
  closeModal: () => void;
  setModalPage: (page: number) => void;
};

export const useModalStore = create<ModalStoreState>()(
  devtools((set, get) => ({
    modal: { isOpen: false, page: 1 },
    setModal: (modal: ModalState) => set((state) => ({ ...state, modal })),

    openModal: () => set((state) => ({ ...state, modal: { isOpen: true, page: 1 } })),

    closeModal: () => set((state) => ({ ...state, modal: { isOpen: false, page: 1 } })),

    setModalPage: (page: number) => set((state) => ({ ...state, modal: { ...state.modal, page } })),

    nextPage: () =>
      set((state) => ({
        ...state,
        modal: { ...state.modal, page: get().modal.page + 1 },
      })),

    action: null,

    setAction: (action: Actions) => set((state) => ({ ...state, action })),

    prevPage: () =>
      set((state) => ({
        ...state,
        modal: {
          ...state.modal,
          page: get().modal.page > 1 ? get().modal.page - 1 : get().modal.page,
        },
      })),
  }))
);
