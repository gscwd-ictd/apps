import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { useAppEndStore } from '../../../store/endorsement.store';
import LoadingVisual from '../loading/LoadingVisual';
import { AppEndSelectPublication } from './AppEndModalSelectPublication';
import { AppEndAlertSuccess } from './AppEndAlertSuccess';
import { AppEndSelectApplicants } from './AppEndSelectApplicants';
import { AppEndSummary } from './AppEndSummary';

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

  const publicationUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employee.employmentDetails.userId}`;

  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const { data } = useSWR(publicationUrl, fetchWithSession);

  // sets the list of publications under the requesting entity
  useEffect(() => {
    if (!isEmpty(data)) {
      setPublicationList(data);
      setFilteredPublicationList(data);
    }
  }, [data]);

  if (!data)
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
