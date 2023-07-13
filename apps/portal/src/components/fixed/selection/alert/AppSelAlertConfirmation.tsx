import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import { Applicant } from 'apps/portal/src/types/applicant.type';
import { patchData } from 'apps/portal/src/utils/hoc/axios';
import { Alert } from 'libs/oneui/src/components/Alert/Alert';
import { FunctionComponent } from 'react';
import { HiExclamation, HiInformationCircle } from 'react-icons/hi';

export const AppSelAlertConfirmation = () => {
  const {
    selectedApplicants,
    selectedPublication,
    alertConfirmationIsOpen,
    setAlertConfirmationIsOpen,
    patchPublication,
    patchPublicationFail,
    patchPublicationSuccess,
  } = useAppSelectionStore((state) => ({
    selectedApplicants: state.selectedApplicants,
    selectedPublication: state.selectedPublication,
    alertConfirmationIsOpen: state.alertConfirmationIsOpen,
    setAlertConfirmationIsOpen: state.setAlertConfirmationIsOpen,
    patchPublication: state.patchPublication,
    patchPublicationSuccess: state.patchPublicationSuccess,
    patchPublicationFail: state.patchPublicationFail,
  }));

  // gets an array of strings of ids of all selected applicants
  const getArrayOfIdsFromSelectedApplicants = async (
    applicants: Array<Applicant>
  ) => {
    const applicantIds: Array<string> = [];
    const updatedApplicants = [...applicants];
    updatedApplicants.map((applicant) => {
      applicantIds.push(applicant.postingApplicantId);
    });
    return applicantIds;
  };

  // confirm alert action
  const alertConfirmationAction = async () => {
    const applicantIds = await getArrayOfIdsFromSelectedApplicants(
      selectedApplicants
    );

    // console.log('FROM APPLICANT IDS: ', applicantIds);
    const postingApplicantIds = {
      postingApplicantIds: applicantIds,
    };

    patchPublication();

    await handlePatchPublication(postingApplicantIds);
  };

  // handle patch
  const handlePatchPublication = async (postingApplicantIds: {
    postingApplicantIds: Array<string>;
  }) => {
    const { error, result } = await patchData(
      `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/${selectedPublication.vppId}`, //* Changed
      postingApplicantIds
    );

    if (!error) patchPublicationSuccess(result);
    else if (error) patchPublicationFail(result);
  };

  return (
    <>
      <Alert
        open={alertConfirmationIsOpen}
        setOpen={setAlertConfirmationIsOpen}
      >
        <Alert.Description>
          <div className="flex-row w-full h-auto items-center text-slate-700 px-5 rounded  p-5">
            {selectedApplicants.length === 0 && (
              <div className="flex justify-center text-xl ">
                <div className="flex flex-col items-start">
                  <div className="flex w-full rounded-lg text-red-600 animate-pulse ">
                    <HiExclamation size={30} color="red" />
                    <span className="text-2xl uppercase">Warning</span>
                  </div>

                  <div className="mt-2">
                    {' '}
                    You have not selected any applicant
                  </div>
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
                  <div className="text-left  text-lg w-full">
                    <span className="">You have selected </span>
                    <span className="text-black text-xl font-medium">
                      {selectedApplicants.length}{' '}
                      {selectedApplicants.length > 1
                        ? 'applicants'
                        : 'applicant'}
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
                  </div>
                </div>
              </div>
            )}
            <div className=" text-lg w-full text-left text-gray-800 mt-5 ">
              <div>This action cannot be undone.</div>
              <div>Do you want to proceed?</div>
            </div>
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <button
              onClick={() => setAlertConfirmationIsOpen(false)}
              className="w-[5rem] disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
            >
              No
            </button>

            <button
              onClick={alertConfirmationAction}
              className="min-w-[5rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
            >
              Yes
            </button>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};
