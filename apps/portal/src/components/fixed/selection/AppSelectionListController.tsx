import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import {
  fetchWithSession,
  fetchWithToken,
} from '../../../../src/utils/hoc/fetcher';
import { AppSelectionSelectPublication } from './AppSelectionSelectPublication';
import { AppSelectionSelectApplicants } from './AppSelectionSelectApplicants';
import {} from './AppSelectionSelectApplicants';
import { useAppSelectionStore } from '../../../store/selection.store';
import { SpinnerCircular, SpinnerDotted } from 'spinners-react';
import fetcherHRIS from '../../../../src/utils/helpers/fetchers/FetcherHRIS';
import { ToastNotification } from '@gscwd-apps/oneui';

type AppPlaceListControllerProps = {
  page: number;
};

export const AppSelectionModalController = ({
  page,
}: AppPlaceListControllerProps) => {
  const {
    loadingPublicationList,
    errorPublicationList,

    getPublicationList,
    getPublicationListSuccess,
    getPublicationListFail,
  } = useAppSelectionStore((state) => ({
    loadingPublicationList: state.loading.loadingPublicationList,
    errorPublicationList: state.errors.errorPublicationList,

    getPublicationList: state.getPublicationList,
    getPublicationListSuccess: state.getPublicationListSuccess,
    getPublicationListFail: state.getPublicationListFail,
  }));

  // const setFilteredPublicationList = useAppSelectionStore(
  //   (state) => state.setFilteredPublicationList
  // );

  // get api for the list of publications
  const publicationUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/publications`;

  // OLD use useSWR, provide the URL and fetchWithSession function as a parameter
  // const { data } = useSWR(publicationUrl, fetchWithSession);

  const {
    data: swrPublications,
    isLoading: swrPublicationIsLoading,
    error: swrPublicationError,
    mutate: mutatePublications,
  } = useSWR(publicationUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPublicationIsLoading) {
      getPublicationList(swrPublicationIsLoading);
    }
  }, [swrPublicationIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPublications)) {
      console.log(swrPublications);
      getPublicationListSuccess(swrPublicationIsLoading, swrPublications);
    }

    if (!isEmpty(swrPublicationError)) {
      getPublicationListFail(swrPublicationIsLoading, swrPublicationError);
    }
  }, [swrPublications, swrPublicationError]);

  return (
    <>
      {swrPublicationIsLoading ? (
        <div className="w-full static flex flex-col justify-items-center items-center place-items-center">
          <SpinnerDotted
            speed={70}
            thickness={70}
            className="w-full flex h-full transition-all "
            color="slateblue"
            size={100}
          />
        </div>
      ) : (
        <>
          {page === 1 && <AppSelectionSelectPublication />}
          {page === 2 && <AppSelectionSelectApplicants />}
        </>
      )}
    </>
  );
};
