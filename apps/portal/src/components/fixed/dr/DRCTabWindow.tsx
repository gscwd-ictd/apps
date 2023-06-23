import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useEffect } from 'react';
import useSWR from 'swr';
// import { getUserDetails, withSession } from "../../../../utils/helpers/session";

import { useDrStore } from '../../../store/dr.store';
import { useEmployeeStore } from '../../../store/employee.store';
import { Button } from '../../modular/common/forms/Button';
import { AllDrcPositionsListTab } from './AllDrcPositionsListTab';

type DrcTabWindowProps = {
  positionId: string;
};

export const DrcTabWindow = ({ positionId }: DrcTabWindowProps) => {
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${positionId}/pending`;
  const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${positionId}/finished`;

  const { data: pendingPositionList } = useSWR(pendingUrl, fetchWithSession);

  const { data: fulfilledPositionList } = useSWR(
    fulfilledUrl,
    fetchWithSession
  );

  const pendingPositions = useDrStore((state) => state.pendingPositions);

  const fulfilledPositions = useDrStore((state) => state.fulfilledPositions);

  const setPendingPositions = useDrStore((state) => state.setPendingPositions);

  const setFulfilledPositions = useDrStore(
    (state) => state.setFulfilledPositions
  );

  const tab = useDrStore((state) => state.tab);

  useEffect(
    () => setPendingPositions(pendingPositionList),
    [pendingPositionList]
  );
  useEffect(
    () => setFulfilledPositions(fulfilledPositionList),
    [fulfilledPositionList]
  );
  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllDrcPositionsListTab positions={pendingPositions} tab={tab} />
        )}
        {tab === 2 && (
          <AllDrcPositionsListTab positions={fulfilledPositions} tab={tab} />
        )}
      </div>
    </>
  );
};
