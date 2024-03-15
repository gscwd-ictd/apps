/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { usePassSlipStore } from '../../store/pass-slip.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { CardMiniStats } from './CardMiniStats';
import useSWR from 'swr';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { ToastNotification } from '@gscwd-apps/oneui';

export const CardPassSlipRequests: FunctionComponent = () => {
  // pass slip count
  const [countHrmoApproval, setCountHrmoApproval] = useState<string>('--');

  // use swr pass slips
  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/pass-slip', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 10 times.
      if (retryCount >= 5) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 15000);
    },
  });

  // Zustand init
  const { PassSlips, ErrorPassSlips, GetPassSlips, GetPassSlipsFail, GetPassSlipsSuccess } = usePassSlipStore(
    (state) => ({
      PassSlips: state.passSlips,
      GetPassSlips: state.getPassSlips,
      GetPassSlipsSuccess: state.getPassSlipsSuccess,
      GetPassSlipsFail: state.getPassSlipsFail,
      ErrorPassSlips: state.error.errorPassSlips,
    })
  );

  // initialize loading
  useEffect(() => {
    if (swrIsLoading) GetPassSlips();
  }, [swrIsLoading]);

  // get passlips success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrPassSlips)) GetPassSlipsSuccess(swrPassSlips.data);

    // fail
    if (!isEmpty(swrError)) GetPassSlipsFail(swrError.message);
  }, [swrPassSlips, swrError]);

  useEffect(() => {
    if (!isEmpty(PassSlips)) {
      const forApprovalPassSlipsCount = PassSlips.filter(
        (passSlip) => passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL
      );
      setCountHrmoApproval(forApprovalPassSlipsCount.length.toString());
    }
  }, [PassSlips]);

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorPassSlips) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve data'} />
      ) : null}

      <CardMiniStats
        className="border rounded-md shadow hover:bg-slate-200 hover:cursor-pointer"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10 px-2 rounded-full hover:bg-gradient-to-r bg-gradient-to-tl from-sky-800/90 via-sky-500/90 to-sky-800/90 fill-white shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
              clipRule="evenodd"
            />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        }
        title="Pass Slip Pending Approval"
        value={!isEmpty(PassSlips) ? countHrmoApproval : 0}
        isLoading={swrIsLoading}
      />
    </>
  );
};
