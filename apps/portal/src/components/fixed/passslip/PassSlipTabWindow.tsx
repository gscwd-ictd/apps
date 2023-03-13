import { useEffect } from 'react';
import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';

type PassSlipTabWindowProps = {
  employeeId: string;
};

export const PassSlipTabWindow = ({
  employeeId,
}: PassSlipTabWindowProps): JSX.Element => {
  //zustand initialization to access pass slip store
  const {
    tab,
    passSlips,
    loading,
    error,

    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,
  } = usePassSlipStore((state) => ({
    tab: state.tab,
    passSlips: state.passSlips,
    loading: state.loading.loadingPassSlips,
    error: state.error.errorPassSlips,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,
  }));

  const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/${employeeId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(passSlipUrl, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getPassSlipList(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    console.log(swrPassSlips);
    if (!isEmpty(swrPassSlips)) {
      getPassSlipListSuccess(swrIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrError)) {
      getPassSlipListFail(swrIsLoading, swrError.message);
    }
  }, [swrPassSlips, swrError]);

  return (
    <>
      {error ? (
        <ToastNotification toastType="error" notifMessage={error} />
      ) : null}

      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPassSlipListTab passslips={passSlips.onGoing} tab={tab} />
        )}
        {tab === 2 && (
          <AllPassSlipListTab passslips={passSlips.completed} tab={tab} />
        )}
      </div>
    </>
  );
};
