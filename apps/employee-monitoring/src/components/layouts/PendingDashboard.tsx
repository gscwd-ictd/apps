import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { CardLeaveRequests } from '../cards/CardLeaveRequests';
import { CardOvertimeRequests } from '../cards/CardOvertimeRequests';
import { CardPassSlipRequests } from '../cards/CardPassSlipRequests';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';
import { useChartsStore } from '../../store/chart.store';

export const PendingDashboard = () => {
  // use swr pass slips
  const { data, isLoading, error } = useSWR('/stats/hrmo/dashboard', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 2) return;
    },
  });

  // Zustand init
  const { SetGetDashboardStats, ErrorDashboardStats, SetErrorDashboardStats } = useChartsStore((state) => ({
    GetDashboardStats: state.getDashboardStats,
    SetGetDashboardStats: state.setGetDashboardStats,
    ErrorDashboardStats: state.errorDashboardStats,
    SetErrorDashboardStats: state.setErrorDashboardStats,
  }));

  // get passlips success or fail
  useEffect(() => {
    // success
    if (!isEmpty(data)) SetGetDashboardStats(data.data);

    // fail
    if (!isEmpty(error)) SetErrorDashboardStats(error.message);
  }, [data, error]);

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorDashboardStats) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve data'} />
      ) : null}

      <div className="w-full grid-cols-3 gap-5 sm:flex sm:flex-col lg:flex lg:flex-row">
        {/**Card Leave Applications */}
        <div className="w-full h-[6rem] col-span-1">
          <CardLeaveRequests isLoading={isLoading} />
        </div>

        {/**Card Pending Overtime */}
        <div className="w-full h-[6rem] col-span-1">
          <CardOvertimeRequests isLoading={isLoading} />
        </div>

        {/**Card Pending Pass Slip */}
        <div className="w-full h-[6rem] col-span-1">
          <CardPassSlipRequests isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};
