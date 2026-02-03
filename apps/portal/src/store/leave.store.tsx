/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveBenefitOptions } from '../../../../libs/utils/src/lib/types/leave-benefits.type';
import {
  EmployeeLeave,
  EmployeeLeaveDetails,
  CalendarDate,
  EmployeeLeaveList,
  EmployeeLeaveCredits,
  LeaveId,
  LeaveApplicationResponse,
  UnavailableDates,
} from '../../../../libs/utils/src/lib/types/leave-application.type';
import { devtools } from 'zustand/middleware';
import axios, { AxiosResponse } from 'axios';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';

export type LeavesState = {
  leaves: {
    onGoing: Array<EmployeeLeave>;
    completed: Array<EmployeeLeave>;
  };

  leaveId: string;
  leaveIndividualDetail: EmployeeLeaveDetails;
  unavailableDates: UnavailableDates;
  response: {
    postResponseApply: LeaveApplicationResponse;
    patchResponseCancel: any;
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

  justificationLetterPdfModalIsOpen: boolean;
  leaveDetailsPdfModalIsOpen: boolean;
  applyLeaveModalIsOpen: boolean;
  pendingLeaveModalIsOpen: boolean;
  completedLeaveModalIsOpen: boolean;
  cancelLeaveModalIsOpen: boolean;
  confirmCancelLeaveModalIsOpen: boolean;
  tab: number;
  isGetLeaveLoading: boolean;

  monetizationList: Array<EmployeeLeave>;

  serverDate: string;
  setServerDate: (serverDate: string) => void;

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

  patchLeave: () => void;
  patchLeaveSuccess: (response: any) => void;
  patchLeaveFail: (error: string) => void;

  getLeaveTypes: (loading: boolean) => void;
  getLeaveTypesSuccess: (loading: boolean, response) => void;
  getLeaveTypesFail: (loading: boolean, error: string) => void;

  getLeaveIndividualDetail: (loading: boolean) => void;
  getLeaveIndividualDetailSuccess: (loading: boolean, response) => void;
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => void;

  getUnavailableDates: (loading: boolean) => void;
  getUnavailableSuccess: (loading: boolean, response) => void;
  getUnavailableFail: (loading: boolean, error: string) => void;

  setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => void;
  setLeaveDetailsPdfModalIsOpen: (leaveDetailsPdfModalIsOpen: boolean) => void;
  setApplyLeaveModalIsOpen: (applyLeaveModalIsOpen: boolean) => void;
  setPendingLeaveModalIsOpen: (pendingLeaveModalIsOpen: boolean) => void;
  setCompletedLeaveModalIsOpen: (completedLeaveModalIsOpen: boolean) => void;
  setCancelLeaveModalIsOpen: (cancelLeaveModalIsOpen: boolean) => void;
  setConfirmCancelLeaveModalIsOpen: (confirmCancelLeaveModalIsOpen: boolean) => void;

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

    leaveId: '',
    leaveIndividualDetail: {} as EmployeeLeaveDetails,
    unavailableDates: {} as UnavailableDates,

    response: {
      postResponseApply: {} as LeaveApplicationResponse,
      patchResponseCancel: {} as any,
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

    //LEAVE MODAL
    justificationLetterPdfModalIsOpen: false,
    leaveDetailsPdfModalIsOpen: false,
    applyLeaveModalIsOpen: false,
    pendingLeaveModalIsOpen: false,
    completedLeaveModalIsOpen: false,
    cancelLeaveModalIsOpen: false,
    confirmCancelLeaveModalIsOpen: false,

    isGetLeaveLoading: true,
    tab: 1,

    monetizationList: [],

    serverDate: '',
    setServerDate: (serverDate: string) => {
      set((state) => ({ ...state, serverDate }));
    },

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

    setJustificationLetterPdfModalIsOpen: (justificationLetterPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, justificationLetterPdfModalIsOpen }));
    },

    setLeaveDetailsPdfModalIsOpen: (leaveDetailsPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, leaveDetailsPdfModalIsOpen }));
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

    setConfirmCancelLeaveModalIsOpen: (confirmCancelLeaveModalIsOpen: boolean) => {
      set((state) => ({ ...state, confirmCancelLeaveModalIsOpen }));
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
        error: {
          ...state.error,
          errorLeaves: '',
        },
        monetizationList: response.completed.filter(
          (item) => item.leaveName === LeaveName.MONETIZATION && item.status === LeaveStatus.APPROVED
        ),
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

    //POST LEAVE ACTIONS (APPLY LEAVE)
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

    //POST LEAVE ACTIONS (CANCEL LEAVE)
    patchLeave: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseCancel: {} as any,
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
    patchLeaveSuccess: (response: any) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseCancel: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchLeaveFail: (error: string) => {
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
        error: {
          ...state.error,
          errorLeaveTypes: '',
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

    //GET CURRENT APPROVED/PENDING LEAVE DATES ACTIONS
    getUnavailableDates: (loading: boolean) => {
      set((state) => ({
        ...state,
        unavailableDates: {} as UnavailableDates,
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
    getUnavailableSuccess: (loading: boolean, response: UnavailableDates) => {
      set((state) => ({
        ...state,
        unavailableDates: response,
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
          patchResponseCancel: {} as any,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
  }))
);
