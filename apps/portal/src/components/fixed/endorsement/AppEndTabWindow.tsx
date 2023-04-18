/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationListTab } from './AllPublicationListTab';

export const AppEndTabWindow: FunctionComponent = () => {
  const pendingPublicationList = useAppEndStore(
    (state) => state.pendingPublicationList
  );

  const fulfilledPublicationList = useAppEndStore(
    (state) => state.fulfilledPublicationList
  );

  const tab = useAppEndStore((state) => state.tab);

  const { pendingIsLoading, fulfilledIsLoading } = useAppEndStore((state) => ({
    pendingIsLoading: state.publicationLoading.loadingPendingPublications,
    fulfilledIsLoading: state.publicationLoading.loadingFulfilledPublications,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {pendingIsLoading
          ? null
          : tab === 1 && (
              <AllPublicationListTab
                publications={pendingPublicationList}
                tab={tab}
              />
            )}
        {fulfilledIsLoading
          ? null
          : tab === 2 && (
              <AllPublicationListTab
                publications={fulfilledPublicationList}
                tab={tab}
              />
            )}
      </div>
    </>
  );
};
