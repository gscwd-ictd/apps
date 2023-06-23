/* eslint-disable @nx/enforce-module-boundaries */

import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationListTab } from './AllSelectionPublicationListTab';

type AppSelectionTabWindowProps = {
  positionId: string;
};

export const AppSelectionTabWindow = ({
  positionId,
}: AppSelectionTabWindowProps) => {
  const {
    pendingPublicationList,
    fulfilledPublicationList,

    loadingPendingPublicationList,
    loadingFulfilledPublicationList,
    tab,
  } = useAppSelectionStore((state) => ({
    pendingPublicationList: state.pendingPublicationList,
    fulfilledPublicationList: state.fulfilledPublicationList,

    loadingPendingPublicationList: state.loading.loadingPendingPublicationList,
    loadingFulfilledPublicationList:
      state.loading.loadingFulfilledPublicationList,
    tab: state.tab,
  }));

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 &&
          (loadingPendingPublicationList ? null : (
            <AllSelectionPublicationListTab
              publications={pendingPublicationList}
              tab={tab}
            />
          ))}
        {tab === 2 &&
          (loadingFulfilledPublicationList ? null : (
            <AllSelectionPublicationListTab
              publications={fulfilledPublicationList}
              tab={tab}
            />
          ))}
      </div>
    </>
  );
};
