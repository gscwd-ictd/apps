import { useAppEndStore } from '../../../store/endorsement.store';
import { UndrawSelecting } from '../undraw/Selecting';
import { AllApplicantsList } from './AllApplicantsList';
import { SelectedApplicantCard } from './SelectedApplicantCard';
import { SelectedPublication } from './SelectedPublication';

export const AppEndSelectApplicants = () => {
    const selectedPublication = useAppEndStore((state) => state.selectedPublication)

    const selectedApplicants = useAppEndStore((state) => state.selectedApplicants);

    const applicantList = useAppEndStore((state) => state.applicantList);


    return (
        <>
            <div>
                <SelectedPublication publication={selectedPublication} />
            </div>
            <div className="font-light text-gray-500 mt-5 mb-2 px-5">Select applicants for short-listing</div>
            <div className="grid grid-cols-5 rounded-md border border-gray-50">
                <section className="col-span-2">
                    <div className="flex justify-end px-5 py-2 mb-1 text-sm">
                        {applicantList.length > 0 ?
                            <> <p className="text-gray-600 font-extralight">
                                {selectedApplicants.length > 0 ? selectedApplicants.length : ' '}{' '}
                                {selectedApplicants.length === 1 ? 'applicant' : selectedApplicants.length === 0 ? 'No applicant' : 'applicants'} selected
                            </p></>
                            : null}
                    </div>
                    <div className="h-[32rem] overflow-y-auto">
                        <AllApplicantsList />
                    </div>
                </section>
                <section className="col-span-3 bg-gray-50 bg-opacity-50 px-5 pt-5  ">
                    {selectedApplicants.length > 0 ? (
                        <div className='h-[32rem] overflow-y-auto'> <SelectedApplicantCard /></div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                                <UndrawSelecting width={250} height={250} />
                                <div className="text-2xl text-gray-300">Select at least 1 applicant to proceed</div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
};
