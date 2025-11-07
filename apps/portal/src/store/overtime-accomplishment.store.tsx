// STORE FOR EMPLOYEE VIEW OF THEIR OT ACCOMPLISHMENTS

/* eslint-disable @nx/enforce-module-boundaries */
import {
  OvertimeAccomplishment,
  OvertimeAccomplishmentPatch,
  OvertimeForm,
} from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OvertimeAccomplishmentList = {
  forApproval: Array<OvertimeAccomplishment>;
  completed: Array<OvertimeAccomplishment>;
};

export type OvertimeState = {
  overtime: {
    forApproval: Array<OvertimeAccomplishment>;
    completed: Array<OvertimeAccomplishment>;
  };
  response: {
    patchResponse: any;
    cancelResponse: any;
  };

  loading: {
    loadingOvertimeAccomplishment: boolean;
    loadingTimeLogsOnDayAndNext: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorOvertimeAccomplishment: string;
    errorTimeLogsOnDayAndNext: string;
    errorResponse: string;
  };

  timeLogsOnDayAndNext: Array<string>; // for IVMS entries on OT accomplishment modal
  overtimeAccomplishmentDetails: OvertimeAccomplishment;
  overtimeAccomplishmentPatchDetails: OvertimeAccomplishmentPatch;
  pendingOvertimeAccomplishmentModalIsOpen: boolean;
  completedOvertimeAccomplishmentModalIsOpen: boolean;
  confirmOvertimeAccomplishmentModalIsOpen: boolean;
  tab: number;

  getTimeLogsOnDayAndNext: (loading: boolean) => void;
  getTimeLogsOnDayAndNextSuccess: (loading: boolean, response) => void;
  getTimeLogsOnDayAndNextFail: (loading: boolean, error: string) => void;

  getOvertimeAccomplishmentList: (loading: boolean) => void;
  getOvertimeAccomplishmentListSuccess: (loading: boolean, response) => void;
  getOvertimeAccomplishmentListFail: (loading: boolean, error: string) => void;

  patchOvertimeAccomplishment: () => void;
  patchOvertimeAccomplishmentSuccess: (response: OvertimeForm) => void;
  patchOvertimeAccomplishmentFail: (error: string) => void;

  setPendingOvertimeAccomplishmentModalIsOpen: (pendingOvertimeAccomplishmentModalIsOpen: boolean) => void;
  setCompletedOvertimeAccomplishmentModalIsOpen: (completedOvertimeAccomplishmentModalIsOpen: boolean) => void;
  setConfirmOvertimeAccomplishmentModalIsOpen: (confirmOvertimeAccomplishmentModalIsOpen: boolean) => void;

  setOvertimeDetails: (overtimeAccomplishmentDetails: OvertimeAccomplishment) => void;
  setOvertimeAccomplishmentPatchDetails: (overtimeAccomplishmentPatchDetails: OvertimeAccomplishmentPatch) => void;
  setTab: (tab: number) => void;

  // accomplishments: Array<string>;
  // addAccomplishments: (accomplishments: string) => void;
  // removeAccomplishments: (index: number) => void;

  emptyResponseAndError: () => void;

  selectedYear: string;
  setSelectedYear: (value: string) => void;

  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
};

