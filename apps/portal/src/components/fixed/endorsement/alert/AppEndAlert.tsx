/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert, Button, ToastNotification } from '@gscwd-apps/oneui';
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
    const postingApplicantIds = await getArrayOfIdsFromSelectedApplicants(
      selectedApplicants
    );

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
          <AppEndAlertController page={alert.page} />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            {alert.page === 1 && (
              <div className="min-w-[5rem] max-w-auto">
                <Button
                  variant="info"
                  onClick={() => setAlert({ ...alert, isOpen: false })}
                  className="w-full"
                >
                  No
                </Button>
              </div>
            )}
            <div className="min-w-[5rem] max-w-auto">
              <Button onClick={alertAction} className="w-full">
                {alert.page === 1 ? 'Yes' : 'Got it, Thanks!'}
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};

export default AppEndAlert;
