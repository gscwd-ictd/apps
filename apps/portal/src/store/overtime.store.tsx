/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import {
  OvertimeAccomplishment,
  OvertimeAuthorization,
  OvertimeDetails,
  OvertimeForm,
  OvertimeList,
  OvertimeSummary,
} from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { number } from 'yup';
import { format } from 'date-fns';

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
    loadingAuthorizationReport: boolean;
    loadingAccomplishmentReport: boolean;
    loadingOvertimeSummaryReport: boolean;
  };
  error: {
    errorOvertime: string;
    errorResponse: string;
    errorEmployeeList: string;
    errorAccomplishment: string;
    errorAuthorizationReport: string;
    errorAccomplishmentReport: string;
    errorOvertimeSummaryReport: string;
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
  overtimeSummaryModalIsOpen: boolean;
  cancelOvertimeModalIsOpen: boolean;
  applyOvertimeModalIsOpen: boolean;
  pendingOvertimeModalIsOpen: boolean;
  completedOvertimeModalIsOpen: boolean;
  accomplishmentOvertimeModalIsOpen: boolean;
  pdfAccomplishmentReportModalIsOpen: boolean;
  pdfOvertimeAuthorizationModalIsOpen: boolean;
  pdfOvertimeSummaryModalIsOpen: boolean;
  tab: number;

  //for selecting month, year and Period for OT summary PDF generation
  selectedMonth: number;
  selectedYear: number;
  selectedPeriod: string;
  selectedEmployeeType: string;
  setSelectedMonth: (selectedMonth: number) => void;
  setSelectedYear: (selectedYear: number) => void;
  setSelectedPeriod: (selectedPeriod: string) => void;
  setSelectedEmployeeType: (selectedEmployeeType: string) => void;

  //for getting employee's accomplishment report inside MODAL
  accomplishmentDetails: OvertimeAccomplishment;
  getAccomplishmentDetails: (loading: boolean) => void;
  getAccomplishmentDetailsSuccess: (loading: boolean, response) => void;
  getAccomplishmentDetailsFail: (loading: boolean, error: string) => void;

  //for getting overtime summary report in PDF
  overtimeSummaryReport: Array<OvertimeSummary>;
  getOvertimeSummaryReport: (loading: boolean) => void;
  getOvertimeSummaryReportSuccess: (loading: boolean, response) => void;
  getOvertimeSummaryReportFail: (loading: boolean, error: string) => void;

  //for getting employee's accomplishment report in PDF
  overtimeAccomplishmentReport: OvertimeAccomplishment;
  getOvertimeAccomplishmentReport: (loading: boolean) => void;
  getOvertimeAccomplishmentReportSuccess: (loading: boolean, response) => void;
  getOvertimeAccomplishmentReportFail: (loading: boolean, error: string) => void;

  //for getting overtime authorization report in PDF
  overtimeAuthorizationReport: OvertimeAuthorization;
  getOvertimeAuthorizationReport: (loading: boolean) => void;
  getOvertimeAuthorizationReportSuccess: (loading: boolean, response) => void;
  getOvertimeAuthorizationReportFail: (loading: boolean, error: string) => void;

  //get list of overtime (for approval/completed)
  getOvertimeList: (loading: boolean) => void;
  getOvertimeListSuccess: (loading: boolean, response) => void;
  getOvertimeListFail: (loading: boolean, error: string) => void;

  cancelOvertime: () => void;
  cancelOvertimeSuccess: (response) => void;
  cancelOvertimeFail: (error: string) => void;

  postOvertime: () => void;
  postOvertimeSuccess: (response: OvertimeForm) => void;
  postOvertimeFail: (error: string) => void;

  setOvertimeSummaryModalIsOpen: (overtimeSummaryModalIsOpen: boolean) => void;
  setCancelOvertimeModalIsOpen: (cancelOvertimeModalIsOpen: boolean) => void;
  setApplyOvertimeModalIsOpen: (applyOvertimeModalIsOpen: boolean) => void;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;
  setCompletedOvertimeModalIsOpen: (completedOvertimeModalIsOpen: boolean) => void;
  setAccomplishmentOvertimeModalIsOpen: (accomplishmentOvertimeModalIsOpen: boolean) => void;

  setPdfAccomplishmentReportModalIsOpen: (pdfAccomplishmentReportModalIsOpen: boolean) => void;
  setPdfOvertimeAuthorizationModalIsOpen: (pdfOvertimeAuthorizationModalIsOpen: boolean) => void;
  setPdfOvertimeSummaryModalIsOpen: (pdfOvertimeSummaryModalIsOpen: boolean) => void;

  //getting overtime details inside MODAL
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
      loadingAuthorizationReport: false,
      loadingAccomplishmentReport: false,
      loadingOvertimeSummaryReport: false,
    },
    error: {
      errorOvertime: '',
      errorResponse: '',
      errorEmployeeList: '',
      errorAccomplishment: '',
      errorAuthorizationReport: '',
      errorAccomplishmentReport: '',
      errorOvertimeSummaryReport: '',
    },

    overtimeDetails: {} as OvertimeDetails,
    accomplishmentDetails: {} as OvertimeAccomplishment,
    overtimeSummaryReport: {} as Array<OvertimeSummary>,

    overtimeAuthorizationReport: {} as OvertimeAuthorization,
    overtimeAccomplishmentReport: {} as OvertimeAccomplishment,

    overtimeSummaryModalIsOpen: false,
    applyOvertimeModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    completedOvertimeModalIsOpen: false,
    cancelOvertimeModalIsOpen: false,
    accomplishmentOvertimeModalIsOpen: false,
    pdfAccomplishmentReportModalIsOpen: false,
    pdfOvertimeAuthorizationModalIsOpen: false,
    pdfOvertimeSummaryModalIsOpen: false,
    tab: 1,

    selectedMonth: 1,
    selectedYear: 2023,
    selectedPeriod: 'first',
    selectedEmployeeType: 'Regular',

    setSelectedMonth: (selectedMonth: number) => {
      set((state) => ({ ...state, selectedMonth }));
    },
    setSelectedYear: (selectedYear: number) => {
      set((state) => ({ ...state, selectedYear }));
    },
    setSelectedPeriod: (selectedPeriod: string) => {
      set((state) => ({ ...state, selectedPeriod }));
    },
    setSelectedEmployeeType: (selectedEmployeeType: string) => {
      set((state) => ({ ...state, selectedEmployeeType }));
    },

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setOvertimeSummaryModalIsOpen: (overtimeSummaryModalIsOpen: boolean) => {
      set((state) => ({ ...state, overtimeSummaryModalIsOpen }));
    },

    setPdfAccomplishmentReportModalIsOpen: (pdfAccomplishmentReportModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfAccomplishmentReportModalIsOpen }));
    },

    setPdfOvertimeAuthorizationModalIsOpen: (pdfOvertimeAuthorizationModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfOvertimeAuthorizationModalIsOpen }));
    },

    setPdfOvertimeSummaryModalIsOpen: (pdfOvertimeSummaryModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfOvertimeSummaryModalIsOpen }));
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

    //GET OVERTIME AUTHORIZATION REPORT FOR PDF
    getOvertimeAuthorizationReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeAuthorizationReport: {} as OvertimeAuthorization,
        loading: {
          ...state.loading,
          loadingAuthorizationReport: loading,
        },
        error: {
          ...state.error,
          errorAuthorizationReport: '',
        },
      }));
    },

    getOvertimeAuthorizationReportSuccess: (loading: boolean, response: OvertimeAuthorization) => {
      set((state) => ({
        ...state,
        overtimeAuthorizationReport: response,
        loading: {
          ...state.loading,
          loadingAuthorizationReport: loading,
        },
      }));
    },
    getOvertimeAuthorizationReportFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAuthorizationReport: loading,
        },
        error: {
          ...state.error,
          errorAuthorizationReport: error,
        },
      }));
    },

    //GET OVERTIME ACCOMPLISHMENT REPORT FOR PDF
    getOvertimeAccomplishmentReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeAccomplishmentReport: {} as OvertimeAccomplishment,
        loading: {
          ...state.loading,
          loadingAccomplishmentReport: loading,
        },
        error: {
          ...state.error,
          errorAccomplishmentReport: '',
        },
      }));
    },

    getOvertimeAccomplishmentReportSuccess: (loading: boolean, response: OvertimeAccomplishment) => {
      set((state) => ({
        ...state,
        overtimeAccomplishmentReport: response,
        loading: {
          ...state.loading,
          loadingAccomplishmentReport: loading,
        },
      }));
    },
    getOvertimeAccomplishmentReportFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingAccomplishmentReport: loading,
        },
        error: {
          ...state.error,
          errorAccomplishmentReport: error,
        },
      }));
    },

    //GET OVERTIME SUMMARY - COMPILED OT ACCOMPLISHMENTS
    getOvertimeSummaryReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeSummaryReport: {} as Array<OvertimeSummary>,
        loading: {
          ...state.loading,
          loadingOvertimeSummaryReport: loading,
        },
        error: {
          ...state.error,
          errorOvertimeSummaryReport: '',
        },
      }));
    },

    getOvertimeSummaryReportSuccess: (loading: boolean, response: Array<OvertimeSummary>) => {
      set((state) => ({
        ...state,
        overtimeSummaryReport: response,
        loading: {
          ...state.loading,
          loadingOvertimeSummaryReport: loading,
        },
      }));
    },
    getOvertimeSummaryReportFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeSummaryReport: loading,
        },
        error: {
          ...state.error,
          errorOvertimeSummaryReport: error,
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
          errorAccomplishment: '',
          errorEmployeeList: '',
          errorOvertimeSummary: '',
          errorOvertime: '',
        },
      }));
    },
  }))
);
