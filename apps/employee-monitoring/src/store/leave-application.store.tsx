/* eslint-disable @nx/enforce-module-boundaries */
import {
  EmployeeLeaveDetails,
  MonitoringLeave,
} from '../../../../libs/utils/src/lib/types/leave-application.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';

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

type Data = {
  id: string;
  status: LeaveStatus;
  action?: 'approve' | 'disapprove' | null;
};

type LeaveApplicationState = {
  leaveApplication: ResponseLeaveApplication;
  leaveApplications: Array<MonitoringLeave>;
  leaveApplicationDetails: EmployeeLeaveDetails;
  loading: LoadingLeaveApplication;
  error: ErrorLeaveApplication;
  leaveDataForSubmission: Data;
  setLeaveApplicationDetails: (
    leaveApplicationDetails: EmployeeLeaveDetails
  ) => void;
  emptyResponseAndErrors: () => void;
  setLeaveDataForSubmission: (data: Data) => void;
  getLeaveApplications: () => void;
  getLeaveApplicationsSuccess: (response: Array<MonitoringLeave>) => void;
  getLeaveApplicationsFail: (error: string) => void;
  getLeaveApplicationDetails: () => void;
  getLeaveApplicationDetailsSuccess: (response: EmployeeLeaveDetails) => void;
  getLeaveApplicationDetailsFail: (error: string) => void;
  patchLeaveApplication: () => void;
  patchLeaveApplicationSuccess: (response: EmployeeLeaveDetails) => void;
  patchLeaveApplicationFail: (error: string) => void;
};

export const useLeaveApplicationStore = create<LeaveApplicationState>()(
  devtools((set) => ({
    leaveApplications: [],
    leaveApplication: { patchResponse: {} as EmployeeLeaveDetails },
    leaveApplicationDetails: {} as EmployeeLeaveDetails,
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
    leaveDataForSubmission: {} as Data,
    setLeaveDataForSubmission: (leaveDataForSubmission: Data) =>
      set((state) => ({ ...state, leaveDataForSubmission })),

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

    setLeaveApplicationDetails: (
      leaveApplicationDetails: EmployeeLeaveDetails
    ) => set((state) => ({ ...state, leaveApplicationDetails })),

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
  }))
);
