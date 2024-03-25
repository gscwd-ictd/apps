/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { CardMiniStats } from './CardMiniStats';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';

export const CardOvertimeRequests: FunctionComponent = () => {
  // ot count
  const [countOtApplication, setCountOtApplication] = useState<string>('--');

  // fetch data for list of overtime applications
  const {
    data: swrOvertimeApplications,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/overtime', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 10 times.
      if (retryCount >= 5) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 15000);
    },
  });

  // Zustand initialization
  const {
    OvertimeApplications,
    SetOvertimeApplications,

    ErrorOvertimeApplications,
    SetErrorOvertimeApplications,
  } = useOvertimeStore((state) => ({
    OvertimeApplications: state.overtimeApplications,
    SetOvertimeApplications: state.setOvertimeApplications,

    ErrorOvertimeApplications: state.errorOvertimeApplications,
    SetErrorOvertimeApplications: state.setErrorOvertimeApplications,
  }));

  // Set store state of overtime
  useEffect(() => {
    if (!isEmpty(swrOvertimeApplications)) {
      SetOvertimeApplications(swrOvertimeApplications.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorOvertimeApplications(swrError.message);
    }
  }, [swrOvertimeApplications, swrError]);

  // Set count variable
  useEffect(() => {
    if (!isEmpty(OvertimeApplications)) {
      setCountOtApplication(OvertimeApplications.length.toString());
    }
  }, [OvertimeApplications]);

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorOvertimeApplications) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve data'} />
      ) : null}

      <CardMiniStats
        className="border rounded-md shadow hover:bg-slate-200 hover:cursor-pointer"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10 rounded-full fill-white hover:bg-gradient-to-r bg-gradient-to-tl from-sky-800/90 via-sky-500/90 to-sky-800/90 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
              clipRule="evenodd"
            />
          </svg>
        }
        title="Overtime Applications"
        value={!isEmpty(OvertimeApplications) ? countOtApplication : 0}
        isLoading={swrIsLoading}
      />
    </>
  );
};
