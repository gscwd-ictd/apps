import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationListTab } from './AllSelectionPublicationListTab';

type AppSelectionTabWindowProps = {
  positionId: string;
};

export const AppSelectionTabWindow = ({
  positionId,
}: AppSelectionTabWindowProps) => {
  const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/pending`;
  const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/selected`;
  const { data: pendingPublications } = useSWR(pendingUrl, fetchWithSession);
  const { data: fulfilledPublications } = useSWR(
    fulfilledUrl,
    fetchWithSession
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
    setPendingPublicationList(pendingPublications);
  }, [pendingPublications]);

  useEffect(() => {
    setFulfilledPublicationList(fulfilledPublications);
  }, [fulfilledPublications]);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllSelectionPublicationListTab
            publications={pendingPublicationList}
            tab={tab}
          />
        )}
        {tab === 2 && (
          <AllSelectionPublicationListTab
            publications={fulfilledPublicationList}
            tab={tab}
          />
        )}
      </div>
    </>
  );
};
