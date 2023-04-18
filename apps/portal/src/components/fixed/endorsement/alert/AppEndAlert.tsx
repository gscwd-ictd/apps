import { Alert, Button } from '@gscwd-apps/oneui';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { Applicant } from 'apps/portal/src/types/applicant.type';
import { patchData } from 'apps/portal/src/utils/hoc/axios';
import { AppEndAlertController } from '../AppEndAlertController';

const AppEndAlert = () => {
  const {
    selectedApplicants,
    alert,
    modal,
    selectedPublication,
    setModal,
    setAction,
    setSelectedApplicants,
    setAlert,
  } = useAppEndStore((state) => ({
    setAction: state.setAction,
    setSelectedApplicants: state.setSelectedApplicants,
    selectedApplicants: state.selectedApplicants,
    alert: state.alert,
    setAlert: state.setAlert,
    setModal: state.setModal,
    selectedPublication: state.selectedPublication,
    modal: state.modal,
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
    if (alert.page === 1) {
      const applicantIds = await getArrayOfIdsFromSelectedApplicants(
        selectedApplicants
      );
      const postingApplicantIds = {
        postingApplicantIds: applicantIds,
      };
      const { error, result } = await patchData(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/shortlist/${selectedPublication.vppId}`,
        postingApplicantIds
      );

      // opens the success page
      if (!error) {
        setAlert({ ...alert, page: 2 });
      }
    } else if (alert.page === 2) {
      setDefaultValues();
      setModal({ ...modal, isOpen: false });
      //   setIsLoading(true);
      setAlert({ ...alert, isOpen: false });
    }
  };

  // alert set open
  const openAlert = () => {
    setAlert({ ...alert, isOpen: true });
  };

  const setDefaultValues = () => {
    setAction('');
    // setPublicationList([]);
    // setFilteredPublicationList([]);
    setSelectedApplicants([]);
  };
  return (
    <Alert open={alert.isOpen} setOpen={openAlert}>
      <Alert.Description>
        <AppEndAlertController page={alert.page} />
      </Alert.Description>
      <Alert.Footer alignEnd>
        <div className="flex gap-2">
          {alert.page === 1 && (
            <div className="w-[5rem]">
              <Button
                variant="info"
                onClick={() => setAlert({ ...alert, isOpen: false })}
              >
                No
              </Button>
            </div>
          )}
          <div className="min-w-[5rem] max-w-auto">
            <Button onClick={alertAction}>
              {alert.page === 1 ? 'Yes' : 'Got it, Thanks!'}
            </Button>
          </div>
        </div>
      </Alert.Footer>
    </Alert>
  );
};

export default AppEndAlert;
