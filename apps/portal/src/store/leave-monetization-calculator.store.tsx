/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LeaveMonetizationCalculatorState = {
  leaveCalculatorModalIsOpen: boolean;

  setLeaveCalculatorModalIsOpen: (leaveCalculatorModalIsOpen: boolean) => void;
};

export const useLeaveMonetizationCalculatorStore = create<LeaveMonetizationCalculatorState>()(
  devtools((set) => ({
    leaveCalculatorModalIsOpen: false,

    setLeaveCalculatorModalIsOpen: (leaveCalculatorModalIsOpen: boolean) => {
      set((state) => ({ ...state, leaveCalculatorModalIsOpen }));
    },
  }))
);
