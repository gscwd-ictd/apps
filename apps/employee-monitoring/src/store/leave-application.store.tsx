/* eslint-disable @nx/enforce-module-boundaries */
import {
  EmployeeLeaveDetails,
  MonitoringLeave,
  LeaveCancellationDetails,
  LeaveCancellation,
} from '../../../../libs/utils/src/lib/types/leave-application.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type LoadingLeaveApplication = {
  loadingLeaveApplications: boolean;
  loadingLeaveApplicationDetails: boolean;
  loadingPatchLeaveApplication: boolean;
};

type ErrorLeaveApplication = {
  errorLeaveApplications: string;
  errorLeaveApplicationDetails: string;
  errorPatchLeaveApplication: string;
};

type ResponseLeaveApplication = {
  patchResponse: EmployeeLeaveDetails;
};

export enum LeaveConfirmAction {
  YES = 'yes',
  NO = 'no',
}

type LeaveApplicationState = {
  leaveApplication: ResponseLeaveApplication;
  leaveApplications: Array<MonitoringLeave>;
  leaveApplicationDetails: EmployeeLeaveDetails;
  leaveIndividualDetail: EmployeeLeaveDetails;
  loading: LoadingLeaveApplication;
  error: ErrorLeaveApplication;
  leaveConfirmAction: LeaveConfirmAction | null;
  setLeaveApplicationDetails: (leaveApplicationDetails: EmployeeLeaveDetails) => void;
  emptyResponseAndErrors: () => void;

  getLeaveApplications: () => void;
  getLeaveApplicationsSuccess: (response: Array<MonitoringLeave>) => void;
  getLeaveApplicationsFail: (error: string) => void;

  getLeaveApplicationDetails: () => void;
  getLeaveApplicationDetailsSuccess: (response: EmployeeLeaveDetails) => void;
  getLeaveApplicationDetailsFail: (error: string) => void;

  patchLeaveApplication: () => void;
  patchLeaveApplicationSuccess: (response: EmployeeLeaveDetails) => void;
  patchLeaveApplicationFail: (error: string) => void;

  setLeaveConfirmAction: (leaveConfirmAction: LeaveConfirmAction | null) => void;

  leaveCancellations: Array<LeaveCancellationDetails>;
  setLeaveCancellations: (leaveCancellations: Array<LeaveCancellationDetails>) => void;

  errorLeaveCancellations: string;
  setErrorLeaveCancellations: (errorLeaveCancellations: string) => void;

  approveLeaveCancellation: LeaveCancellation;
  setApproveLeaveCancellation: (approveLeaveCancellation: LeaveCancellation) => void;

  errorApproveLeaveCancellation: string;
  setErrorApproveLeaveCancellation: (errorApproveLeaveCancellation: string) => void;

  setLeaveCancellationConfirmAction: (leaveCancellationConfirmAction: LeaveConfirmAction | null) => void;

  getLeaveIndividualDetail: (loading: boolean) => void;
  getLeaveIndividualDetailSuccess: (loading: boolean, response) => void;
  getLeaveIndividualDetailFail: (loading: boolean, error: string) => void;
};

export const useLeaveApplicationStore = create<LeaveApplicationState>()(
  devtools((set) => ({
    leaveApplications: [],
    leaveApplication: { patchResponse: {} as EmployeeLeaveDetails },
    leaveApplicationDetails: {} as EmployeeLeaveDetails,
    leaveIndividualDetail: {} as EmployeeLeaveDetails,
    loading: {
      loadingLeaveApplications: false,
      loadingLeaveApplicationDetails: false,
      loadingPatchLeaveApplication: false,
    },
    error: {
      errorLeaveApplications: '',
      errorLeaveApplicationDetails: '',
      errorPatchLeaveApplication: '',
    },
    leaveConfirmAction: null,

    setLeaveConfirmAction: (leaveConfirmAction: LeaveConfirmAction | null) =>
      set((state) => ({ ...state, leaveConfirmAction })),

    emptyResponseAndErrors: () =>
      set((state) => ({
        ...state,
        error: {
          errorLeaveApplicationDetails: '',
          errorLeaveApplications: '',
          errorPatchLeaveApplication: '',
        },
        leaveApplication: { patchResponse: {} as EmployeeLeaveDetails },
      })),

    setLeaveApplicationDetails: (leaveApplicationDetails: EmployeeLeaveDetails) =>
      set((state) => ({ ...state, leaveApplicationDetails })),

    patchLeaveApplication: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPatchLeaveApplication: true },
        leaveApplication: { patchResponse: {} as EmployeeLeaveDetails },
        error: { ...state.error, errorPatchLeaveApplication: '' },
      })),

    patchLeaveApplicationSuccess: (response: EmployeeLeaveDetails) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPatchLeaveApplication: true },
        leaveApplication: { patchResponse: response },
      })),

    patchLeaveApplicationFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPatchLeaveApplication: true },
        error: { ...state.error, errorPatchLeaveApplication: error },
      })),

    getLeaveApplications: () =>
      set((state) => ({
        ...state,
        leaveApplications: [],
        loading: { ...state.loading, loadingLeaveApplications: true },
        error: { ...state.error, errorLeaveApplications: '' },
      })),

    getLeaveApplicationsSuccess: (response: Array<MonitoringLeave>) =>
      set((state) => ({
        ...state,
        leaveApplications: response,
        loading: { ...state.loading, loadingLeaveApplications: false },
      })),

    getLeaveApplicationsFail: (error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorLeaveApplications: error },
        loading: { ...state.loading, loadingLeaveApplications: false },
      })),

    getLeaveApplicationDetails: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveApplicationDetails: true },
        leaveApplicationDetails: {} as EmployeeLeaveDetails,
        error: { ...state.error, errorLeaveApplicationDetails: '' },
      })),

    getLeaveApplicationDetailsSuccess: (response: EmployeeLeaveDetails) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveApplicationDetails: false },
        leaveApplicationDetails: response,
      })),

    getLeaveApplicationDetailsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveApplicationDetails: false },
        error: { ...state.error, errorLeaveApplicationDetails: error },
      })),

    leaveCancellations: [],
    setLeaveCancellations: (leaveCancellations) => set({ leaveCancellations }),

    errorLeaveCancellations: '',
    setErrorLeaveCancellations: (errorLeaveCancellations) => set({ errorLeaveCancellations }),

    approveLeaveCancellation: {} as LeaveCancellation,
    setApproveLeaveCancellation: (approveLeaveCancellation) => set({ approveLeaveCancellation }),

    errorApproveLeaveCancellation: '',
    setErrorApproveLeaveCancellation: (errorApproveLeaveCancellation) => set({ errorApproveLeaveCancellation }),

    setLeaveCancellationConfirmAction: (leaveConfirmAction: LeaveConfirmAction | null) =>
      set((state) => ({ ...state, leaveConfirmAction })),

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
  }))
);
