import { useEffect } from 'react';
import { AllLeavesListTab } from './AllLeavesListTab';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';

export const LeavesTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, leaves, loading, error } = useLeaveStore((state) => ({
    tab: state.tab,
    leaves: state.leaves,
    loading: state.loading.loadingLeaves,
    error: state.error.errorLeaves,
  }));

  return (
    <>
      {error ? (
        <ToastNotification toastType="error" notifMessage={error} />
      ) : null}

      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && <AllLeavesListTab leaves={leaves.onGoing} tab={tab} />}
        {tab === 2 && <AllLeavesListTab leaves={leaves.completed} tab={tab} />}
      </div>
    </>
  );
};
