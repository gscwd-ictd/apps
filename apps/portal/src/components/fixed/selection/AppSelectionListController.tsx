import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { AppSelectionSelectPublication } from './AppSelectionSelectPublication';
import { AppSelectionSelectApplicants } from './AppSelectionSelectApplicants';
import {} from './AppSelectionSelectApplicants';
import { useAppSelectionStore } from '../../../store/selection.store';
import { SpinnerCircular, SpinnerDotted } from 'spinners-react';

type AppPlaceListControllerProps = {
  page: number;
};

export const AppSelectionModalController = ({
  page,
}: AppPlaceListControllerProps) => {
  const setPublicationList = useAppSelectionStore(
    (state) => state.setPublicationList
  );

  const setFilteredPublicationList = useAppSelectionStore(
    (state) => state.setFilteredPublicationList
  );

  // get api for the list of publications
  const publicationUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/publications`;

  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const { data } = useSWR(publicationUrl, fetchWithSession);

  // sets the list of publications under the requesting entity
  useEffect(() => {
    if (!isEmpty(data)) {
      setPublicationList(data);
      setFilteredPublicationList(data);
    }
  }, [data]);

  if (!data) {
    return (
      <>
        <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
          <SpinnerDotted
            speed={70}
            thickness={70}
            className="w-full flex h-full transition-all "
            color="slateblue"
            size={100}
          />
        </div>
      </>
    );
  }

  return (
    <div className="max-h-[90%]">
      <>
        {page === 1 && <AppSelectionSelectPublication />}
        {page === 2 && <AppSelectionSelectApplicants />}
      </>
    </div>
  );
};
