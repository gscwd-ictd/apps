import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { createContext, useEffect } from 'react';
import useSWR from 'swr';

import { useDrStore } from '../../../store/dr.store';
import { useEmployeeStore } from '../../../store/employee.store';
import { Position } from '../../../types/position.type';
import { DRModalPosLoading } from './DRModalPosLoading';
import { DRModalSelect } from './DRModalSelect';
import { DRModalSelectPositions } from './DRModalSelectPositions';
import { DRModalSetting } from './DRModalSetting';
import { DRModalSummary } from './DRModalSummary';

type DRModalControllerProps = {
  action: string;
  page: number;
};

export const ModalInitialLoadState = createContext(false);

export const DRModalController = ({
  action,
  page,
}: DRModalControllerProps): JSX.Element => {
  const setAllPositions = useDrStore((state) => state.setAllPositions);

  const setFilteredPositions = useDrStore(
    (state) => state.setFilteredPositions
  );

  const allPositions = useDrStore((state) => state.allPositions);

  const selectedDRCType = useDrStore((state) => state.selectedDRCType);

  const employee = useEmployeeStore((state) => state.employeeDetails);

  // url for querying position details from HRIS
  const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}`;

  // query positions data from HRIS using access token
  const { data } = useSWR(`${prodUrl}`, fetchWithToken);

  // handle component mount
  useEffect(() => {
    if (data) {
      // copy positions from the query result
      const newPositions = [
        ...data.sort((a: Position, b: Position) =>
          a.positionTitle.localeCompare(b.positionTitle)
        ),
      ];

      setAllPositions(newPositions);

      setFilteredPositions(newPositions);
    }
  }, [data]);

  if (!data)
    return (
      <>
        <DRModalPosLoading />
      </>
    );

  return (
    <div className="max-h-[90%]">
      <>
        {page === 1 && <DRModalSelectPositions allPositions={allPositions} />}
        {page === 2 && <DRModalSetting />}
        {page === 3 && <DRModalSelect type={selectedDRCType} />}
        {page === 4 && <DRModalSummary />}
      </>
    </div>
  );
};
