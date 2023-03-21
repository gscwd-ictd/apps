import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Alert = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setOpen: () => void;
  setClose: () => void;
};

export const useAlertConfirmationStore = create<Alert>()(
  devtools((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
    setOpen: () => set((state) => ({ ...state, isOpen: true })),
    setClose: () => set((state) => ({ ...state, isOpen: false })),
  }))
);

export const useAlertSuccessStore = create<Alert>()(
  devtools((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
    setOpen: () => set((state) => ({ ...state, isOpen: true })),
    setClose: () => set((state) => ({ ...state, isOpen: false })),
  }))
);

export const useAlertFailStore = create<Alert>()(
  devtools((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set((state) => ({ ...state, isOpen })),
    setOpen: () => set((state) => ({ ...state, isOpen: true })),
    setClose: () => set((state) => ({ ...state, isOpen: false })),
  }))
);
