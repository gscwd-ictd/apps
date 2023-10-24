/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import {
  OvertimeAccomplishment,
  OvertimeDetails,
  OvertimeForm,
  OvertimeList,
} from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
    loadingAccomplishment: boolean;
  };
  error: {
    errorOvertime: string;
    errorResponse: string;
    errorEmployeeList: string;
    errorAccomplishment: string;
  };

  overtimeAccomplishmentEmployeeId: string;
  setOvertimeAccomplishmentEmployeeId: (overtimeAccomplishmentEmployeeId: string) => void;

  overtimeAccomplishmentEmployeeName: string;
  setOvertimeAccomplishmentEmployeeName: (overtimeAccomplishmentEmployeeName: string) => void;

  overtimeAccomplishmentApplicationId: string;
  setOvertimeAccomplishmentApplicationId: (overtimeAccomplishmentApplicationId: string) => void;

  getEmployeeList: (loading: boolean) => void;
  getEmployeeListSuccess: (loading: boolean, response) => void;
  getEmployeeListFail: (loading: boolean, error: string) => void;

  overtimeDetails: OvertimeDetails;
  cancelOvertimeModalIsOpen: boolean;
  applyOvertimeModalIsOpen: boolean;
  pendingOvertimeModalIsOpen: boolean;
  completedOvertimeModalIsOpen: boolean;
  accomplishmentOvertimeModalIsOpen: boolean;
  pdfAccomplishmentReportModalIsOpen: boolean;
  pdfOvertimeAuthorizationModalIsOpen: boolean;
  tab: number;

  accomplishmentDetails: OvertimeAccomplishment;
  getAccomplishmentDetails: (loading: boolean) => void;
  getAccomplishmentDetailsSuccess: (loading: boolean, response) => void;
  getAccomplishmentDetailsFail: (loading: boolean, error: string) => void;

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
  setAccomplishmentOvertimeModalIsOpen: (accomplishmentOvertimeModalIsOpen: boolean) => void;
  setPdfAccomplishmentReportModalIsOpen: (pdfAccomplishmentReportModalIsOpen: boolean) => void;
  setPdfOvertimeAuthorizationModalIsOpen: (pdfOvertimeAuthorizationModalIsOpen: boolean) => void;

  setOvertimeDetails: (overtimeDetails: OvertimeDetails) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useOvertimeStore = create<OvertimeState>()(
  devtools((set) => ({
    employeeList: [],

    overtime: {
      forApproval: [],
      completed: [],
    },
    response: {
      postResponseApply: {},
      cancelResponse: {} as OvertimeDetails,
    },
    loading: {
      loadingOvertime: false,
      loadingResponse: false,
      loadingEmployeeList: false,
      loadingAccomplishment: false,
    },
    error: {
      errorOvertime: '',
      errorResponse: '',
      errorEmployeeList: '',
      errorAccomplishment: '',
    },

    overtimeDetails: {} as OvertimeDetails,
    accomplishmentDetails: {} as OvertimeAccomplishment,

    applyOvertimeModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    completedOvertimeModalIsOpen: false,
    cancelOvertimeModalIsOpen: false,
    accomplishmentOvertimeModalIsOpen: false,
    pdfAccomplishmentReportModalIsOpen: false,
    pdfOvertimeAuthorizationModalIsOpen: false,
    tab: 1,

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setPdfAccomplishmentReportModalIsOpen: (pdfAccomplishmentReportModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfAccomplishmentReportModalIsOpen }));
    },

    setPdfOvertimeAuthorizationModalIsOpen: (pdfOvertimeAuthorizationModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfOvertimeAuthorizationModalIsOpen }));
    },

    setAccomplishmentOvertimeModalIsOpen: (accomplishmentOvertimeModalIsOpen: boolean) => {
      set((state) => ({ ...state, accomplishmentOvertimeModalIsOpen }));
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

    overtimeAccomplishmentEmployeeId: '',
    setOvertimeAccomplishmentEmployeeId: (overtimeAccomplishmentEmployeeId: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentEmployeeId }));
    },

    overtimeAccomplishmentEmployeeName: '',
    setOvertimeAccomplishmentEmployeeName: (overtimeAccomplishmentEmployeeName: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentEmployeeName }));
    },

    overtimeAccomplishmentApplicationId: '',
    setOvertimeAccomplishmentApplicationId: (overtimeAccomplishmentApplicationId: string) => {
      set((state) => ({ ...state, overtimeAccomplishmentApplicationId }));
    },

    //GET OVERTIME ACCOMPLISHMENTS ACTIONS
    getAccomplishmentDetails: (loading: boolean) => {
      set((state) => ({
        ...state,
        accomplishmentDetails: {} as OvertimeAccomplishment,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
        error: {
          ...state.error,
          errorAccomplishment: '',
        },
      }));
    },

    getAccomplishmentDetailsSuccess: (loading: boolean, response: OvertimeAccomplishment) => {
      set((state) => ({
        ...state,
        accomplishmentDetails: response,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
      }));
    },
    getAccomplishmentDetailsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAccomplishment: loading,
        },
        error: {
          ...state.error,
          errorAccomplishment: error,
        },
        response: {
          ...state.response,
          postResponseApply: null,
        },
      }));
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
