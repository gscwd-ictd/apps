/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveBenefitOptions } from '../../../../libs/utils/src/lib/types/leave-benefits.type';
import {
  EmployeeLeave,
  EmployeeLeaveDetails,
  CalendarDate,
  LeaveApplicationForm,
  EmployeeLeaveList,
  EmployeeLeaveCredits,
  LeaveId,
  LeaveApplicationResponse,
} from '../../../../libs/utils/src/lib/types/leave-application.type';
import { devtools } from 'zustand/middleware';
import axios, { AxiosResponse } from 'axios';

export type LeavesState = {
  leaves: {
    onGoing: Array<EmployeeLeave>;
    completed: Array<EmployeeLeave>;
  };
  leaveCredits: {
    vacation: number;
    forced: number;
    sick: number;
  };
  leaveId: string;
  leaveIndividualDetail: EmployeeLeaveDetails;
  unavailableDates: Array<CalendarDate>;
  response: {
    postResponseApply: LeaveApplicationResponse;
    deleteResponseCancel: LeaveId;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveTypes: boolean;
    loadingResponse: boolean;
    loadingLeaveCredits: boolean;
    loadingUnavailableDates: boolean;
    loadingIndividualLeave: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveTypes: string;
    errorResponse: string;
    errorLeaveCredits: string;
    errorUnavailableDates: string;
    errorIndividualLeave: string;
  };
  leaveDates: Array<string>;
  leaveDateFrom: string;
  leaveDateTo: string;
  leaveTypes: Array<LeaveBenefitOptions>;
  overlappingLeaveCount: number;

  applyLeaveModalIsOpen: boolean;
  pendingLeaveModalIsOpen: boolean;
  completedLeaveModalIsOpen: boolean;
  cancelLeaveModalIsOpen: boolean;
  tab: number;
  isGetLeaveLoading: boolean;

  setLeaveDates: (dates: Array<string>) => void;
  setLeaveDateFrom: (date: string) => void;
  setLeaveDateTo: (date: string) => void;
  setLeaveId: (id: string) => void;
  setOverlappingLeaveCount: (overlappingLeaveCount: number) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;

  postLeave: () => void;
  postLeaveSuccess: (response: LeaveApplicationResponse) => void;
  postLeaveFail: (error: string) => void;

  getLeaveTypes: (loading: boolean) => void;
  getLeaveTypesSuccess: (loading: boolean, response) => void;
  getLeaveTypesFail: (loading: boolean, error: string) => void;

  getLeaveCredits: (loading: boolean) => void;
  getLeaveCreditsSuccess: (loading: boolean, response) => void;
  getLeaveCreditsFail: (loading: boolean, error: string) => void;

  getLeaveIndividualDetail: (loading: boolean) => void;
  getLeaveIndividualDetailSuccess: (loading: boolean, response) => void;
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => void;

  getUnavailableDates: (loading: boolean) => void;
  getUnavailableSuccess: (loading: boolean, response) => void;
  getUnavailableFail: (loading: boolean, error: string) => void;

  setApplyLeaveModalIsOpen: (applyLeaveModalIsOpen: boolean) => void;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;
  setCompletedLeaveModalIsOpen: (completedLeaveModalIsOpen: boolean) => void;
  setCancelLeaveModalIsOpen: (cancelLeaveModalIsOpen: boolean) => void;

  setIsGetLeaveLoading: (isLoading: boolean) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const useLeaveStore = create<LeavesState>()(
  devtools((set) => ({
    leaves: {
      onGoing: [],
      completed: [],
    },
    leaveCredits: {
      vacation: 10.3,
      forced: 5,
      sick: 5.8,
    },
    leaveId: '',
    leaveIndividualDetail: {} as EmployeeLeaveDetails,
    unavailableDates: [] as Array<CalendarDate>,

    response: {
      postResponseApply: {} as LeaveApplicationResponse,
      deleteResponseCancel: {} as LeaveId,
    },
    loading: {
      loadingLeaves: false,
      loadingLeaveTypes: false,
      loadingResponse: false,
      loadingLeaveCredits: false,
      loadingUnavailableDates: false,
      loadingIndividualLeave: false,
    },
    error: {
      errorLeaves: '',
      errorLeaveTypes: '',
      errorResponse: '',
      errorLeaveCredits: '',
      errorUnavailableDates: '',
      errorIndividualLeave: '',
    },
    leaveDates: [] as Array<string>, //store employee selected dates during application
    leaveDateFrom: '',
    leaveDateTo: '',
    leaveTypes: [] as Array<LeaveBenefitOptions>,
    overlappingLeaveCount: 0,

    //APPLY LEAVE MODAL
    applyLeaveModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    completedLeaveModalIsOpen: false,
    cancelLeaveModalIsOpen: false,

    isGetLeaveLoading: true,
    tab: 1,

    setLeaveDates: (leaveDates: Array<string>) => {
      set((state) => ({ ...state, leaveDates }));
    },

    setLeaveDateFrom: (leaveDateFrom: string) => {
      set((state) => ({ ...state, leaveDateFrom }));
    },

    setLeaveDateTo: (leaveDateTo: string) => {
      set((state) => ({ ...state, leaveDateTo }));
    },

    setLeaveId: (leaveId: string) => {
      set((state) => ({ ...state, leaveId }));
    },

    setOverlappingLeaveCount: (overlappingLeaveCount: number) => {
      set((state) => ({ ...state, overlappingLeaveCount }));
    },

    setIsGetLeaveLoading: (isGetLeaveLoading: boolean) => {
      set((state) => ({ ...state, isGetLeaveLoading }));
    },

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setApplyLeaveModalIsOpen: (applyLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, applyLeaveModalIsOpen }));
    },

    setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingLeaveModalIsOpen }));
    },

    setCompletedLeaveModalIsOpen: (completedLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, completedLeaveModalIsOpen }));
    },

    setCancelLeaveModalIsOpen: (cancelLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelLeaveModalIsOpen }));
    },

    //GET LEAVE ACTIONS
    getLeaveList: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaves: {
          ...state.leaves,
          onGoing: [],
          completed: [],
        },
        loading: {
          ...state.loading,
          loadingLeaves: loading,
        },
        error: {
          ...state.error,
          errorLeaves: '',
        },
      }));
    },
    getLeaveListSuccess: (loading: boolean, response: EmployeeLeaveList) => {
      set((state) => ({
        ...state,
        leaves: {
          ...state.leaves,
          onGoing: response.ongoing,
          completed: response.completed,
        },
        loading: {
          ...state.loading,
          loadingLeaves: loading,
        },
      }));
    },
    getLeaveListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingLeaves: loading,
        },
        error: {
          ...state.error,
          errorLeaves: error,
        },
      }));
    },

    //POST LEAVE ACTIONS
    postLeave: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as LeaveApplicationResponse,
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
    postLeaveSuccess: (response: LeaveApplicationResponse) => {
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
    postLeaveFail: (error: string) => {
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

    //GET LEAVE TYPE ACTIONS
    getLeaveTypes: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaveTypes: {
          ...state.leaveTypes,
        },
        loading: {
          ...state.loading,
          loadingLeaveTypes: loading,
        },
        error: {
          ...state.error,
          errorLeaveTypes: '',
        },
      }));
    },
    getLeaveTypesSuccess: (loading: boolean, response: Array<LeaveBenefitOptions>) => {
      set((state) => ({
        ...state,
        leaveTypes: response,
        loading: {
          ...state.loading,
          loadingLeaveTypes: loading,
        },
      }));
    },
    getLeaveTypesFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingLeaveTypes: loading,
        },
        error: {
          ...state.error,
          errorLeaveTypes: error,
        },
      }));
    },

    //GET LEAVE CREDIT ACTIONS
    getLeaveCredits: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaveCredits: {
          ...state.leaveCredits,
          vacation: null,
          sick: null,
        },
        loading: {
          ...state.loading,
          loadingLeaveCredits: loading,
        },
        error: {
          ...state.error,
          errorLeaveCredits: '',
        },
      }));
    },
    getLeaveCreditsSuccess: (loading: boolean, response: EmployeeLeaveCredits) => {
      set((state) => ({
        ...state,
        leaves: {
          ...state.leaves,
          vacation: response.vacation,
          sick: response.sick,
        },
        loading: {
          ...state.loading,
          loadingLeaveCredits: loading,
        },
      }));
    },
    getLeaveCreditsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingLeaveCredits: loading,
        },
        error: {
          ...state.error,
          errorLeaveCredits: error,
        },
      }));
    },

    //GET CURRENT APPROVED/PENDING LEAVE DATES ACTIONS
    getUnavailableDates: (loading: boolean) => {
      set((state) => ({
        ...state,
        unavailableDates: {
          ...state.unavailableDates,
          unavailableDates: [],
        },
        loading: {
          ...state.loading,
          loadingUnavailableDates: loading,
        },
        error: {
          ...state.error,
          errorUnavailableDates: '',
        },
      }));
    },
    getUnavailableSuccess: (loading: boolean, response: Array<CalendarDate>) => {
      set((state) => ({
        ...state,
        unavailableDates: {
          ...state.unavailableDates,
          unavailableDates: response,
        },
        loading: {
          ...state.loading,
          loadingUnavailableDates: loading,
        },
      }));
    },
    getUnavailableFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingUnavailableDates: loading,
        },
        error: {
          ...state.error,
          errorUnavailableDates: error,
        },
      }));
    },

    //GET LEAVE INDIVIDUAL DETAILS ACTIONS
    getLeaveIndividualDetail: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaveIndividualDetail: {} as EmployeeLeaveDetails,
        loading: {
          ...state.loading,
          loadingIndividualLeave: loading,
        },
        error: {
          ...state.error,
          errorIndividualLeave: '',
        },
      }));
    },
    getLeaveIndividualDetailSuccess: (loading: boolean, response: EmployeeLeaveDetails) => {
      set((state) => ({
        ...state,
        leaveIndividualDetail: response,
        loading: {
          ...state.loading,
          loadingIndividualLeave: loading,
        },
      }));
    },
    getLeaveIndividualDetailFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingIndividualLeave: loading,
        },
        error: {
          ...state.error,
          errorIndividualLeave: error,
        },
      }));
    },
    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as LeaveApplicationResponse,
          deleteResponseCancel: {} as LeaveId,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
  }))
);

type AppState = {
  name: string;
  id: string;
};

type TestState = {
  loading: boolean;
  appState: AppState;
  setAppState: (appState: AppState) => void;
  error: boolean;
};

export const useTestStore = create<TestState>((set) => ({
  appState: {} as AppState,
  error: false,
  loading: false,
  setAppState: (state) => {
    // begin
    set({ loading: true });

    const result = axios.get('') as unknown as AxiosResponse;

    // set error or response
    if (result.data) {
      set({ appState: result.data });
      set({ loading: false });
    } else {
      set({ loading: false });
      set({ error: true });
    }
  },
}));
