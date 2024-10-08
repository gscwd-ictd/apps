import { HiExclamationCircle } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';

type AppEndAlertConfirmationProps = {
  selectedApplicants: number;
};

export const AppEndAlertConfirmation = ({
  selectedApplicants,
}: AppEndAlertConfirmationProps) => {
  const selectedPublication = useAppEndStore(
    (state) => state.selectedPublication
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <HiExclamationCircle
          className="text-yellow-500 animate-pulse"
          size={30}
        />
        <span className="text-2xl">Confirm Action</span>
      </div>

      <hr />
      <div className="flex-row items-center w-full h-auto rounded text-slate-700">
        {selectedApplicants > 0 && (
          <div className="flex mt-5 text-xl">
            <div className="flex flex-col items-center">
              <p className="w-full text-lg font-light text-left">
                You have selected
                <br />
                <span className="font-medium text-black">
                  {selectedApplicants}{' '}
                  {selectedApplicants > 1 ? 'applicants' : 'applicant'}
                </span>{' '}
                for <br />
                <span className="font-medium text-black">
                  {selectedPublication.positionTitle}
                </span>{' '}
                position.
              </p>
            </div>
          </div>
        )}
        <div className="w-full mt-5 font-light text-left text-md ">
          <div>This action cannot be undone.</div>
          <div>Do you want to proceed?</div>
        </div>
      </div>
    </>
  );
};
