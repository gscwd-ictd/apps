import { useApprovalStore } from '../../../store/approvals.store';
import { HiOutlineCheckCircle, HiCheck, HiX, HiCheckCircle, HiXCircle, HiQuestionMarkCircle } from 'react-icons/hi';

import { TabHeader } from '../tab/TabHeader';
import { ApprovalTypeSelect } from './ApprovalTypeSelect';
import { useEffect } from 'react';

type ApprovalsTabsProps = {
  tab: number;
};

export const ApprovalsTabs = ({ tab }: ApprovalsTabsProps) => {
  const {
    forApprovalPassSlips,
    approvedPassSlips,
    disapprovedPassSlips,
    cancelledPassSlips,
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
    cancelledLeaves,
    forApprovalOvertime,
    approvedOvertime,
    disapprovedOvertime,
    selectedApprovalType,
    setTab,
    setSelectedApprovalType,
  } = useApprovalStore((state) => ({
    forApprovalPassSlips: state.passSlips.forApproval,
    approvedPassSlips: state.passSlips.completed.approved,
    disapprovedPassSlips: state.passSlips.completed.disapproved,
    cancelledPassSlips: state.passSlips.completed.cancelled,
    forApprovalLeaves: state.leaves.forApproval,
    approvedLeaves: state.leaves.completed.approved,
    disapprovedLeaves: state.leaves.completed.disapproved,
    cancelledLeaves: state.leaves.completed.cancelled,
    forApprovalOvertime: state.overtime.forApproval,
    approvedOvertime: state.overtime.completed.approved,
    disapprovedOvertime: state.overtime.completed.disapproved,
    selectedApprovalType: state.selectedApprovalType,
    setTab: state.setTab,
    setSelectedApprovalType: state.setSelectedApprovalType,
  }));

  //defaults page to For Approval filter on load
  useEffect(() => {
    setSelectedApprovalType(1);
    setTab(1);
  }, []);

  return (
    <>
      <div className="lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto">
        <ApprovalTypeSelect />
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          {selectedApprovalType === 1 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={1}
                onClick={() => {
                  setTab(1);
                }}
                title="Pass Slip Approvals"
                icon={<HiQuestionMarkCircle size={26} />}
                subtitle="Show all Pass Slips that require your approval"
                notificationCount={forApprovalPassSlips ? forApprovalPassSlips.length : 0}
                className="bg-indigo-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={2}
                onClick={() => {
                  setTab(2);
                }}
                title="Leave Approvals"
                icon={<HiQuestionMarkCircle size={26} />}
                subtitle="Show all Leaves that require your approval"
                notificationCount={forApprovalLeaves ? forApprovalLeaves.length : 0}
                className="bg-indigo-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={3}
                onClick={() => {
                  setTab(3);
                }}
                title="Overtime Approvals"
                icon={<HiQuestionMarkCircle size={26} />}
                subtitle="Show all Overtime that require your approval"
                notificationCount={forApprovalOvertime ? forApprovalOvertime.length : 0}
                className="bg-indigo-500"
              />
            </>
          )}
          {selectedApprovalType === 2 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={4}
                onClick={() => {
                  setTab(4);
                }}
                title="Approved Pass Slips"
                icon={<HiCheckCircle size={26} />}
                subtitle="Show all approved Pass Slip applications"
                notificationCount={approvedPassSlips ? approvedPassSlips.length : 0}
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={5}
                onClick={() => {
                  // setIsLoading(true);
                  setTab(5);
                }}
                title="Approved Leaves"
                icon={<HiCheckCircle size={26} />}
                subtitle="Show all approved Leave applications"
                notificationCount={approvedLeaves ? approvedLeaves.length : 0}
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={6}
                onClick={() => {
                  setTab(6);
                }}
                title="Approved Overtime"
                icon={<HiCheckCircle size={26} />}
                subtitle="Show all approved Overtime applications"
                notificationCount={approvedOvertime ? approvedOvertime.length : 0}
                className="bg-gray-500"
              />
            </>
          )}

          {selectedApprovalType === 3 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={7}
                onClick={() => {
                  setTab(7);
                }}
                title="Disapproved Pass Slips"
                icon={<HiXCircle size={26} />}
                subtitle="Show all disapproved Pass Slip applications"
                notificationCount={disapprovedPassSlips ? disapprovedPassSlips.length : 0}
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={8}
                onClick={() => {
                  setTab(8);
                }}
                title="Disapproved Leaves"
                icon={<HiXCircle size={26} />}
                subtitle="Show all disapproved Leave applications"
                notificationCount={disapprovedLeaves ? disapprovedLeaves.length : 0}
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={9}
                onClick={() => {
                  setTab(9);
                }}
                title="Disapproved Overtime"
                icon={<HiXCircle size={26} />}
                subtitle="Show all disapproved Overtime applications"
                notificationCount={disapprovedOvertime ? disapprovedOvertime.length : 0}
                className="bg-gray-500"
              />
            </>
          )}

          {selectedApprovalType === 4 && (
            <>
              <TabHeader
                tab={tab}
                tabIndex={10}
                onClick={() => {
                  setTab(10);
                }}
                title="Cancelled Pass Slips"
                icon={<HiXCircle size={26} />}
                subtitle="Show all cancelled Pass Slip applications"
                notificationCount={cancelledPassSlips ? cancelledPassSlips.length : 0}
                className="bg-gray-500"
              />
              <TabHeader
                tab={tab}
                tabIndex={11}
                onClick={() => {
                  setTab(11);
                }}
                title="Cancelled Leaves"
                icon={<HiXCircle size={26} />}
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
