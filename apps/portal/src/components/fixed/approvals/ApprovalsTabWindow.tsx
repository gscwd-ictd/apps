import { useApprovalStore } from '../../../../src/store/approvals.store';
import { AllApprovalsTab } from './AllApprovalsTab';

type ApprovalTabWindowProps = {
  employeeId: string;
};

export const ApprovalsTabWindow = ({
  employeeId,
}: ApprovalTabWindowProps): JSX.Element => {
  //get initial values from store

  const tab = useApprovalStore((state) => state.tab);

  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );

  const {
    forApprovalPassSlips,
    approvedPassSlips,
    disapprovedPassSlips,
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
  } = useApprovalStore((state) => ({
    forApprovalPassSlips: state.passSlips.forApproval,
    approvedPassSlips: state.passSlips.completed.approved,
    disapprovedPassSlips: state.passSlips.completed.disapproved,
    forApprovalLeaves: state.leaves.forApproval,
    approvedLeaves: state.leaves.approved,
    disapprovedLeaves: state.leaves.disapproved,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && selectedApprovalType === 1 && (
          <AllApprovalsTab
            passslips={forApprovalPassSlips}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 2 && selectedApprovalType === 1 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={forApprovalLeaves}
          />
        )}
        {tab === 3 && selectedApprovalType === 2 && (
          <AllApprovalsTab
            passslips={approvedPassSlips}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 4 && selectedApprovalType === 2 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={approvedLeaves} />
        )}
        {tab === 5 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={disapprovedPassSlips}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 6 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={disapprovedLeaves}
          />
        )}
      </div>
    </>
  );
};
