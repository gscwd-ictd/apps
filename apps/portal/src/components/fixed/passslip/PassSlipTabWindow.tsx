import { useEffect, useRef, useState } from 'react';
import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import { SelectedPassSlip } from '../../../../src/types/passslip.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

type PassSlipTabWindowProps = {
  employeeId: string;
  employeePassSlips: SelectedPassSlip;
};

export const PassSlipTabWindow = ({
  employeeId,
  employeePassSlips,
}: PassSlipTabWindowProps): JSX.Element => {
  // useEffect(() => {
  //   const pendingPassSlips = getPendingPassSlip(employeeId);
  // }, []);

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
    setPendingPassSlipList(employeePassSlips.ongoing);
    setFulfilledPassSlipList(employeePassSlips.completed);
    setPassSlipEmployeeId(employeeId);
  }, []);

  const [resetPassSlipList, setResetPassSlipList] = useState<boolean>(false);
  const passSlipList = usePassSlipStore((state) => state.passSlipList);
  const setPassSlipList = usePassSlipStore((state) => state.setPassSlipList);
  const passSlipUrl = `http://192.168.99.124:4104/api/v1/pass-slip/${employeeId}`;

  const random = useRef(Date.now());

  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const { data } = useSWR(passSlipUrl, fetchWithToken);

  useEffect(() => {
    if (!isEmpty(data)) {
      setPassSlipList(data);
    }
  }, [data, resetPassSlipList]);

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
