/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationListTab } from './AllSelectionPublicationListTab';

type AppSelectionTabWindowProps = {
  positionId: string;
};

export const AppSelectionTabWindow = ({
  positionId,
}: AppSelectionTabWindowProps) => {
  const { data: swrPendingPublications, isLoading: swrPendingIsLoading } =
    useSWR(
      `/applicant-endorsement/appointing-authority-selection/publications/pending`,
      fetcherHRIS,
      { shouldRetryOnError: false, revalidateOnFocus: false }
    );
  const { data: swrFulfilledPublications, isLoading: swrFulfilledIsLoading } =
    useSWR(
      `/applicant-endorsement/appointing-authority-selection/publications/selected`,
      fetcherHRIS,
      { shouldRetryOnError: false, revalidateOnFocus: false }
    );

  const pendingPublicationList = useAppSelectionStore(
    (state) => state.pendingPublicationList
  );

  const fulfilledPublicationList = useAppSelectionStore(
    (state) => state.fulfilledPublicationList
  );

  const setPendingPublicationList = useAppSelectionStore(
    (state) => state.setPendingPublicationList
  );

  const setFulfilledPublicationList = useAppSelectionStore(
    (state) => state.setFulfilledPublicationList
  );

  const tab = useAppSelectionStore((state) => state.tab);

  useEffect(() => {
    setPendingPublicationList(swrPendingPublications);
  }, [swrPendingPublications]);

  useEffect(() => {
    setFulfilledPublicationList(swrFulfilledPublications);
  }, [swrFulfilledPublications]);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 &&
          (swrPendingIsLoading ? null : (
            <AllSelectionPublicationListTab
              publications={swrPendingPublications.data}
              tab={tab}
            />
          ))}
        {tab === 2 &&
          (swrFulfilledIsLoading ? null : (
            <AllSelectionPublicationListTab
              publications={swrFulfilledPublications.data}
              tab={tab}
            />
          ))}
      </div>
    </>
  );
};