export const useOvertimeAccomplishmentStore = create<OvertimeState>()(
  devtools((set) => ({
    overtime: {
      forApproval: [],
      completed: [],
    },
    response: {
      patchResponse: {},
      cancelResponse: {} as OvertimeAccomplishment,
    },
    loading: {
      loadingOvertimeAccomplishment: false,
      loadingTimeLogsOnDayAndNext: false,
      loadingResponse: false,
    },
    error: {
      errorOvertimeAccomplishment: '',
      errorTimeLogsOnDayAndNext: '',
      errorResponse: '',
    },

    timeLogsOnDayAndNext: [] as Array<string>,
    overtimeAccomplishmentDetails: {} as OvertimeAccomplishment,
    overtimeAccomplishmentPatchDetails: {} as OvertimeAccomplishmentPatch,
    pendingOvertimeAccomplishmentModalIsOpen: false,
    completedOvertimeAccomplishmentModalIsOpen: false,
    confirmOvertimeAccomplishmentModalIsOpen: false,

    tab: 1,
    selectedYear: '',
    selectedMonth: '',

    setSelectedYear: (selectedYear: string) => {
      set((state) => ({ ...state, selectedYear }));
    },
    setSelectedMonth: (selectedMonth: string) => {
      set((state) => ({ ...state, selectedMonth }));
    },

    // accomplishments: [] as Array<string>,
    // addAccomplishments: (newAccomplishment: string) => {
    //   set((state) => ({
    //     accomplishments: [...state.accomplishments, newAccomplishment],
    //   }));
    // },
    // removeAccomplishments: (index: number) => {
    //   set((state) => ({
    //     accomplishments: state.accomplishments.splice(index, 1),
    //   }));
    // },

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setPendingOvertimeAccomplishmentModalIsOpen: (pendingOvertimeAccomplishmentModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingOvertimeAccomplishmentModalIsOpen }));
    },

    setCompletedOvertimeAccomplishmentModalIsOpen: (completedOvertimeAccomplishmentModalIsOpen: boolean) => {
      set((state) => ({ ...state, completedOvertimeAccomplishmentModalIsOpen }));
    },

    setConfirmOvertimeAccomplishmentModalIsOpen: (confirmOvertimeAccomplishmentModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmOvertimeAccomplishmentModalIsOpen }));
    },

    setOvertimeDetails: (overtimeAccomplishmentDetails: OvertimeAccomplishment) => {
      set((state) => ({ ...state, overtimeAccomplishmentDetails }));
    },

    setOvertimeAccomplishmentPatchDetails: (overtimeAccomplishmentPatchDetails: OvertimeAccomplishmentPatch) => {
      set((state) => ({ ...state, overtimeAccomplishmentPatchDetails }));
    },

    //GET OVERTIME ACTIONS
    getTimeLogsOnDayAndNext: (loading: boolean) => {
      set((state) => ({
        ...state,
        timeLogsOnDayAndNext: [] as Array<string>,
        loading: {
          ...state.loading,
          loadingTimeLogsOnDayAndNext: loading,
        },
        error: {
          ...state.error,
          errorTimeLogsOnDayAndNext: '',
        },
      }));
    },
    getTimeLogsOnDayAndNextSuccess: (loading: boolean, response: Array<string>) => {
      set((state) => ({
        ...state,
        timeLogsOnDayAndNext: response,
        loading: {
          ...state.loading,
          loadingTimeLogsOnDayAndNext: loading,
        },
      }));
    },
    getTimeLogsOnDayAndNextFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingTimeLogsOnDayAndNext: loading,
        },
        error: {
          ...state.error,
          errorTimeLogsOnDayAndNext: error,
        },
      }));
    },

    //GET OVERTIME ACTIONS
    getOvertimeAccomplishmentList: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtime: {
          ...state.overtime,
          forApproval: [],
          completed: [],
        },
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
        error: {
          ...state.error,
          errorOvertime: '',
        },
      }));
    },
    getOvertimeAccomplishmentListSuccess: (loading: boolean, response: OvertimeAccomplishmentList) => {
      set((state) => ({
        ...state,
        overtime: {
          ...state.overtime,
          forApproval: response.forApproval,
          completed: response.completed,
        },
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
      }));
    },
    getOvertimeAccomplishmentListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeAccomplishment: loading,
        },
        error: {
          ...state.error,
          errorOvertimeAccomplishment: error,
        },
        response: {
          ...state.response,
          patchResponse: null,
        },
      }));
    },

    //PATCH OVERTIME ACCOMPLISHMENT ACTIONS
    patchOvertimeAccomplishment: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: {},
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
    patchOvertimeAccomplishmentSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchOvertimeAccomplishmentFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        error: {
          ...state.error,
          errorResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: {},
          cancelResponse: {},
        },
        error: {
          ...state.error,
          errorResponse: '',
          errorOvertime: '',
        },
      }));
    },
  }))
);
