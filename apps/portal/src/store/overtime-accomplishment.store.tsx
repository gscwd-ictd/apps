/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { OvertimeForm } from 'libs/utils/src/lib/types/overtime.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OvertimeAccomplishmentDetails = {
  id: string;
  plannedDate: string;
  estimatedHours: string;
  purpose: string;
  status: string;
  immediateSupervisorName: string;
  employees: Array<EmployeeOvertimeDetail>;
};

export type EmployeeOvertimeDetail = {
  employeeId: string;
  companyId: string;
  fullName: string;
  scheduleBase: string;
  avatarUrl: string;
  assignment: string;
};

export type OvertimeList = {
  forApproval: Array<OvertimeAccomplishmentDetails>;
  completed: Array<OvertimeAccomplishmentDetails>;
};

export type OvertimeState = {
  overtime: {
    forApproval: Array<OvertimeAccomplishmentDetails>;
    completed: Array<OvertimeAccomplishmentDetails>;
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

  overtimeDetails: OvertimeAccomplishmentDetails;
  pendingOvertimeAccomplishmentModalIsOpen: boolean;
  completedOvertimeAccomplishmentModalIsOpen: boolean;
  confirmOvertimeAccomplishmentModalIsOpen: boolean;
  tab: number;

  getOvertimeAccomplishmentList: (loading: boolean) => void;
  getOvertimeAccomplishmentListSuccess: (loading: boolean, response) => void;
  getOvertimeAccomplishmentListFail: (loading: boolean, error: string) => void;

  cancelOvertime: (loading: boolean) => void;
  cancelOvertimeSuccess: (response) => void;
  cancelOvertimeFail: (error: string) => void;

  postOvertimeAccomplishment: () => void;
  postOvertimeAccomplishmentSuccess: (response: OvertimeForm) => void;
  postOvertimeAccomplishmentFail: (error: string) => void;

  setPendingOvertimeAccomplishmentModalIsOpen: (pendingOvertimeAccomplishmentModalIsOpen: boolean) => void;
  setCompletedOvertimeAccomplishmentModalIsOpen: (completedOvertimeAccomplishmentModalIsOpen: boolean) => void;
  setConfirmOvertimeAccomplishmentModalIsOpen: (confirmOvertimeAccomplishmentModalIsOpen: boolean) => void;

  setOvertimeDetails: (overtimeDetails: OvertimeAccomplishmentDetails) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useOvertimeAccomplishmentStore = create<OvertimeState>()(
  devtools((set) => ({
    overtime: {
      forApproval: [
        {
          id: 'e5d69068-3ed6-459f-9b86-f08463454fc6',
          plannedDate: '2023-09-08',
          estimatedHours: '3',
          purpose: 'Repair of computers',
          status: 'pending',
          immediateSupervisorName: 'Michael G. Gabales',
          employees: [
            {
              employeeId: '05b0614c-b191-11ed-a79b-000c29f95a80',
              companyId: '2019-016',
              fullName: 'John Henry S. Alfeche',
              scheduleBase: 'Office',
              avatarUrl: 'http://172.20.110.45:4500/ALFECHE.jpg',
              assignment: 'Systems Development and Application Division',
            },
            {
              employeeId: '62f1cd41-b26f-11ed-a79b-000c29f95a80',
              companyId: '2015-003',
              fullName: 'Jay M. Sabio',
              scheduleBase: 'Pumping Station',
              avatarUrl: 'http://172.20.110.45:4500/SABIO.jpg',
              assignment: 'Water Quality, Production and Electromechanical Division',
            },
            {
              employeeId: 'af635f15-b26e-11ed-a79b-000c29f95a80',
              companyId: '2020-003',
              fullName: 'Phyll Patrick C. Fragata',
              scheduleBase: 'Office',
              avatarUrl: 'http://172.20.110.45:4500/FRAGATA.jpg',
              assignment: 'Systems Development and Application Division',
            },
          ],
        },
      ],
      completed: [
        {
          id: 'e5d69068-3ed6-459f-9b86-f08463454fc6',
          plannedDate: '2023-09-08',
          estimatedHours: '3',
          purpose: 'Repair of computers',
          status: 'approved',
          immediateSupervisorName: 'Michael G. Gabales',
          employees: [
            {
              employeeId: '05b0614c-b191-11ed-a79b-000c29f95a80',
              companyId: '2019-016',
              fullName: 'John Henry S. Alfeche',
              scheduleBase: 'Office',
              avatarUrl: 'http://172.20.110.45:4500/ALFECHE.jpg',
              assignment: 'Systems Development and Application Division',
            },
            {
              employeeId: '62f1cd41-b26f-11ed-a79b-000c29f95a80',
              companyId: '2015-003',
              fullName: 'Jay M. Sabio',
              scheduleBase: 'Pumping Station',
              avatarUrl: 'http://172.20.110.45:4500/SABIO.jpg',
              assignment: 'Water Quality, Production and Electromechanical Division',
            },
            {
              employeeId: 'af635f15-b26e-11ed-a79b-000c29f95a80',
              companyId: '2020-003',
              fullName: 'Phyll Patrick C. Fragata',
              scheduleBase: 'Office',
              avatarUrl: 'http://172.20.110.45:4500/FRAGATA.jpg',
              assignment: 'Systems Development and Application Division',
            },
          ],
        },
      ],
    },
    response: {
      postResponseApply: {},
      cancelResponse: {} as OvertimeAccomplishmentDetails,
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

    overtimeDetails: {} as OvertimeAccomplishmentDetails,

    pendingOvertimeAccomplishmentModalIsOpen: false,
    completedOvertimeAccomplishmentModalIsOpen: false,
    confirmOvertimeAccomplishmentModalIsOpen: false,

    tab: 1,

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

    setOvertimeDetails: (overtimeDetails: OvertimeAccomplishmentDetails) => {
      set((state) => ({ ...state, overtimeDetails }));
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
    getOvertimeAccomplishmentListSuccess: (loading: boolean, response: OvertimeList) => {
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
    postOvertimeAccomplishment: () => {
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
    postOvertimeAccomplishmentSuccess: (response) => {
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
    postOvertimeAccomplishmentFail: (error: string) => {
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
          cancelResponse: {} as OvertimeAccomplishmentDetails,
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
    cancelOvertimeSuccess: (response: OvertimeAccomplishmentDetails) => {
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
