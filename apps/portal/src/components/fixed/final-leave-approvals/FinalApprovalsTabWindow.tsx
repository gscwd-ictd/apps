import { useFinalLeaveApprovalStore } from '../../../store/final-leave-approvals.store';
import { FinalAllApprovalsTab } from './FinalAllApprovalsTab';

type ApprovalTabWindowProps = {
  employeeId: string;
};

export const FinalApprovalsTabWindow = ({
  employeeId,
}: ApprovalTabWindowProps): JSX.Element => {
  //get initial values from store

  const {
    forApprovalLeaves,
    approvedLeaves,
    disapprovedLeaves,
    cancelledLeaves,
    tab,
  } = useFinalLeaveApprovalStore((state) => ({
    forApprovalLeaves: state.leaves.forApproval,
    approvedLeaves: state.leaves.completed.approved,
    disapprovedLeaves: state.leaves.completed.disapproved,
    cancelledLeaves: state.leaves.completed.cancelled,
    tab: state.tab,
  }));

  return (
    <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
      {tab === 1 ? (
        <FinalAllApprovalsTab tab={tab} leaves={forApprovalLeaves} />
      ) : null}
      {tab === 2 ? (
        <FinalAllApprovalsTab tab={tab} leaves={approvedLeaves} />
      ) : null}
      {tab === 3 ? (
        <FinalAllApprovalsTab tab={tab} leaves={disapprovedLeaves} />
      ) : null}
      {tab === 4 ? (
        <FinalAllApprovalsTab tab={tab} leaves={cancelledLeaves} />
      ) : null}
    </div>
  );
};
