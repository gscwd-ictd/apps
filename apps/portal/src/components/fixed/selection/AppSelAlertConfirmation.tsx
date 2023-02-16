import { HiExclamation, HiInformationCircle, HiOutlineInformationCircle } from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';

type AppSelAlertConfirmationProps = {
  selectedApplicants: number;
};

export const AppSelAlertConfirmation = ({ selectedApplicants }: AppSelAlertConfirmationProps) => {
  const selectedPublication = useAppSelectionStore((state) => state.selectedPublication);

  return (
    <>
      <div className="flex-row w-full h-auto items-center text-slate-700 px-5 rounded bg-slate-100 p-5">
        {selectedApplicants === 0 && (
          <div className="flex justify-center text-xl">
            <div className="flex flex-col items-start">
              <div className="flex w-full rounded-lg text-red-600 animate-pulse ">
                <HiExclamation size={30} color="red" />
                <span className='text-2xl uppercase'>Warning</span>
              </div>
              <span > You have not selected any applicant</span>
            </div>
          </div>
        )}

        {selectedApplicants > 1 && (
          <div className="flex justify-center text-xl">
            <div className="flex flex-col items-center">

              <p className='text-left font-light text-lg w-full'>You have selected <span className='text-black font-medium'>{selectedApplicants} {selectedApplicants > 1 ? 'applicants' : 'applicant'}</span> for <span className='text-black font-medium'>{selectedPublication.positionTitle}</span> position.
              </p>
            </div>
          </div>
        )}
        <div className=" text-lg w-full text-left mt-5 font-light">
          <div>This action cannot be undone.</div>
          <div>Do you want to proceed?</div>
        </div>

      </div>
    </>
  );
};
