/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { CardMiniStats } from './CardMiniStats';
import useSWR from 'swr';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { ToastNotification } from '@gscwd-apps/oneui';

export const CardLeaveRequests: FunctionComponent = () => {
  // leave count
  const [countHrmoApproval, setCountHrmoApproval] = useState<string>('--');

  // fetch data for list of leave applications
  const {
    data: swrLeaves,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR('/leave/hrmo', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 2) return;
    },
  });

  // Zustand initialization
  const {
    LeaveApplications,
    ErrorLeaveApplications,

    GetLeaveApplications,
    GetLeaveApplicationsSuccess,
    GetLeaveApplicationsFail,
  } = useLeaveApplicationStore((state) => ({
    LeaveApplications: state.leaveApplications,
    ErrorLeaveApplications: state.error.errorLeaveApplications,

    GetLeaveApplications: state.getLeaveApplications,
    GetLeaveApplicationsSuccess: state.getLeaveApplicationsSuccess,
    GetLeaveApplicationsFail: state.getLeaveApplicationsFail,
  }));

  // initialize loading
  useEffect(() => {
    if (swrIsLoading) GetLeaveApplications();
  }, [swrIsLoading]);

  // get passlips success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrLeaves)) GetLeaveApplicationsSuccess(swrLeaves.data);

    // fail
    if (!isEmpty(swrError)) GetLeaveApplicationsFail(swrError.message);
  }, [swrLeaves, swrError]);

  useEffect(() => {
    if (!isEmpty(LeaveApplications)) {
      const forApprovalPassSlipsCount = LeaveApplications.filter(
        (passSlip) => passSlip.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
      );
      setCountHrmoApproval(forApprovalPassSlipsCount.length.toString());
    }
  }, [LeaveApplications]);

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorLeaveApplications) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve data'} />
      ) : null}

      <CardMiniStats
        className="border rounded-md shadow hover:bg-slate-200 hover:cursor-pointer"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10 px-2 rounded-full bg-gradient-to-tl hover:bg-gradient-to-r from-sky-800/90 via-sky-500/90 to-sky-800/90 fill-white shrink-0"
          >
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
              clipRule="evenodd"
            />
          </svg>
        }
        title="Leave Application Pending Approval"
        value={!isEmpty(LeaveApplications) ? countHrmoApproval : 0}
        isLoading={swrIsLoading}
      />
    </>
  );
};
