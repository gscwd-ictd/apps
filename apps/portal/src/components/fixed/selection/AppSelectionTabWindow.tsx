import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationListTab } from './AllSelectionPublicationListTab';
import fetcherHRIS from '../../../../src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';

type AppSelectionTabWindowProps = {
  positionId: string;
};

export const AppSelectionTabWindow = ({
  positionId,
}: AppSelectionTabWindowProps) => {
  const {
    loadingPendingPublicationList,
    loadingFulfilledPublicationList,
    errorPendingPublicationList,
    errorFulfilledPublicationList,

    getPendingPublicationList,
    getPendingPublicationListSuccess,
    getPendingPublicationListFail,

    getFulfilledPublicationList,
    getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail,
  } = useAppSelectionStore((state) => ({
    loadingPendingPublicationList: state.loading.loadingPendingPublicationList,
    loadingFulfilledPublicationList:
      state.loading.loadingFulfilledPublicationList,
    errorPendingPublicationList: state.errors.errorPendingPublicationList,
    errorFulfilledPublicationList: state.errors.errorFulfilledPublicationList,

    getPendingPublicationList: state.getPendingPublicationList,
    getPendingPublicationListSuccess: state.getPendingPublicationListSuccess,
    getPendingPublicationListFail: state.getPendingPublicationListFail,

    getFulfilledPublicationList: state.getFulfilledPublicationList,
    getFulfilledPublicationListSuccess:
      state.getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail: state.getFulfilledPublicationListFail,
  }));

  // const pendingUrl = `/applicant-endorsement/appointing-authority-selection/pending`;
  // const fulfilledUrl = `/applicant-endorsement/appointing-authority-selection/selected`;

  // //PENDING SELECTION
  // const {
  //   data: swrPendingPublications,
  //   isLoading: swrPendingPublicationIsLoading,
  //   error: swrPendingPublicationError,
  //   mutate: mutatePendingPublications,
  // } = useSWR(pendingUrl, fetcherHRIS, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrPendingPublicationIsLoading) {
  //     getPendingPublicationList(swrPendingPublicationIsLoading);
  //   }
  // }, [swrPendingPublicationIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrPendingPublications)) {
  //     getPendingPublicationListSuccess(
  //       swrPendingPublicationIsLoading,
  //       swrPendingPublications.data
  //     );
  //   }

  //   if (!isEmpty(swrPendingPublicationError)) {
  //     getPendingPublicationListFail(
  //       swrPendingPublicationIsLoading,
  //       swrPendingPublicationError.message
  //     );
  //   }
  // }, [swrPendingPublications, swrPendingPublicationError]);

  // //FULFILLED SELECTION
  // const {
  //   data: swrFulfilledPublications,
  //   isLoading: swrFulfilledPublicationIsLoading,
  //   error: swrFulfilledPublicationError,
  //   mutate: mutateFulfilledPublications,
  // } = useSWR(fulfilledUrl, fetcherHRIS, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrFulfilledPublicationIsLoading) {
  //     getFulfilledPublicationList(swrFulfilledPublicationIsLoading);
  //   }
  // }, [swrFulfilledPublicationIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrFulfilledPublications)) {
  //     getFulfilledPublicationListSuccess(
  //       swrFulfilledPublicationIsLoading,
  //       swrFulfilledPublications.data
  //     );
  //   }

  //   if (!isEmpty(swrFulfilledPublicationError)) {
  //     getFulfilledPublicationListFail(
  //       swrFulfilledPublicationIsLoading,
  //       swrFulfilledPublicationError.message
  //     );
  //   }
  // }, [swrFulfilledPublications, swrFulfilledPublicationError]);

  // const { data: pendingPublications } = useSWR(pendingUrl, fetchWithSession);
  // const { data: fulfilledPublications } = useSWR(
  //   fulfilledUrl,
  //   fetchWithSession
  // );

  const pendingPublicationList = useAppSelectionStore(
    (state) => state.pendingPublicationList
  );

  const fulfilledPublicationList = useAppSelectionStore(
    (state) => state.fulfilledPublicationList
  );

  // const setPendingPublicationList = useAppSelectionStore(
  //   (state) => state.setPendingPublicationList
  // );

  // const setFulfilledPublicationList = useAppSelectionStore(
  //   (state) => state.setFulfilledPublicationList
  // );

  const tab = useAppSelectionStore((state) => state.tab);

  // useEffect(() => {
  //   // console.log(pendingPublications, 'pending');
  //   setPendingPublicationList(pendingPublications);
  // }, [pendingPublications]);

  // useEffect(() => {
  //   // console.log(fulfilledPublications, 'fulfilled');
  //   setFulfilledPublicationList(fulfilledPublications);
  // }, [fulfilledPublications]);

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
