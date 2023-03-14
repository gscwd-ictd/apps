/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
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

  const {
    allPositions,
    selectedDRCType,
    GetPositions,
    GetPositionsSucces,
    GetPositionsFail,
    EmptyResponse,
  } = useDrStore((state) => ({
    GetPositions: state.getPositions,
    GetPositionsSucces: state.getPositionsSuccess,
    GetPositionsFail: state.getPositionsFail,
    EmptyResponse: state.emptyResponse,
    IsLoading: state.loading.loadingPositions,
    Error: state.errorDrc.errorPositions,
    allPositions: state.allPositions,
    selectedDRCType: state.selectedDRCType,
  }));

  const employee = useEmployeeStore((state) => state.employeeDetails);

  // url for querying position details from HRIS
  const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}`;

  // query positions data from HRIS using access token
  const {
    data: swrPositions,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutatePositions,
  } = useSWR(
    `occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // initial zustand state update
  useEffect(() => {
    EmptyResponse();
    if (swrIsLoading) {
      GetPositions(swrIsLoading);
    }
  }, [swrIsLoading]);

  // handle component mount
  useEffect(() => {
    if (!isEmpty(swrPositions)) {
      // copy positions from the query result
      const newPositions = [
        ...swrPositions.data.sort((a: Position, b: Position) =>
          a.positionTitle.localeCompare(b.positionTitle)
        ),
      ];

      //* Recently Added
      GetPositionsSucces(swrIsLoading, newPositions);

      //! setAllPositions(newPositions);

      //! setFilteredPositions(newPositions);
    }

    if (!isEmpty(swrError)) {
      GetPositionsFail(swrIsLoading, swrError);
    }
  }, [swrPositions, swrError]);

  if (!swrPositions)
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
