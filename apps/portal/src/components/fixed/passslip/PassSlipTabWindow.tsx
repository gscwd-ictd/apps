import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';

export const PassSlipTabWindow = (): JSX.Element => {
  //zustand initialization to access pass slip store
  const { tab, passSlips, loading, error } = usePassSlipStore((state) => ({
    tab: state.tab,
    passSlips: state.passSlips,
    loading: state.loading.loadingPassSlips,
    error: state.error.errorPassSlips,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPassSlipListTab passslips={passSlips.onGoing} tab={tab} />
        )}
        {tab === 2 && (
          <AllPassSlipListTab passslips={passSlips.completed} tab={tab} />
        )}
      </div>
    </>
  );
};
