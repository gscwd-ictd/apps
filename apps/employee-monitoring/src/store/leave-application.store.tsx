import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MonitoringLeave } from '../../../../libs/utils/src/lib/types/leave-application.type';

type LoadingLeaveApplication = {
  loadingLeaveApplications: boolean;
};

type ErrorLeaveApplication = {
  errorLeaveApplications: string;
};

type LeaveApplicationState = {
  leaveApplications: Array<MonitoringLeave>;
  loading: LoadingLeaveApplication;
  error: ErrorLeaveApplication;

  getLeaveApplications: (loading: boolean) => void;
  getLeaveApplicationsSuccess: (
    loading: boolean,
    response: Array<MonitoringLeave>
  ) => void;
  getLeaveApplicationsFail: (loading: boolean, error: string) => void;
};

export const useLeaveApplicationStore = create<LeaveApplicationState>()(
  devtools((set) => ({
    leaveApplications: [],
    loading: {
      loadingLeaveApplications: false,
    },
    error: {
      errorLeaveApplications: '',
    },

    getLeaveApplications: (loading: boolean) =>
      set((state) => ({
        ...state,
        leaveApplications: [],
        loading: { ...state.loading, loadingLeaveApplications: loading },
        error: { ...state.error, errorLeaveApplications: '' },
      })),

    getLeaveApplicationsSuccess: (
      loading: boolean,
      response: Array<MonitoringLeave>
    ) =>
      set((state) => ({
        ...state,
        leaveApplications: response,
        loading: { ...state.loading, loadingLeaveApplications: loading },
      })),

    getLeaveApplicationsFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        error: { ...state.error, errorLeaveApplications: error },
        loading: { ...state.loading, loadingLeaveApplications: loading },
      })),
  }))
);
