import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { AllOvertimeAccomplishmentListTab } from './AllOvertimeAccomplishmentListTab';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';

export const OvertimeAccomplishmentTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, overtimeForApproval, overtimeCompleted } = useOvertimeAccomplishmentStore((state) => ({
    tab: state.tab,
    overtimeForApproval: state.overtime.forApproval,
    overtimeCompleted: state.overtime.completed,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && <AllOvertimeAccomplishmentListTab overtime={overtimeForApproval} tab={tab} />}
        {tab === 2 && <AllOvertimeAccomplishmentListTab overtime={overtimeCompleted} tab={tab} />}
      </div>
    </>
  );
};
