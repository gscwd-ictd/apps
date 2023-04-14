import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import { AllApprovalsTab } from './AllApprovalsTab';

type ApprovalTabWindowProps = {
  employeeId: string;
};

export const ApprovalsTabWindow = ({
  employeeId,
}: ApprovalTabWindowProps): JSX.Element => {
  //get initial values from store
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

  const setPendingPassSlipList = useApprovalStore(
    (state) => state.setPendingPassSlipList
  );
  const setApprovedPassSlipList = useApprovalStore(
    (state) => state.setApprovedPassSlipList
  );
  const setDisapprovedPassSlipList = useApprovalStore(
    (state) => state.setDisapprovedPassSlipList
  );
  const setPendingLeaveList = useApprovalStore(
    (state) => state.setPendingLeaveList
  );
  const setApprovedLeaveList = useApprovalStore(
    (state) => state.setApprovedLeaveList
  );
  const setDisapprovedLeaveList = useApprovalStore(
    (state) => state.setDisapprovedLeaveList
  );

  const tab = useApprovalStore((state) => state.tab);

  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );
  const setSelectedApprovalType = useApprovalStore(
    (state) => state.setSelectedApprovalType
  );

  useEffect(() => {
    // setPendingPassSlipList(pendingPassSlipsApprovals);
    // setApprovedPassSlipList(approvedPassSlipsApprovals);
    // setDisapprovedPassSlipList(diapprovedPassSlipsApprovals);
    // setPendingLeaveList(pendingLeaveApprovals);
    // setApprovedLeaveList(approvedLeaveApprovals);
    // setDisapprovedLeaveList(disapprovedLeaveApprovals);
  }, []);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && selectedApprovalType === 1 && (
          <AllApprovalsTab
            passslips={pendingPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 2 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={pendingLeaveList} />
        )}
        {tab === 3 && selectedApprovalType === 2 && (
          <AllApprovalsTab
            passslips={approvedPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 4 && selectedApprovalType === 2 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={approvedLeaveList}
          />
        )}
        {tab === 5 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={disapprovedPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 6 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={disapprovedLeaveList}
          />
        )}
      </div>
    </>
  );
};
