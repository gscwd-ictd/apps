/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { use, useEffect } from 'react';
import useSWR from 'swr';
import { useEmployeeStore } from '../../../store/employee.store';
import { useAppEndStore } from '../../../store/endorsement.store';
import LoadingVisual from '../loading/LoadingVisual';
import { AppEndSelectPublication } from './AppEndModalSelectPublication';
import { AppEndSelectApplicants } from './AppEndSelectApplicants';
import { AppEndSummary } from './AppEndSummary';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';

type AppEndListControllerProps = {
  page: number;
};

export const AppEndModalController = ({ page }: AppEndListControllerProps) => {
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const {
    data: swrPublications,
    isLoading: swrPublicationsIsLoading,
    error: swrPublicationsError,
    mutate: swrPublicationsMutate,
  } = useSWR(
    `/applicant-endorsement/publications/${employee.employmentDetails.userId}`,
    fetcherHRIS
  );

  // get app end store
  const {
    updateResponse,
    getPublications,
    getPublicationsFail,
    getPublicationsSuccess,
  } = useAppEndStore((state) => ({
    getPublications: state.getPublications,
    getPublicationsSuccess: state.getPublicationsSuccess,
    getPublicationsFail: state.getPublicationsFail,
    updateResponse: state.publicationResponse.updateResponse,
  }));

  // loading state
  useEffect(() => {
    if (swrPublicationsIsLoading) getPublications();
  }, [swrPublicationsIsLoading]);

  // sets the list of publications under the requesting entity
  useEffect(() => {
    if (!isEmpty(swrPublications)) {
      getPublicationsSuccess(swrPublications.data);
    }

    if (!isEmpty(swrPublicationsError))
      getPublicationsFail(swrPublicationsError);
  }, [swrPublications, swrPublicationsError]);

  // mutate publication list

  useEffect(() => {
    if (!isEmpty(updateResponse)) swrPublicationsMutate();
  }, [updateResponse]);

  if (!isEmpty())
    if (!swrPublications)
      return (
        <>
          <LoadingVisual />
        </>
      );

  return (
    <div className="max-h-[90%] px-2">
      <>
        {page === 1 && <AppEndSelectPublication />}
        {page === 2 && <AppEndSelectApplicants />}
        {page === 3 && <AppEndSummary />}
      </>
    </div>
  );
};
