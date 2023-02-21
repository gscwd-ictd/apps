import { HiUserCircle } from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';

export const SelectedSelectionApplicantCard = (): JSX.Element => {
    const selectedApplicants = useAppSelectionStore((state) => state.selectedApplicants)

    return (
        <>
            {selectedApplicants &&
                selectedApplicants.map((applicant, index: number) => {
                    return (
                        <div className="p-5 my-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100" key={index}>
                            <div className="flex items-center gap-5">
                                <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                                    <HiUserCircle className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div className='font-light text-gray-500'>{applicant.applicantName}</div>
                            </div>
                        </div>
                    );
                })}
        </>
    );
};
