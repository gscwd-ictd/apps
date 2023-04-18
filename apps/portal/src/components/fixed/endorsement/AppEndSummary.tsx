import dayjs from 'dayjs';
import { useRef } from 'react';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllApplicantsListSummary } from './AllApplicantsListSummary';

export const AppEndSummary = () => {
  // const [applicantListIsLoaded, setApplicantListIsLoaded] = useState<boolean>(false);

  const publication = useAppEndStore((state) => state.selectedPublication);

  const applicantList = useAppEndStore((state) => state.applicantList);

  // initialize url to get applicant

  return (
    <>
      <div className="w-full px-5 mt-14">
        <div className="flex justify-between w-full">
          <div className="text-lg font-medium text-gray-600">
            {publication.positionTitle}
          </div>
          <div className="text-indigo-500 text-md">
            Fulfilled on{' '}
            {dayjs(publication.postingDate).format('MMMM DD, YYYY')}
          </div>
        </div>
        <div className="flex justify-between w-full mt-2 text-xs text-gray-800">
          <div>
            <div>{publication.itemNumber}</div>
            <div>{publication.placeOfAssignment}</div>
          </div>
          <div>
            <div>Positions needed: {publication.numberOfPositions}</div>
            <div>
              Number of applicants selected for interview:{' '}
              {applicantList.length}
            </div>
          </div>
        </div>

        <AllApplicantsListSummary />
      </div>
    </>
  );
};
