/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';

export const DrcModalController = (): JSX.Element => {
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const modal = useModalStore((state) => state.modal);
  const {
    IsLoading,
    GetAllPositions,
    GetAllPositionsSuccess,
    GetAllPositionsFail,
  } = usePositionStore((state) => ({
    IsLoading: state.loading,
    GetAllPositions: state.getAllDrcPositions,
    GetAllPositionsSuccess: state.getAllDrcPositionsSuccess,
    GetAllPositionsFail: state.getAllDrcPositionsFail,
  }));
  const {
    data: swrPositions,
    error: swrError,
    isLoading: swrLoading,
    mutate: mutatePositions,
  } = useSWR(
    `occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  useEffect(() => {
    if (!isEmpty(swrPositions)) {
      console.log(swrPositions.data);

      // success
      GetAllPositionsSuccess(swrPositions.data);
    }

    if (!isEmpty(swrError)) {
      console.log(swrError);
      GetAllPositionsFail(swrError);
    }
  }, [swrPositions, swrError]);

  useEffect(() => {
    if (swrLoading) {
      GetAllPositions(true);
    }
  }, [swrLoading]);

  return (
    <>
      {modal.isOpen && modal.page === 1 && 'Open and Page is 1'}
      {modal.isOpen && modal.page === 2 && 'Open and Page is 2'}
    </>
  );
};
