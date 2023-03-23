import { create } from 'zustand';
import {
  Leave,
  LeaveContents,
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
  response: {
    postResponseApply: LeaveContents;
    deleteResponseCancel: LeaveId;
  };
  loading: {
    loadingLeaves: boolean;
    loadingLeaveTypes: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorLeaves: string;
    errorLeaveTypes: string;
    errorResponse: string;
  };
  leaveDates: Array<string>;
  leaveTypes: Array<LeaveType>;

  leaveIndividual: LeaveContents;
  applyLeaveModalIsOpen: boolean;
  pendingLeaveModalIsOpen: boolean;
  completedLeaveModalIsOpen: boolean;
  tab: number;
  isGetLeaveLoading: boolean;

  setLeaveDates: (dates: Array<string>) => void;

  getLeaveList: (loading: boolean) => void;
  getLeaveListSuccess: (loading: boolean, response) => void;
  getLeaveListFail: (loading: boolean, error: string) => void;

  postLeave: () => void;
  postLeaveSuccess: (response: LeaveContents) => void;
  postLeaveFail: (error: string) => void;

  getLeaveTypes: (loading: boolean) => void;
  getLeaveTypesSuccess: (loading: boolean, response) => void;
  getLeaveTypesFail: (loading: boolean, error: string) => void;

  setApplyLeaveModalIsOpen: (applyLeaveModalIsOpen: boolean) => void;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;
  setCompletedLeaveModalIsOpen: (completedLeaveModalIsOpen: boolean) => void;

  getLeaveIndividual: (leaveIndividual: LeaveContents) => void;
  setIsGetLeaveLoading: (isLoading: boolean) => void;
  setTab: (tab: number) => void;
};

export const useLeaveStore = create<LeavesState>()(
  devtools((set) => ({
    leaves: {
      onGoing: [],
      completed: [],
    },
    response: {
      postResponseApply: {} as LeaveContents,
      deleteResponseCancel: {} as LeaveId,
    },
    loading: {
      loadingLeaves: false,
      loadingLeaveTypes: false,
      loadingResponse: false,
    },
    error: {
      errorLeaves: '',
      errorLeaveTypes: '',
      errorResponse: '',
    },
    leaveDates: [] as Array<string>,
    leaveTypes: [] as Array<LeaveType>,

    leaveIndividual: {} as LeaveContents,

    //APPLY LEAVE MODAL
    applyLeaveModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    completedLeaveModalIsOpen: false,

    isGetLeaveLoading: true,
    tab: 1,

    setLeaveDates: (leaveDates: Array<string>) => {
      set((state) => ({ ...state, leaveDates }));
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

    getLeaveIndividual: (leaveIndividual: LeaveContents) => {
      set((state) => ({ ...state, leaveIndividual }));
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
    getLeaveListSuccess: (loading: boolean, response: Leave) => {
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
  }))
);
