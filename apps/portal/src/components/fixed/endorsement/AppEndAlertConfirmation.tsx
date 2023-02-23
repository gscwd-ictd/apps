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
      <div className="flex-row w-full h-auto items-center text-slate-700 px-5 rounded bg-slate-50 pt-7">
        {selectedApplicants > 1 && (
          <div className="flex justify-center text-xl">
            <div className="flex flex-col items-center">
              <p className="text-left font-light text-lg w-full">
                You have selected{' '}
                <span className="text-black font-medium">
                  {selectedApplicants}{' '}
                  {selectedApplicants > 1 ? 'applicants' : 'applicant'}
                </span>{' '}
                for{' '}
                <span className="text-black font-medium">
                  {selectedPublication.positionTitle}
                </span>{' '}
                position.
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
