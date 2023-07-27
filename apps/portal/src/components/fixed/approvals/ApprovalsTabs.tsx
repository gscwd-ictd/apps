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
                  // setIsLoading(true);
                  setTab(1);
                }}
                title="Pass Slip Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all Pass Slips that require your approval"
                notificationCount={
                  forApprovalPassSlips ? forApprovalPassSlips.length : 0
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
                title="Leave Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all Leaves that require your approval"
                notificationCount={
                  forApprovalLeaves ? forApprovalLeaves.length : 0
                }
                className="bg-indigo-500"
              />
            </>
          )}
          {selectedApprovalType === 2 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={3}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(3);
                }}
                title="Approved Pass Slips"
                icon={<HiCheck size={26} />}
                subtitle="Show all approved Pass Slip applications"
                notificationCount={
                  approvedPassSlips ? approvedPassSlips.length : 0
                }
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={4}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(4);
                }}
                title="Approved Leaves"
                icon={<HiCheck size={26} />}
                subtitle="Show all approved Leave applications"
                notificationCount={approvedLeaves ? approvedLeaves.length : 0}
                className="bg-gray-500"
              />
            </>
          )}

          {selectedApprovalType === 3 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={5}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(5);
                }}
                title="Disapproved Pass Slips"
                icon={<HiCheck size={26} />}
                subtitle="Show all disapproved Pass Slip applications"
                notificationCount={
                  disapprovedPassSlips ? disapprovedPassSlips.length : 0
                }
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={6}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(6);
                }}
                title="Disapproved Leaves"
                icon={<HiCheck size={26} />}
                subtitle="Show all disapproved Leave applications"
                notificationCount={
                  disapprovedLeaves ? disapprovedLeaves.length : 0
                }
                className="bg-gray-500"
              />
            </>
          )}

          {selectedApprovalType === 4 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={7}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(7);
                }}
                title="Cancelled Pass Slips"
                icon={<HiCheck size={26} />}
                subtitle="Show all cancelled Pass Slip applications"
                notificationCount={
                  cancelledPassSlips ? cancelledPassSlips.length : 0
                }
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={8}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(8);
                }}
                title="Cancelled Leaves"
                icon={<HiCheck size={26} />}
                subtitle="Show all cancelled Leave applications"
                notificationCount={cancelledLeaves ? cancelledLeaves.length : 0}
                className="bg-gray-500"
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
