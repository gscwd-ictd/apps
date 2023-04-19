import dayjs from 'dayjs';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllApplicantsListSummary } from './AllApplicantsListSummary';

export const AppEndSummary = () => {
  const publication = useAppEndStore((state) => state.selectedPublication);
  const applicantList = useAppEndStore((state) => state.applicantList);
  return (
    <>
      <div className="w-full px-5 py-2 bg-indigo-800 rounded">
        <div className="flex justify-between w-full mt-2 text-gray-200">
          <div>
            <div className="text-xl font-medium">
              {publication.positionTitle}
            </div>
            <div className="mt-2 text-sm font-normal">
              {publication.itemNumber}
            </div>
            <div className="text-sm font-normal">
              {publication.placeOfAssignment}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-200 text-md">
              Fulfilled on{' '}
              {dayjs(publication.requestingEntitySelectionDate).format(
                'MMMM DD, YYYY'
              )}
            </div>
            <div className="mt-2 text-sm font-normal">
              Positions needed: {publication.numberOfPositions}
            </div>
            <div className="text-sm font-normal">
              Number of applicants selected for interview:{' '}
              {applicantList.length}
            </div>
          </div>
        </div>
      </div>
      <AllApplicantsListSummary />
    </>
  );
};
