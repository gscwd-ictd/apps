/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { PassSlip, PassSlipId, EmployeePassSlipList } from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';

type OvertimeDetails = {
  dateOfFiling: string;
  dateOfOvertime: string;
  estimatedHours: string;
  purpose: string;
  employees: Array<string>;
};

type OvertimeList = {
  forApproval: Array<OvertimeDetails>;
  completed: Array<OvertimeDetails>;
};

export type OvertimeState = {
  overtime: {
    forApproval: Array<OvertimeDetails>;
    completed: Array<OvertimeDetails>;
  };
  response: {
    postResponseApply: OvertimeDetails;
    cancelResponse: OvertimeDetails;
  };

  loading: {
    loadingOvertime: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorOvertime: string;
    errorResponse: string;
  };

  overtimeDetails: OvertimeDetails;
  cancelApplicationModalIsOpen: boolean;
  applyOvertimeModalIsOpen: boolean;
  pendingOvertimeModalIsOpen: boolean;
  completedOvertimeModalIsOpen: boolean;
  tab: number;

  getOvertimeList: (loading: boolean) => void;
  getOvertimeListSuccess: (loading: boolean, response) => void;
  getOvertimeListFail: (loading: boolean, error: string) => void;

  cancelOvertime: (loading: boolean) => void;
  cancelOvertimeSuccess: (response) => void;
  cancelOvertimeFail: (error: string) => void;

  postOvertime: () => void;
  postOvertimeSuccess: (response: OvertimeDetails) => void;
  postOvertimeFail: (error: string) => void;

  setCancelApplicationModalIsOpen: (cancelApplicationModalIsOpen: boolean) => void;
  setApplyOvertimeModalIsOpen: (applyOvertimeModalIsOpen: boolean) => void;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;
  setCompletedOvertimeModalIsOpen: (completedOvertimeModalIsOpen: boolean) => void;

  getOvertimeDetails: (overtimeDetails: OvertimeDetails) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useOvertimeStore = create<OvertimeState>()(
  devtools((set) => ({
    overtime: {
      forApproval: [] as Array<OvertimeDetails>,
      completed: [] as Array<OvertimeDetails>,
    },
    response: {
      postResponseApply: {} as OvertimeDetails,
      cancelResponse: {} as OvertimeDetails,
    },
    loading: {
      loadingOvertime: false,
      loadingResponse: false,
    },
    error: {
      errorOvertime: '',
      errorResponse: '',
    },

    overtimeDetails: {} as OvertimeDetails,

    applyOvertimeModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    completedOvertimeModalIsOpen: false,

    cancelApplicationModalIsOpen: false,

    tab: 1,

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setCancelApplicationModalIsOpen: (cancelApplicationModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelApplicationModalIsOpen }));
    },

    setApplyOvertimeModalIsOpen: (applyOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, applyOvertimeModalIsOpen }));
    },

    setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingOvertimeModalIsOpen }));
    },

    setCompletedOvertimeModalIsOpen: (completedOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, completedOvertimeModalIsOpen }));
    },

    getOvertimeDetails: (overtimeDetails: OvertimeDetails) => {
      set((state) => ({ ...state, overtimeDetails }));
    },

    //GET OVERTIME ACTIONS
    getOvertimeList: (loading: boolean) => {
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
    getOvertimeListSuccess: (loading: boolean, response: OvertimeList) => {
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
    getOvertimeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertime: loading,
        },
        error: {
          ...state.error,
          errorOvertime: error,
        },
        response: {
          ...state.response,
          postResponseApply: null,
        },
      }));
    },

    //POST OVERTIME ACTIONS
    postOvertime: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as OvertimeDetails,
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
    postOvertimeSuccess: (response: OvertimeDetails) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    postOvertimeFail: (error: string) => {
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

    //DELETE OVERTIME ACTIONS
    cancelOvertime: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelResponse: {} as OvertimeDetails,
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
    cancelOvertimeSuccess: (response: OvertimeDetails) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelResponse: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    cancelOvertimeFail: (error: string) => {
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
          postResponseApply: {} as OvertimeDetails,
          cancelResponse: {} as OvertimeDetails,
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
