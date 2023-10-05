import { useApprovalStore } from '../../../../src/store/approvals.store';
import { AllApprovalsTab } from './AllApprovalsTab';

type ApprovalTabWindowProps = {
  employeeId: string;
};

export const ApprovalsTabWindow = ({ employeeId }: ApprovalTabWindowProps): JSX.Element => {
  //get initial values from store

  const tab = useApprovalStore((state) => state.tab);

  const selectedApprovalType = useApprovalStore((state) => state.selectedApprovalType);

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
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={forApprovalPassSlips} tab={tab} leaves={[]} overtime={[]} /> //show pass slip for approval list
        )}
        {tab === 2 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={forApprovalLeaves} overtime={[]} /> //show leaves for approval list
        )}
        {tab === 3 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={[]} overtime={forApprovalOvertime} /> //show overtime for approval list
        )}
        {tab === 4 && selectedApprovalType === 2 && (
          <AllApprovalsTab passslips={approvedPassSlips} tab={tab} leaves={[]} overtime={[]} /> //show pass slip approved list
        )}
        {tab === 5 && selectedApprovalType === 2 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={approvedLeaves} overtime={[]} /> //show leaves approved list
        )}
        {tab === 6 && selectedApprovalType === 2 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={[]} overtime={approvedOvertime} /> //show overtime approved list
        )}
        {tab === 7 && selectedApprovalType === 3 && (
          <AllApprovalsTab passslips={disapprovedPassSlips} tab={tab} leaves={[]} overtime={[]} /> //show pass slips disapproved list
        )}
        {tab === 8 && selectedApprovalType === 3 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={disapprovedLeaves} overtime={[]} /> //show leaves disapproved list
        )}
        {tab === 9 && selectedApprovalType === 3 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={[]} overtime={disapprovedOvertime} /> //show overtime disapproved list
        )}

        {tab === 10 && selectedApprovalType === 4 && (
          <AllApprovalsTab passslips={cancelledPassSlips} tab={tab} leaves={[]} overtime={[]} />
        )}
        {tab === 11 && selectedApprovalType === 4 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={cancelledLeaves} overtime={[]} />
        )}
      </div>
    </>
  );
};
