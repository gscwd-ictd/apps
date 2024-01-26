import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';

export const PassSlipTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, passSlipsforApproval, passSlipsCompleted } = usePassSlipStore((state) => ({
    tab: state.tab,
    passSlipsforApproval: state.passSlips.forApproval,
    passSlipsCompleted: state.passSlips.completed,
  }));

  return (
    <>
      <div className={`w-full bg-inherit rounded px-5 h-[30rem] overflow-y-auto`}>
        {tab === 1 && <AllPassSlipListTab passslips={passSlipsforApproval} tab={tab} />}
        {tab === 2 && <AllPassSlipListTab passslips={passSlipsCompleted} tab={tab} />}
      </div>
    </>
  );
};
