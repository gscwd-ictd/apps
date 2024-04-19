/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Overtime,
  OvertimeAccomplishment,
  OvertimeImmediateSupervisor,
  PostImmediateSupervisor,
  DeleteImmediateSupervisor,
} from 'libs/utils/src/lib/types/overtime.type';

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

  assignImmediateSupervisor: PostImmediateSupervisor;
  setAssignImmediateSupervisor: (postAssignImmediateSupervisor: PostImmediateSupervisor) => void;

  errorAssignImmediateSupervisor: string;
  setErrorAssignImmediateSupervisor: (errorAssignImmediateSupervisor: string) => void;

  unassignImmediateSupervisor: DeleteImmediateSupervisor;
  setUnassignImmediateSupervisor: (postAssignImmediateSupervisor: DeleteImmediateSupervisor) => void;

  errorUnassignImmediateSupervisor: string;
  setErrorUnassignImmediateSupervisor: (errorAssignImmediateSupervisor: string) => void;

  timeLogsOnDayAndNext: Array<string>;
  setTimeLogsOnDayAndNext: (timeLogsOnDayAndNext: Array<string>) => void;

  errorTimeLogsOnDayAndNext: string;
  setErrorTimeLogsOnDayAndNext: (errorTimeLogsOnDayAndNext: string) => void;

  emptyResponse: () => void;
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

    assignImmediateSupervisor: {} as PostImmediateSupervisor,
    setAssignImmediateSupervisor: (assignImmediateSupervisor) => set({ assignImmediateSupervisor }),

    errorAssignImmediateSupervisor: '',
    setErrorAssignImmediateSupervisor: (errorAssignImmediateSupervisor) => set({ errorAssignImmediateSupervisor }),

    unassignImmediateSupervisor: {} as DeleteImmediateSupervisor,
    setUnassignImmediateSupervisor: (unassignImmediateSupervisor) => set({ unassignImmediateSupervisor }),

    errorUnassignImmediateSupervisor: '',
    setErrorUnassignImmediateSupervisor: (errorUnassignImmediateSupervisor) =>
      set({ errorUnassignImmediateSupervisor }),

    timeLogsOnDayAndNext: [] as Array<string>,
    setTimeLogsOnDayAndNext: (timeLogsOnDayAndNext) => set({ timeLogsOnDayAndNext }),

    errorTimeLogsOnDayAndNext: '',
    setErrorTimeLogsOnDayAndNext: (errorTimeLogsOnDayAndNext) => set({ errorTimeLogsOnDayAndNext }),

    emptyResponse: () =>
      set({
        assignImmediateSupervisor: {} as PostImmediateSupervisor,
        unassignImmediateSupervisor: {} as DeleteImmediateSupervisor,

        errorAssignImmediateSupervisor: '',
        errorUnassignImmediateSupervisor: '',
      }),
  }))
);
