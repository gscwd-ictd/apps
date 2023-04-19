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
      <div className="flex-row items-center w-full h-auto px-5 rounded text-slate-700 bg-slate-50 pt-7">
        {selectedApplicants > 0 && (
          <div className="flex justify-center text-xl">
            <div className="flex flex-col items-center">
              <p className="w-full text-lg font-light text-left">
                You have selected{' '}
                <span className="font-medium text-black">
                  {selectedApplicants}{' '}
                  {selectedApplicants > 1 ? 'applicants' : 'applicant'}
                </span>{' '}
                for{' '}
                <span className="font-medium text-black">
                  {selectedPublication.positionTitle}
                </span>{' '}
                position.
              </p>
            </div>
          </div>
        )}
        <div className="w-full mt-5 text-lg font-light text-left ">
          <div>This action cannot be undone.</div>
          <div>Do you want to proceed?</div>
        </div>
      </div>
    </>
  );
};
