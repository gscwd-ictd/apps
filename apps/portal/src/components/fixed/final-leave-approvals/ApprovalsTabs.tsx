import { useApprovalStore } from '../../../../src/store/approvals.store';
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';

import { TabHeader } from '../tab/TabHeader';

type ApprovalsTabsProps = {
  tab: number;
};

export const ApprovalsTabs = ({ tab }: ApprovalsTabsProps) => {
  const setTab = useApprovalStore((state) => state.setTab);

  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );

  const {
    forApprovalPassSlips,
    approvedPassSlips,
    disapprovedPassSlips,
    cancelledPassSlips,
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
    cancelledLeaves,
  } = useApprovalStore((state) => ({
    forApprovalPassSlips: state.passSlips.forApproval,
    approvedPassSlips: state.passSlips.completed.approved,
    disapprovedPassSlips: state.passSlips.completed.disapproved,
    cancelledPassSlips: state.passSlips.completed.cancelled,
    forApprovalLeaves: state.leaves,
    approvedLeaves: state.leaves,
    disapprovedLeaves: state.leaves,
    cancelledLeaves: state.leaves,
  }));

  return (
    <>
      <div className="lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto">
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          {selectedApprovalType === 1 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={1}
                onClick={() => {
                  setTab(1);
                }}
                title="Final Leave Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all Leaves that require your approval"
                notificationCount={
                  forApprovalLeaves ? forApprovalLeaves.length : 0
                }
                className="bg-indigo-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={2}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(2);
                }}
                title="Completed Leave Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all Completed Leaves"
                notificationCount={
                  forApprovalLeaves ? forApprovalLeaves.length : 0
                }
                className="bg-indigo-500"
              />
            </>
          )}
        </ul>
      </div>
    </>
  );
};

{
  /* <div className="flex justify-center pt-20"><h1 className="text-4xl text-gray-300">No pending endorsement list at the moment</h1></div> */
}
