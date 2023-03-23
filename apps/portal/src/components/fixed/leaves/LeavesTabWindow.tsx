import { AllLeavesListTab } from './AllLeavesListTab';
import { useLeaveStore } from '../../../../src/store/leave.store';

export const LeavesTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, leavesOnGoing, leavesCompleted } = useLeaveStore((state) => ({
    tab: state.tab,
    leavesOnGoing: state.leaves.onGoing,
    leavesCompleted: state.leaves.completed,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && <AllLeavesListTab leaves={leavesOnGoing} tab={tab} />}
        {tab === 2 && <AllLeavesListTab leaves={leavesCompleted} tab={tab} />}
      </div>
    </>
  );
};
