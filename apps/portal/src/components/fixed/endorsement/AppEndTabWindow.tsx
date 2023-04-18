/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationListTab } from './AllPublicationListTab';

type AppEndTabWindowProps = {
  employeeId: string;
};

export const AppEndTabWindow = ({
  employeeId,
}: AppEndTabWindowProps): JSX.Element => {
  const { data: pendingPublications } = useSWR(
    `applicant-endorsement/publications/${employeeId}/pending`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  const { data: fulfilledPublications } = useSWR(
    `/applicant-endorsement/publications/${employeeId}/selected`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  const pendingPublicationList = useAppEndStore(
    (state) => state.pendingPublicationList
  );

  const fulfilledPublicationList = useAppEndStore(
    (state) => state.fulfilledPublicationList
  );

  const setPendingPublicationList = useAppEndStore(
    (state) => state.setPendingPublicationList
  );

  const setFulfilledPublicationList = useAppEndStore(
    (state) => state.setFulfilledPublicationList
  );

  const tab = useAppEndStore((state) => state.tab);

  useEffect(() => {
    if (!isEmpty(pendingPublications))
      //! changed from pendingPublicationList
      setPendingPublicationList(pendingPublications.data);
  }, [pendingPublications]);

  useEffect(() => {
    if (!isEmpty(fulfilledPublications))
      //! changed from fulfilledPublicationList
      setFulfilledPublicationList(fulfilledPublications.data);
  }, [fulfilledPublications]);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPublicationListTab
            publications={pendingPublicationList}
            tab={tab}
          />
        )}
        {tab === 2 && (
          <AllPublicationListTab
            publications={fulfilledPublicationList}
            tab={tab}
          />
        )}
      </div>
    </>
  );
};
