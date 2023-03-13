import { useEffect } from 'react';
import { AllLeavesListTab } from './AllLeavesListTab';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';

type LeavesTabWindowProps = {
  employeeId: string;
};

export const LeavesTabWindow = ({
  employeeId,
}: LeavesTabWindowProps): JSX.Element => {
  //zustand initialization to access pass slip store
  const {
    tab,
    leaves,
    loading,
    error,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
  } = useLeaveStore((state) => ({
    tab: state.tab,
    leaves: state.leaves,
    loading: state.loading.loadingLeaves,
    error: state.error.errorLeaves,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
  }));

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/${employeeId}`;

  const {
    data: swrLeaves,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(leaveUrl, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveList(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    console.log(swrLeaves);
    if (!isEmpty(swrLeaves)) {
      getLeaveListSuccess(swrIsLoading, swrLeaves);
    }

    if (!isEmpty(swrError)) {
      getLeaveListFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaves, swrError]);

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
