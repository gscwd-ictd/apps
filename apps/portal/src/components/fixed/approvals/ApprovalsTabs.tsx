import { useApprovalStore } from '../../../../src/store/approvals.store';
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';

import { TabHeader } from '../tab/TabHeader';

type ApprovalsTabsProps = {
  tab: number;
};

export const ApprovalsTabs = ({ tab }: ApprovalsTabsProps) => {
  const setTab = useApprovalStore((state) => state.setTab);
  const pendingPassSlipList = useApprovalStore(
    (state) => state.pendingPassSlipList
  );
  const approvedPassSlipList = useApprovalStore(
    (state) => state.approvedPassSlipList
  );
  const disapprovedPassSlipList = useApprovalStore(
    (state) => state.disapprovedPassSlipList
  );
  const pendingLeaveList = useApprovalStore((state) => state.pendingLeaveList);
  const approvedLeaveList = useApprovalStore(
    (state) => state.approvedLeaveList
  );
  const disapprovedLeaveList = useApprovalStore(
    (state) => state.disapprovedLeaveList
  );

  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );

  return (
    <>
      <div className="w-full h-[44rem] px-5 overflow-y-auto">
        <ul className="flex flex-col text-gray-500">
          {selectedApprovalType === 1 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={1}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(1);
                }}
                title="Ongoing Pass Slip Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all ongoing Pass Slips you applied for"
                notificationCount={
                  pendingPassSlipList ? pendingPassSlipList.length : 0
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
                title="Ongoing Leave Approvals"
                icon={<HiOutlineCheckCircle size={26} />}
                subtitle="Show all ongoing Pass Slips you applied for"
                notificationCount={
                  pendingLeaveList ? pendingLeaveList.length : 0
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
                  approvedPassSlipList ? approvedPassSlipList.length : 0
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
                subtitle="Show all approved Pass Slip applications"
                notificationCount={
                  approvedLeaveList ? approvedLeaveList.length : 0
                }
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
                  disapprovedPassSlipList ? disapprovedPassSlipList.length : 0
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
                subtitle="Show all disapproved Pass Slip applications"
                notificationCount={
                  disapprovedLeaveList ? disapprovedLeaveList.length : 0
                }
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
