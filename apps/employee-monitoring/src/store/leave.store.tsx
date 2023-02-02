import { Leave } from 'libs/utils/src/lib/types/leave-type';
import { create } from 'zustand';

export type LeaveState = {
  recurringLeave: Array<Leave>;
  setRecurringLeave: (recurringLeave: Array<Leave>) => void;
  cumulativeLeave: Array<Leave>;
  setCumulativeLeave: (cumulativeLeave: Array<Leave>) => void;
  specialLeave: Array<Leave>;
  setSpecialLeave: (specialLeave: Array<Leave>) => void;
};

export const useLeaveStore = create<LeaveState>((set) => ({
  recurringLeave: [],
  cumulativeLeave: [],
  specialLeave: [],
  setRecurringLeave: (recurringLeave: Array<Leave>) => {
    set((state) => ({ ...state, recurringLeave }));
  },
  setCumulativeLeave: (cumulativeLeave: Array<Leave>) => {
    set((state) => ({ ...state, cumulativeLeave }));
  },
  setSpecialLeave: (specialLeave: Array<Leave>) => {
    set((state) => ({ ...state, specialLeave }));
  },
}));
