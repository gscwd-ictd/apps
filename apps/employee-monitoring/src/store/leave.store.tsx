import { Leave } from 'libs/utils/src/lib/types/leave.type';
import { create } from 'zustand';

export type LeaveState = {
  recurringLeaves: Array<Leave>;
  setRecurringLeaves: (recurringLeave: Array<Leave>) => void;
  cumulativeLeaves: Array<Leave>;
  setCumulativeLeaves: (cumulativeLeave: Array<Leave>) => void;
  specialLeaves: Array<Leave>;
  setSpecialLeaves: (specialLeave: Array<Leave>) => void;
};

export const useLeaveStore = create<LeaveState>((set) => ({
  recurringLeaves: [],
  cumulativeLeaves: [],
  specialLeaves: [],
  setRecurringLeaves: (recurringLeaves: Array<Leave>) => {
    set((state) => ({ ...state, recurringLeaves }));
  },
  setCumulativeLeaves: (cumulativeLeaves: Array<Leave>) => {
    set((state) => ({ ...state, cumulativeLeaves }));
  },
  setSpecialLeaves: (specialLeaves: Array<Leave>) => {
    set((state) => ({ ...state, specialLeaves }));
  },
}));
