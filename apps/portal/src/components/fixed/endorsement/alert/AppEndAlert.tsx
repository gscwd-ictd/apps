/* eslint-disable @nx/enforce-module-boundaries */
import {
  Alert,
  AlertNotification,
  Button,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { Applicant } from 'apps/portal/src/types/applicant.type';
import { patchData } from 'apps/portal/src/utils/hoc/axios';
import { isEmpty } from 'lodash';
import { AppEndAlertController } from '../AppEndAlertController';

const AppEndAlert = () => {
  const {
    alert,
    modal,
    selectedApplicants,
    errorPublication,
    selectedPublication,
    loadingPublication,
    setModal,
    setAction,
    setSelectedApplicants,
    setAlert,
    updatePublication,
    updatePublicationFail,
    updatePublicationSuccess,
  } = useAppEndStore((state) => ({
    setAction: state.setAction,
    setSelectedApplicants: state.setSelectedApplicants,
    selectedApplicants: state.selectedApplicants,
    alert: state.alert,
    setAlert: state.setAlert,
    setModal: state.setModal,
    selectedPublication: state.selectedPublication,
    modal: state.modal,
    updatePublication: state.updatePublication,
    updatePublicationSuccess: state.updatePublicationSuccess,
    updatePublicationFail: state.updatePublicationFail,
    errorPublication: state.publicationError.errorPublication,
    loadingPublication: state.publicationLoading.loadingPublication,
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

  // alert action button is fired
  const alertAction = async () => {
    // checks the current alert page
    if (alert.page === 1) {
      // call the update publication from store
      updatePublication();

      // assign the function
      const publicationResult = await handleSubmit(selectedApplicants);

      // if the publication returns an error
      if (publicationResult.error === true) {
        updatePublicationFail(publicationResult.result);
      }
      // if the publication has no error return
      else if (publicationResult.error === false) {
        updatePublicationSuccess(publicationResult.result);
        setAlert({ ...alert, page: 2 });
      }
    } else if (alert.page === 2) {
      setAction('');
      setSelectedApplicants([]);
      setModal({ ...modal, isOpen: false });
      setAlert({ ...alert, isOpen: false });
    }
  };

  // handle on submit
  const handleSubmit = async (selectedApplicants: Array<Applicant>) => {
    const applicantIdsForPosting = await getArrayOfIdsFromSelectedApplicants(
      selectedApplicants
    );

    const postingApplicantIds = {
      postingApplicantIds: applicantIdsForPosting,
    };

    const patchPublication = await patchData(
      `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/shortlist/${selectedPublication.vppId}`,
      postingApplicantIds
    );

    return patchPublication;
  };

  // alert set open
  const openAlert = () => {
    setAlert({ ...alert, isOpen: true });
  };

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(errorPublication) ? (
        <ToastNotification toastType="error" notifMessage={errorPublication} />
      ) : null}

      <Alert open={alert.isOpen} setOpen={openAlert}>
        <Alert.Description>
          {loadingPublication ? (
            <div className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            </div>
          ) : null}
          <AppEndAlertController page={alert.page} />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            {alert.page === 1 && (
              <button
                onClick={() => setAlert({ ...alert, isOpen: false })}
                className="w-[6rem] disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-gray-200 focus:bg-gray-100  hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
              >
                No
              </button>
            )}

            <button
              onClick={alertAction}
              className="min-w-[6rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
            >
              {alert.page === 1 ? 'Yes' : 'Got it, Thanks!'}
            </button>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};

export default AppEndAlert;
