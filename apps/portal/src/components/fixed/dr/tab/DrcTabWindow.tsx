/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import { AllDrcPositionsListTab } from './AllDrcPositionsListTab';

type DrcTabWindowProps = {
  positionId: string;
};

export const DrcTabWindow = ({ positionId }: DrcTabWindowProps) => {
  const {
    data: swrUnfilledPositions,
    isLoading: swrUnfilledIsLoading,
    error: swrUnfilledError,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${positionId}/pending`,
    fetcherHRIS
  );

  const {
    data: swrFilledPositions,
    isLoading: swrFilledIsLoading,
    error: swrFilledError,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${positionId}/finished`,
    fetcherHRIS
  );

  // use position store
  const {
    filledPositions,
    unfilledPositions,
    getFilledDrcPositions,
    getFilledDrcPositionsFail,
    getFilledDrcPositionsSuccess,
    getUnfilledDrcPositions,
    getUnfilledDrcPositionsFail,
    getUnfilledDrcPositionsSuccess,
  } = usePositionStore((state) => ({
    unfilledPositions: state.unfilledPositions,
    filledPositions: state.filledPositions,
    getFilledDrcPositions: state.getFilledDrcPositions,
    getFilledDrcPositionsSuccess: state.getFilledDrcPositionsSuccess,
    getFilledDrcPositionsFail: state.getFilledDrcPositionsFail,
    getUnfilledDrcPositions: state.getUnfilledDrcPositions,
    getUnfilledDrcPositionsSuccess: state.getUnfilledDrcPositionsSuccess,
    getUnfilledDrcPositionsFail: state.getUnfilledDrcPositionsFail,
  }));

  // use modal store
  const tab = useModalStore((state) => state.modal.page);

  // initialize unfilled loading
  useEffect(() => {
    if (swrUnfilledIsLoading) {
      getUnfilledDrcPositions(swrUnfilledIsLoading);
    }
  }, [swrUnfilledIsLoading]);

  // initialize filled loading
  useEffect(() => {
    if (swrFilledIsLoading) {
      getFilledDrcPositions(swrFilledIsLoading);
    }
  }, [swrFilledIsLoading]);

  // unfilled positions set
  useEffect(() => {
    if (!isEmpty(swrUnfilledPositions)) {
      getUnfilledDrcPositionsSuccess(swrUnfilledPositions.data);
    }
    if (!isEmpty(swrUnfilledError)) {
      getUnfilledDrcPositionsFail(swrUnfilledError);
    }
  }, [swrUnfilledError, swrUnfilledPositions]);

  // filled positions set
  useEffect(() => {
    if (!isEmpty(swrFilledPositions)) {
      getFilledDrcPositionsSuccess(swrFilledPositions.data);
    }

    if (!isEmpty(swrFilledError)) {
      getFilledDrcPositionsFail(swrFilledError);
    }
  }, [swrFilledError, swrFilledPositions]);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllDrcPositionsListTab positions={unfilledPositions} tab={tab} />
        )}
        {tab === 2 && (
          <AllDrcPositionsListTab positions={filledPositions} tab={tab} />
        )}
      </div>
    </>
  );
};
