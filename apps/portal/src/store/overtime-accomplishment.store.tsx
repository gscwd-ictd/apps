/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { OvertimeForm } from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OvertimeDetails = {
  dateOfFiling: string;
  overtimeDateFrom: string;
  overtimeDateTo: string;
  estimatedHours: string;
  purpose: string;
  employees: Array<string>;
};

export type OvertimeList = {
  forApproval: Array<OvertimeDetails>;
  completed: Array<OvertimeDetails>;
};

export type OvertimeState = {
  employeeList: Array<SelectOption>;
  overtime: {
    forApproval: Array<OvertimeDetails>;
    completed: Array<OvertimeDetails>;
  };
  response: {
    postResponseApply: any;
    cancelResponse: any;
  };

  loading: {
    loadingOvertime: boolean;
    loadingResponse: boolean;
    loadingEmployeeList: boolean;
  };
  error: {
    errorOvertime: string;
    errorResponse: string;
    errorEmployeeList: string;
  };

  getEmployeeList: (loading: boolean) => void;
  getEmployeeListSuccess: (loading: boolean, response) => void;
  getEmployeeListFail: (loading: boolean, error: string) => void;

  overtimeDetails: OvertimeDetails;
  cancelOvertimeModalIsOpen: boolean;
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
  postOvertimeSuccess: (response: OvertimeForm) => void;
  postOvertimeFail: (error: string) => void;

  setCancelOvertimeModalIsOpen: (cancelOvertimeModalIsOpen: boolean) => void;
  setApplyOvertimeModalIsOpen: (applyOvertimeModalIsOpen: boolean) => void;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;
  setCompletedOvertimeModalIsOpen: (completedOvertimeModalIsOpen: boolean) => void;

  setOvertimeDetails: (overtimeDetails: OvertimeDetails) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useOvertimeAccomplishmentStore = create<OvertimeState>()(
  devtools((set) => ({
    employeeList: [],

    overtime: {
      forApproval: [
        {
          dateOfFiling: '09-20-2023 14:00:00',
          overtimeDateFrom: '09-20-2023 17:00:00 - 09-20-2023 19:00:00',
          overtimeDateTo: '09-20-2023 17:00:00 - 09-20-2023 19:00:00',
          estimatedHours: '2',
          purpose: 'Mag overtime ako habang buhay',
          employees: ['Mikhail Sebua, Ricardo Narvaiza'],
        },
      ],
      completed: [
        {
          dateOfFiling: '09-20-2023 14:00:00',
          overtimeDateFrom: '09-20-2023 17:00:00 - 09-20-2023 19:00:00',
          overtimeDateTo: '09-20-2023 17:00:00 - 09-20-2023 19:00:00',
          estimatedHours: '2',
          purpose: 'Gusto kong matuto mag drive',
          employees: ['Mikhail Sebua, Ricardo Narvaiza'],
        },
      ],
    },
    response: {
      postResponseApply: {},
      cancelResponse: {} as OvertimeDetails,
    },
    loading: {
      loadingOvertime: false,
      loadingResponse: false,
      loadingEmployeeList: false,
    },
    error: {
      errorOvertime: '',
      errorResponse: '',
      errorEmployeeList: '',
    },

    overtimeDetails: {} as OvertimeDetails,

    applyOvertimeModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    completedOvertimeModalIsOpen: false,
    cancelOvertimeModalIsOpen: false,
    tab: 1,

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setCancelOvertimeModalIsOpen: (cancelOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelOvertimeModalIsOpen }));
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

    setOvertimeDetails: (overtimeDetails: OvertimeDetails) => {
      set((state) => ({ ...state, overtimeDetails }));
    },

    //GET EMPLOYEE LIST ACTIONS
    getEmployeeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        employeeList: [],
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorEmployeeList: '',
        },
      }));
    },
    getEmployeeListSuccess: (loading: boolean, response: Array<SelectOption>) => {
      set((state) => ({
        ...state,
        employeeList: response,
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
      }));
    },
    getEmployeeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorEmployeeList: error,
        },
      }));
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
          postResponseApply: {},
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
    postOvertimeSuccess: (response) => {
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
          postResponseApply: {},
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
