/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
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
  const setPublicationList = useAppEndStore(
    (state) => state.setPublicationList
  );
  const setFilteredPublicationList = useAppEndStore(
    (state) => state.setFilteredPublicationList
  );
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const { data: swrAllPublications } = useSWR(
    `/applicant-endorsement/publications/${employee.employmentDetails.userId}`,
    fetcherHRIS
  );

  // sets the list of publications under the requesting entity
  useEffect(() => {
    if (!isEmpty(swrAllPublications)) {
      setPublicationList(swrAllPublications.data);
      setFilteredPublicationList(swrAllPublications.data);
    }
  }, [swrAllPublications]);

  if (!swrAllPublications)
    return (
      <>
        <LoadingVisual />
      </>
    );

  return (
    <div className="max-h-[90%]">
      <>
        {page === 1 && <AppEndSelectPublication />}
        {page === 2 && <AppEndSelectApplicants />}
        {page === 3 && <AppEndSummary />}
      </>
    </div>
  );
};
