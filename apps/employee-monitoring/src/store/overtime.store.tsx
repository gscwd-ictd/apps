/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Overtime, OvertimeAccomplishment, OvertimeImmediateSupervisor } from 'libs/utils/src/lib/types/overtime.type';

type OvertimeState = {
  overtimeApplications: Array<Overtime>;
  setOvertimeApplications: (overtimeApplications: Array<Overtime>) => void;

  errorOvertimeApplications: string;
  setErrorOvertimeApplications: (errorOvertimeApplications: string) => void;

  overtimeAccomplishment: OvertimeAccomplishment;
  setOvertimeAccomplishment: (overtimeAccomplishment: OvertimeAccomplishment) => void;

  errorOvertimeAccomplishment: string;
  setErrorOvertimeAccomplishment: (errorOvertimeAccomplishment: string) => void;

  overtimeImmediateSupervisors: Array<OvertimeImmediateSupervisor>;
  setOvertimeImmediateSupervisors: (overtimeImmediateSupervisors: Array<OvertimeImmediateSupervisor>) => void;

  errorOvertimeImmediateSupervisors: string;
  setErrorOvertimeImmediateSupervisors: (errorOvertimeImmediateSupervisors: string) => void;
};

export const useOvertimeStore = create<OvertimeState>()(
  devtools((set) => ({
    overtimeApplications: [],
    setOvertimeApplications: (overtimeApplications) => set({ overtimeApplications }),

    errorOvertimeApplications: '',
    setErrorOvertimeApplications: (errorOvertimeApplications) => set({ errorOvertimeApplications }),

    overtimeAccomplishment: {} as OvertimeAccomplishment,
    setOvertimeAccomplishment: (overtimeAccomplishment) => set({ overtimeAccomplishment }),

    errorOvertimeAccomplishment: '',
    setErrorOvertimeAccomplishment: (errorOvertimeAccomplishment) => set({ errorOvertimeAccomplishment }),

    overtimeImmediateSupervisors: [],
    setOvertimeImmediateSupervisors: (overtimeImmediateSupervisors) => set({ overtimeImmediateSupervisors }),

    errorOvertimeImmediateSupervisors: '',
    setErrorOvertimeImmediateSupervisors: (errorOvertimeImmediateSupervisors) =>
      set({ errorOvertimeImmediateSupervisors }),
  }))
);
