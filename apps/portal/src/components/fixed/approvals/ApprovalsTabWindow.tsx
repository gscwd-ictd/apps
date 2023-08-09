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
    forApprovalLeaves: state.leaves.forApproval,
    approvedLeaves: state.leaves.completed.approved,
    disapprovedLeaves: state.leaves.completed.disapproved,
    cancelledLeaves: state.leaves.completed.cancelled,
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

        {tab === 7 && selectedApprovalType === 4 && (
          <AllApprovalsTab
            passslips={cancelledPassSlips}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 8 && selectedApprovalType === 4 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={cancelledLeaves} />
        )}
      </div>
    </>
  );
};
