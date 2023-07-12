import { PublicationPostingStatus } from '../../../../src/types/publication.type';
import { useAppSelectionStore } from '../../../store/selection.store';

export const AllSelectionApplicantCounter = () => {
  const applicantList = useAppSelectionStore((state) => state.applicantList);
  const selectedApplicants = useAppSelectionStore(
    (state) => state.selectedApplicants
  );
  const selectedPublication = useAppSelectionStore(
    (state) => state.selectedPublication
  );
  const publicationDetails = useAppSelectionStore(
    (state) => state.publicationDetails
  );

  return (
    <div className="flex py-2 mb-1 text-md">
      {publicationDetails?.positionDetails?.postingStatus ===
      PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION ? (
        <>
          {applicantList.length > 0 ? (
            <div className="flex w-full justify-end items-center pb-5 px-2">
              <div className="text-gray-600 font-medium">
                <div className="flex gap-2">
                  <div
                    className={`${
                      selectedApplicants.length >
                      parseInt(selectedPublication.numberOfPositions!)
                        ? 'text-red-500'
                        : selectedApplicants.length ===
                          parseInt(selectedPublication.numberOfPositions!)
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    Applicants Selected:
                  </div>
                  <div>
                    {selectedApplicants.length >
                      parseInt(selectedPublication.numberOfPositions!) ||
                    selectedApplicants.length === 0 ? (
                      <>
                        <span className="text-red-500">
                          {selectedApplicants.length}
                        </span>
                      </>
                    ) : selectedApplicants.length ===
                      parseInt(selectedPublication.numberOfPositions!) ? (
                      <span className="text-green-700">
                        {selectedApplicants.length}
                      </span>
                    ) : null}{' '}
                    / {selectedPublication.numberOfPositions}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
