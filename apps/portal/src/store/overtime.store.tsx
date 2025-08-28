/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import {
  EmployeeOvertimeDetail,
  OvertimeAccomplishment,
  OvertimeAccomplishmentReport,
  OvertimeAuthorization,
  OvertimeAuthorizationAccomplishment,
  OvertimeDetails,
  OvertimeForm,
  OvertimeList,
  OvertimeSummary,
} from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { NightDifferentialEmployee } from '../types/employee.type';
import { NightDifferentialReport } from '../types/night-differential.type';

export type OvertimeState = {
  employeeList: Array<SelectOption>;
  nightDiffEmployees: Array<NightDifferentialEmployee>;
  mutatedNightDiffEmployees: Array<SelectOption>;
  // overtime: {
  //   forApproval: Array<OvertimeDetails>;
  //   completed: Array<OvertimeDetails>;
  //   supervisorName: string;
  // };
  overtime: {
    overtimes: Array<OvertimeDetails>;
    supervisorName: string;
  };
  response: {
    postResponseApply: any;
    cancelResponse: any;
    removeEmployeeResponse: any;
  };
  loading: {
    loadingOvertime: boolean;
    loadingResponse: boolean;
    loadingEmployeeList: boolean;
    loadingNightDiffEmployeeList: boolean;
    loadingAccomplishment: boolean;
    loadingAuthorizationReport: boolean;
    loadingAccomplishmentReport: boolean;
    loadingOvertimeSummaryReport: boolean;
    loadingOvertimeAuthorizationAccomplishmentReport: boolean;
    loadingRemoveEmployee: boolean;
    loadingNightDifferentialReport: boolean;
  };
  error: {
    errorOvertime: string;
    errorResponse: string;
    errorEmployeeList: string;
    errorNightDiffEmployeeList: string;
    errorAccomplishment: string;
    errorAuthorizationReport: string;
    errorAccomplishmentReport: string;
    errorOvertimeSummaryReport: string;
    errorOvertimeAuthorizationAccomplishmentReport: string;
    errorRemoveEmployee: string;
    errorNightDifferentialReport: string;
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

  getNightDiffEmployeeList: (loading: boolean) => void;
  getNightDiffEmployeeListSuccess: (loading: boolean, response) => void;
  getNightDiffEmployeeListFail: (loading: boolean, error: string) => void;
  setMutatedNightDiffEmployees: (mutatedNightDiffEmployees: Array<SelectOption>) => void;

  overtimeDetails: OvertimeDetails;
  removeEmployeeModalIsOpen: boolean;
  overtimeSummaryModalIsOpen: boolean;
  cancelOvertimeModalIsOpen: boolean;
  applyOvertimeModalIsOpen: boolean;
  pendingOvertimeModalIsOpen: boolean;
  completedOvertimeModalIsOpen: boolean;
  accomplishmentOvertimeModalIsOpen: boolean;
  nightDifferentialModalIsOpen: boolean;
  pdfAccomplishmentReportModalIsOpen: boolean;
  pdfOvertimeAuthorizationModalIsOpen: boolean;
  pdfOvertimeSummaryModalIsOpen: boolean;
  pdfOvertimeAuthorizationAccomplishmentModalIsOpen: boolean;
  pdfNightDifferentialModalIsOpen: boolean;

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
  overtimeSummaryReport: OvertimeSummary;
  getOvertimeSummaryReport: (loading: boolean) => void;
  getOvertimeSummaryReportSuccess: (loading: boolean, response) => void;
  getOvertimeSummaryReportFail: (loading: boolean, error: string) => void;

  //for getting employee's accomplishment report in PDF
  overtimeAccomplishmentReport: OvertimeAccomplishmentReport;
  getOvertimeAccomplishmentReport: (loading: boolean) => void;
  getOvertimeAccomplishmentReportSuccess: (loading: boolean, response) => void;
  getOvertimeAccomplishmentReportFail: (loading: boolean, error: string) => void;

  //for getting night differential report in PDF
  nightDifferentialReport: NightDifferentialReport;
  getNightDifferentialReport: (loading: boolean) => void;
  getNightDifferentialReportSuccess: (loading: boolean, response) => void;
  getNightDifferentialReportFail: (loading: boolean, error: string) => void;

  //for getting overtime authorization report in PDF
  overtimeAuthorizationReport: OvertimeAuthorization;
  getOvertimeAuthorizationReport: (loading: boolean) => void;
  getOvertimeAuthorizationReportSuccess: (loading: boolean, response) => void;
  getOvertimeAuthorizationReportFail: (loading: boolean, error: string) => void;

  //for getting overtime accomplishment summary report in PDF - combined authorization and accomplishment
  overtimeAuthorizationAccomplishmentReport: OvertimeAuthorizationAccomplishment;
  getOvertimeAuthorizationAccomplishmentReport: (loading: boolean) => void;
  getOvertimeAuthorizationAccomplishmentReportSuccess: (loading: boolean, response) => void;
  getOvertimeAuthorizationAccomplishmentReportFail: (loading: boolean, error: string) => void;

  //get list of overtime (for approval/completed)
  getOvertimeList: (loading: boolean) => void;
  getOvertimeListSuccess: (loading: boolean, response) => void;
  getOvertimeListFail: (loading: boolean, error: string) => void;

  cancelOvertime: () => void;
  cancelOvertimeSuccess: (response) => void;
  cancelOvertimeFail: (error: string) => void;

  removeEmployee: () => void;
  removeEmployeeSuccess: (response) => void;
  removeEmployeeFail: (error: string) => void;

  removeEmployeeFromOvertime: (employeeId: string, employees: Array<EmployeeOvertimeDetail>) => void;

  postOvertime: () => void;
  postOvertimeSuccess: (response: OvertimeForm) => void;
  postOvertimeFail: (error: string) => void;

  putOvertime: () => void;
  putOvertimeSuccess: (response: OvertimeForm) => void;
  putOvertimeFail: (error: string) => void;

  setRemoveEmployeeModalIsOpen: (removeEmployeeModalIsOpen: boolean) => void;
  setOvertimeSummaryModalIsOpen: (overtimeSummaryModalIsOpen: boolean) => void;
  setCancelOvertimeModalIsOpen: (cancelOvertimeModalIsOpen: boolean) => void;
  setApplyOvertimeModalIsOpen: (applyOvertimeModalIsOpen: boolean) => void;
  setPendingOvertimeModalIsOpen: (pendingOvertimeModalIsOpen: boolean) => void;
  setCompletedOvertimeModalIsOpen: (completedOvertimeModalIsOpen: boolean) => void;
  setAccomplishmentOvertimeModalIsOpen: (accomplishmentOvertimeModalIsOpen: boolean) => void;

  setPdfAccomplishmentReportModalIsOpen: (pdfAccomplishmentReportModalIsOpen: boolean) => void;
  setPdfOvertimeAuthorizationModalIsOpen: (pdfOvertimeAuthorizationModalIsOpen: boolean) => void;
  setPdfOvertimeSummaryModalIsOpen: (pdfOvertimeSummaryModalIsOpen: boolean) => void;
  setPdfOvertimeAuthorizationAccomplishmentModalIsOpen: (
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen: boolean
  ) => void;
  setPdfNightDifferentialModalIsOpen: (pdfNightDifferentialModalIsOpen: boolean) => void;
  setNightDifferentialModalIsOpen: (nightDifferentialModalIsOpen: boolean) => void;

  //getting overtime details inside MODAL
  setOvertimeDetails: (overtimeDetails: OvertimeDetails) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useOvertimeStore = create<OvertimeState>()(
  devtools((set) => ({
    employeeList: [],
    nightDiffEmployees: [],
    mutatedNightDiffEmployees: [],
    overtime: {
      overtimes: [],
      supervisorName: '',
    },
    response: {
      postResponseApply: {},
      cancelResponse: {} as OvertimeDetails,
      removeEmployeeResponse: {},
    },
    loading: {
      loadingOvertime: false,
      loadingResponse: false,
      loadingEmployeeList: false,
      loadingNightDiffEmployeeList: false,
      loadingAccomplishment: false,
      loadingAuthorizationReport: false,
      loadingAccomplishmentReport: false,
      loadingOvertimeSummaryReport: false,
      loadingOvertimeAuthorizationAccomplishmentReport: false,
      loadingRemoveEmployee: false,
      loadingNightDifferentialReport: false,
    },
    error: {
      errorOvertime: '',
      errorResponse: '',
      errorEmployeeList: '',
      errorNightDiffEmployeeList: '',
      errorAccomplishment: '',
      errorAuthorizationReport: '',
      errorAccomplishmentReport: '',
      errorOvertimeSummaryReport: '',
      errorOvertimeAuthorizationAccomplishmentReport: '',
      errorRemoveEmployee: '',
      errorNightDifferentialReport: '',
    },

    overtimeDetails: {} as OvertimeDetails,
    accomplishmentDetails: {} as OvertimeAccomplishment,
    overtimeSummaryReport: {} as OvertimeSummary,
    nightDifferentialReport: {} as NightDifferentialReport,

    overtimeAuthorizationReport: {} as OvertimeAuthorization,
    overtimeAccomplishmentReport: {} as OvertimeAccomplishmentReport,
    overtimeAuthorizationAccomplishmentReport: {} as OvertimeAuthorizationAccomplishment,

    removeEmployeeModalIsOpen: false,
    overtimeSummaryModalIsOpen: false,
    applyOvertimeModalIsOpen: false,
    pendingOvertimeModalIsOpen: false,
    completedOvertimeModalIsOpen: false,
    cancelOvertimeModalIsOpen: false,
    accomplishmentOvertimeModalIsOpen: false,
    pdfAccomplishmentReportModalIsOpen: false,
    pdfOvertimeAuthorizationModalIsOpen: false,
    pdfOvertimeSummaryModalIsOpen: false,
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen: false,
    pdfNightDifferentialModalIsOpen: false,
    nightDifferentialModalIsOpen: false,
    tab: 1,

    selectedMonth: null,
    selectedYear: null,
    selectedPeriod: null,
    selectedEmployeeType: null,

    setMutatedNightDiffEmployees: (mutatedNightDiffEmployees: Array<SelectOption>) => {
      return set((state) => ({ ...state, mutatedNightDiffEmployees }));
    },

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

    setRemoveEmployeeModalIsOpen: (removeEmployeeModalIsOpen: boolean) => {
      set((state) => ({ ...state, removeEmployeeModalIsOpen }));
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

    setPdfOvertimeAuthorizationAccomplishmentModalIsOpen: (
      pdfOvertimeAuthorizationAccomplishmentModalIsOpen: boolean
    ) => {
      set((state) => ({ ...state, pdfOvertimeAuthorizationAccomplishmentModalIsOpen }));
    },

    setPdfNightDifferentialModalIsOpen: (pdfNightDifferentialModalIsOpen: boolean) => {
      set((state) => ({ ...state, pdfNightDifferentialModalIsOpen }));
    },

    setNightDifferentialModalIsOpen: (nightDifferentialModalIsOpen: boolean) => {
      set((state) => ({ ...state, nightDifferentialModalIsOpen }));
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

    //GET NIGHT DIFFERENTIAL EPORT FOR PDF
    getNightDifferentialReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        nightDifferentialReport: {} as NightDifferentialReport,
        loading: {
          ...state.loading,
          loadingNightDifferentialReport: loading,
        },
        error: {
          ...state.error,
          errorNightDifferentialReport: '',
        },
      }));
    },

    getNightDifferentialReportSuccess: (loading: boolean, response: NightDifferentialReport) => {
      set((state) => ({
        ...state,
        nightDifferentialReport: response,
        loading: {
          ...state.loading,
          loadingNightDifferentialReport: loading,
        },
      }));
    },
    getNightDifferentialReportFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingNightDifferentialReport: loading,
        },
        error: {
          ...state.error,
          errorNightDifferentialReport: error,
        },
      }));
    },

    //GET OVERTIME ACCOMPLISHMENT REPORT FOR PDF
    getOvertimeAccomplishmentReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeAccomplishmentReport: {} as OvertimeAccomplishmentReport,
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

    getOvertimeAccomplishmentReportSuccess: (loading: boolean, response: OvertimeAccomplishmentReport) => {
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
        overtimeSummaryReport: {} as OvertimeSummary,
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

    getOvertimeSummaryReportSuccess: (loading: boolean, response: OvertimeSummary) => {
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

    //GET OVERTIME AUTHORIZATION-ACCOMPLISHMENT REPORT FOR PDF
    getOvertimeAuthorizationAccomplishmentReport: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtimeAuthorizationAccomplishmentReport: {} as OvertimeAuthorizationAccomplishment,
        loading: {
          ...state.loading,
          loadingOvertimeAuthorizationAccomplishmentReport: loading,
        },
        error: {
          ...state.error,
          errorOvertimeAuthorizationAccomplishmentReport: '',
        },
      }));
    },

    getOvertimeAuthorizationAccomplishmentReportSuccess: (
      loading: boolean,
      response: OvertimeAuthorizationAccomplishment
    ) => {
      set((state) => ({
        ...state,
        overtimeAuthorizationAccomplishmentReport: response,
        loading: {
          ...state.loading,
          loadingOvertimeAuthorizationAccomplishmentReport: loading,
        },
        error: {
          ...state.error,
          errorOvertimeAuthorizationAccomplishmentReport: '',
        },
      }));
    },
    getOvertimeAuthorizationAccomplishmentReportFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingOvertimeAuthorizationAccomplishmentReport: loading,
        },
        error: {
          ...state.error,
          errorOvertimeAuthorizationAccomplishmentReport: error,
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

    //GET NIGHT SHIFT DIFFERENTIAL EMPLOYEE LIST ACTIONS
    getNightDiffEmployeeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        nightDiffEmployees: [],
        mutatedNightDiffEmployees: [],
        loading: {
          ...state.loading,
          loadingNightDiffEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorNightDiffEmployeeList: '',
        },
      }));
    },
    getNightDiffEmployeeListSuccess: (loading: boolean, response: Array<NightDifferentialEmployee>) => {
      set((state) => ({
        ...state,
        nightDiffEmployees: response,
        loading: {
          ...state.loading,
          loadingNightDiffEmployeeList: loading,
        },
      }));
    },
    getNightDiffEmployeeListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingNightDiffEmployeeList: loading,
        },
        error: {
          ...state.error,
          errorNightDiffEmployeeList: error,
        },
      }));
    },

    //GET OVERTIME ACTIONS
    getOvertimeList: (loading: boolean) => {
      set((state) => ({
        ...state,
        overtime: {
          ...state.overtime,
          // forApproval: [],
          // completed: [],
          overtimes: [],
          supervisorName: '',
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
          // forApproval: response.forApproval,
          // completed: response.completed,
          overtimes: response.overtimes,
          supervisorName: response.supervisorName,
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
    postOvertimeSuccess: (response: any) => {
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

    //POST OVERTIME ACTIONS
    putOvertime: () => {
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
    putOvertimeSuccess: (response: any) => {
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
    putOvertimeFail: (error: string) => {
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

    //REMOVE EMPLOYEE FROM OVERTIME
    removeEmployee: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          removeEmployeeResponse: {},
        },
        loading: {
          ...state.loading,
          loadingRemoveEmployee: true,
        },
        error: {
          ...state.error,
          errorRemoveEmployee: '',
        },
      }));
    },
    removeEmployeeSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          removeEmployeeResponse: response,
        },
        loading: {
          ...state.loading,
          loadingRemoveEmployee: false,
        },
      }));
    },
    removeEmployeeFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingRemoveEmployee: false,
        },
        error: {
          ...state.error,
          errorRemoveEmployee: error,
        },
      }));
    },

    removeEmployeeFromOvertime: (employeeId: string, employees: Array<EmployeeOvertimeDetail>) => {
      //old removal of employees from overtime
      // const tempEmployees = employees.filter((employee) => employee.employeeId !== employeeId);
      // set((state) => ({
      //   ...state,
      //   overtimeDetails: {
      //     ...state.overtimeDetails,
      //     employees: tempEmployees,
      //   },
      // }));

      const tempEmployees = employees.map((item) =>
        item.employeeId !== employeeId
          ? item
          : { ...item, accomplishmentStatus: OvertimeAccomplishmentStatus.REMOVED_BY_SUPERVISOR }
      );
      set((state) => ({
        ...state,
        overtimeDetails: {
          ...state.overtimeDetails,
          employees: tempEmployees,
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
          removeEmployeeResponse: {},
        },
        error: {
          ...state.error,
          errorResponse: '',
          errorAccomplishment: '',
          errorEmployeeList: '',
          errorOvertimeSummary: '',
          errorOvertime: '',
          errorRemoveEmployee: '',
        },
      }));
    },
  }))
);
