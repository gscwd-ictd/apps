import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Overtime, OvertimeAccomplishment } from '../utils/types/overtime.type';

type OvertimeState = {
  overtimeApplications: Array<Overtime>;
  setOvertimeApplications: (overtimeApplications: Array<Overtime>) => void;

  errorOvertimeApplications: string;
  setErrorOvertimeApplications: (errorOvertimeApplications: string) => void;
};

export const useOvertimeStore = create<OvertimeState>()(
  devtools((set) => ({
    overtimeApplications: [],
    setOvertimeApplications: (overtimeApplications) => set({ overtimeApplications }),

    errorOvertimeApplications: '',
    setErrorOvertimeApplications: (errorOvertimeApplications) => set({ errorOvertimeApplications }),
  }))
);
