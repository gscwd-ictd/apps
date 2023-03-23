import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';

export const PassSlipTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, passSlipsOnGoing, passSlipsCompleted } = usePassSlipStore(
    (state) => ({
      tab: state.tab,
      passSlipsOnGoing: state.passSlips.onGoing,
      passSlipsCompleted: state.passSlips.completed,
    })
  );

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPassSlipListTab passslips={passSlipsOnGoing} tab={tab} />
        )}
        {tab === 2 && (
          <AllPassSlipListTab passslips={passSlipsCompleted} tab={tab} />
        )}
      </div>
    </>
  );
};
