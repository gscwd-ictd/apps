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
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
    cancelledLeaves,
  } = useApprovalStore((state) => ({
    forApprovalLeaves: state.leaves,
    approvedLeaves: state.leaves,
    disapprovedLeaves: state.leaves,
    cancelledLeaves: state.leaves,
  }));

  return (
    <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
      {tab === 1 ? (
        <AllApprovalsTab tab={tab} leaves={forApprovalLeaves} />
      ) : null}
      {tab === 2 ? (
        <AllApprovalsTab tab={tab} leaves={forApprovalLeaves} />
      ) : null}
    </div>
  );
};
