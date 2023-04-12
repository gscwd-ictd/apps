import { create } from 'zustand';
import {
  CalendarDate,
  GetLeaveDetails,
  Leave,
  LeaveContents,
  LeaveCredit,
  LeaveId,
  LeaveList,
  LeaveType,
} from '../types/leave.type';
import { devtools } from 'zustand/middleware';

export type LeavesState = {
  leaves: {
    onGoing: Array<Leave>;
    completed: Array<Leave>;
  };
  leaveCredits: {
    vacation: number;
    forced: number;
    sick: number;
  };
  leaveId: string;
  leaveIndividualDetail: GetLeaveDetails;
  unavailableDates: Array<CalendarDate>;
  response: {
    postResponseApply: LeaveContents;
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
  leaveTypes: Array<LeaveType>;
  overlappingLeaveCount: number;

  applyLeaveModalIsOpen: boolean;
  pendingLeaveModalIsOpen: boolean;
  completedLeaveModalIsOpen: boolean;
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
  postLeaveSuccess: (response: LeaveContents) => void;
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

  setIsGetLeaveLoading: (isLoading: boolean) => void;
  setTab: (tab: number) => void;
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
    leaveIndividualDetail: {} as GetLeaveDetails,
    unavailableDates: [] as Array<CalendarDate>,

    response: {
      postResponseApply: {} as LeaveContents,
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
    leaveTypes: [] as Array<LeaveType>,
    overlappingLeaveCount: 0,

    //APPLY LEAVE MODAL
    applyLeaveModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    completedLeaveModalIsOpen: false,

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
    getLeaveListSuccess: (loading: boolean, response: LeaveList) => {
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
          postResponseApply: {} as LeaveContents,
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
    postLeaveSuccess: (response: LeaveContents) => {
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
    getLeaveTypesSuccess: (loading: boolean, response: Array<LeaveType>) => {
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
    getLeaveCreditsSuccess: (loading: boolean, response: LeaveCredit) => {
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
    getUnavailableSuccess: (
      loading: boolean,
      response: Array<CalendarDate>
    ) => {
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
        leaveIndividualDetail: {} as GetLeaveDetails,
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
    getLeaveIndividualDetailSuccess: (
      loading: boolean,
      response: GetLeaveDetails
    ) => {
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
  }))
);
