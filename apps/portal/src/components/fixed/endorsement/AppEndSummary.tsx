import dayjs from 'dayjs';
import { useRef } from 'react';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllApplicantsListSummary } from './AllApplicantsListSummary';

export const AppEndSummary = () => {
    // const [applicantListIsLoaded, setApplicantListIsLoaded] = useState<boolean>(false);

    // use this to assign as a parameter in useSWR
    const random = useRef(Date.now());

    const publication = useAppEndStore((state) => state.selectedPublication);

    const applicantList = useAppEndStore((state) => state.applicantList);

    // initialize url to get applicant

    return (
        <>
            <div className="mt-14 w-full">
                <div className='w-full flex justify-between'>
                    <div className="text-lg font-medium text-gray-600">{publication.positionTitle}</div>
                    <div className='text-indigo-500 text-md'>Fulfilled on {dayjs(publication.postingDate).format('MMMM d, YYYY')}</div>
                </div>
                <div className="flex mt-2 w-full justify-between text-xs text-gray-800">
                    <div>
                        <div>{publication.itemNumber}</div>
                        <div>{publication.placeOfAssignment}</div>
                    </div>
                    <div>
                        <div>Positions needed: {publication.numberOfPositions}</div>
                        <div>Number of applicants selected for interview: {applicantList.length}</div>
                    </div>
                </div>

                <AllApplicantsListSummary />
            </div>
        </>
    );
};
