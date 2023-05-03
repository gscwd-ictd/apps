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
    ongoingPassSlips,
    approvedPassSlips,
    disapprovedPassSlips,
    ongoingLeaves,
    approvedLeaves,
    disapprovedLeaves,
  } = useApprovalStore((state) => ({
    ongoingPassSlips: state.passSlips.onGoing,
    approvedPassSlips: state.passSlips.approved,
    disapprovedPassSlips: state.passSlips.disapproved,
    ongoingLeaves: state.leaves.onGoing,
    approvedLeaves: state.leaves.approved,
    disapprovedLeaves: state.leaves.disapproved,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={ongoingPassSlips} tab={tab} leaves={[]} />
        )}
        {tab === 2 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={ongoingLeaves} />
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
