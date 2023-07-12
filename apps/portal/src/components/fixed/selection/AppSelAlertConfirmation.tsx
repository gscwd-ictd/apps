import { ApplicantWithScores } from 'apps/portal/src/types/selection.type';
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';

type AppSelAlertConfirmationProps = {
  selectedApplicants: Array<ApplicantWithScores>;
};

export const AppSelAlertConfirmation = ({
  selectedApplicants,
}: AppSelAlertConfirmationProps) => {
  const selectedPublication = useAppSelectionStore(
    (state) => state.selectedPublication
  );

  return (
    <>
      <div className="flex-row w-full h-auto items-center text-slate-700 px-5 rounded  p-5">
        {selectedApplicants.length === 0 && (
          <div className="flex justify-center text-xl ">
            <div className="flex flex-col items-start">
              <div className="flex w-full rounded-lg text-red-600 animate-pulse ">
                <HiExclamation size={30} color="red" />
                <span className="text-2xl uppercase">Warning</span>
              </div>

              <div className="mt-2"> You have not selected any applicant</div>
            </div>
          </div>
        )}

        {selectedApplicants.length >= 1 && (
          <div className="flex flex-col  justify-center text-xl ">
            <div className="flex w-full rounded-lg gap-2 ">
              <HiInformationCircle
                size={30}
                color="orange"
                className="animate-pulse"
              />
              <span className="text-2xl uppercase font-semibold tracking-wide text-gray-800">
                Action
              </span>
            </div>
            <hr />
            <div className="flex flex-col items-center mt-2">
              <p className="text-left  text-lg w-full">
                <span className="">You have selected </span>
                <span className="text-black text-xl font-medium">
                  {selectedApplicants.length}{' '}
                  {selectedApplicants.length > 1 ? 'applicants' : 'applicant'}
                </span>{' '}
                {selectedApplicants.length > 0 &&
                  selectedApplicants.map((applicant, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex gap-2 w-full text-md text-gray-600 font-medium"
                      >
                        • {applicant.applicantName}
                      </div>
                    );
                  })}
                <div className="pt-5">
                  For{' '}
                  <span className="text-black text-xl font-medium">
                    {selectedPublication.positionTitle}
                  </span>{' '}
                  position.
                </div>
              </p>
            </div>
          </div>
        )}
        <div className=" text-lg w-full text-left text-gray-800 mt-5 ">
          <div>This action cannot be undone.</div>
          <div>Do you want to proceed?</div>
        </div>
      </div>
    </>
  );
};
