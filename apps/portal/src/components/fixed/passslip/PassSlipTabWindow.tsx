import { useEffect } from 'react';
import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';

type PassSlipTabWindowProps = {
  employeeId: string;
};

export const PassSlipTabWindow = ({
  employeeId,
}: PassSlipTabWindowProps): JSX.Element => {
  const pendingPassSlips = [];

  const fulfilledPassSlips = [];

  const passSlipEmployeeId = usePassSlipStore(
    (state) => state.passSlipEmployeeId
  );

  const setPassSlipEmployeeId = usePassSlipStore(
    (state) => state.setPassSlipEmployeeId
  );

  const pendingPassSlipList = usePassSlipStore(
    (state) => state.pendingPassSlipList
  );

  const fulfilledPassSlipList = usePassSlipStore(
    (state) => state.fulfilledPassSlipList
  );

  const setPendingPassSlipList = usePassSlipStore(
    (state) => state.setPendingPassSlipList
  );

  const setFulfilledPassSlipList = usePassSlipStore(
    (state) => state.setFulfilledPassSlipList
  );

  const tab = usePassSlipStore((state) => state.tab);

  useEffect(() => {
    setPendingPassSlipList(pendingPassSlips);
    setFulfilledPassSlipList(fulfilledPassSlips);
    setPassSlipEmployeeId(employeeId);
  }, []);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPassSlipListTab passslips={pendingPassSlipList} tab={tab} />
        )}
        {tab === 2 && (
          <AllPassSlipListTab passslips={fulfilledPassSlipList} tab={tab} />
        )}
      </div>
    </>
  );
};
