import { AllOvertimeListTab } from './AllOvertimeListTab';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';

export const OvertimeTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, overtimeForApproval, overtimeCompleted } = useOvertimeStore((state) => ({
    tab: state.tab,
    overtimeForApproval: state.overtime.forApproval,
    overtimeCompleted: state.overtime.completed,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && <AllOvertimeListTab overtime={overtimeForApproval} tab={tab} />}
        {tab === 2 && <AllOvertimeListTab overtime={overtimeCompleted} tab={tab} />}
      </div>
    </>
  );
};
