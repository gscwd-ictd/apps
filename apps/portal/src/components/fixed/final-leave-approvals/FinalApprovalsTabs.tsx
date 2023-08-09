import { useApprovalStore } from '../../../../src/store/approvals.store';
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';

import { TabHeader } from '../tab/TabHeader';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';

type ApprovalsTabsProps = {
  tab: number;
};

export const FinalApprovalsTabs = ({ tab }: ApprovalsTabsProps) => {
  const {
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
    cancelledLeaves,
    setTab,
  } = useFinalLeaveApprovalStore((state) => ({
    forApprovalLeaves: state.leaves.forApproval,
    approvedLeaves: state.leaves.completed.approved,
    disapprovedLeaves: state.leaves.completed.disapproved,
    cancelledLeaves: state.leaves.completed.cancelled,
    setTab: state.setTab,
  }));

  return (
    <>
      <div className="lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto">
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="Final Leave Approvals"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all Leaves that require your approval"
            notificationCount={forApprovalLeaves ? forApprovalLeaves.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              // setIsLoading(true);
              setTab(2);
            }}
            title="Approved Leave Approvals"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all Completed Leaves"
            notificationCount={approvedLeaves ? approvedLeaves.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={3}
            onClick={() => {
              // setIsLoading(true);
              setTab(3);
            }}
            title="Disapproved Leave Approvals"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all Completed Leaves"
            notificationCount={disapprovedLeaves ? disapprovedLeaves.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={4}
            onClick={() => {
              // setIsLoading(true);
              setTab(4);
            }}
            title="Cancelled Leave Approvals"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all Completed Leaves"
            notificationCount={cancelledLeaves ? cancelledLeaves.length : 0}
            className="bg-indigo-500"
          />
        </ul>
      </div>
    </>
  );
};

{
  /* <div className="flex justify-center pt-20"><h1 className="text-4xl text-gray-300">No pending endorsement list at the moment</h1></div> */
}
