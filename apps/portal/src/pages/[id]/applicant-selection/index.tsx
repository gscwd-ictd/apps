import { Alert, Button, Modal } from '@gscwd-apps/oneui';
import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { employee } from '../../../utils/constants/data';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { patchData } from '../../../utils/hoc/axios';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { AppSelAlertController } from '../../../components/fixed/selection/AppSelAlertController';
import { AppSelectionModalController } from '../../../components/fixed/selection/AppSelectionListController';
import { AppSelectionTabs } from '../../../components/fixed/selection/AppSelectionTabs';
import { AppSelectionTabWindow } from '../../../components/fixed/selection/AppSelectionTabWindow';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { useEmployeeStore } from '../../../store/employee.store';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Applicant } from '../../../types/applicant.type';

export default function AppPosAppointment({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // get state for the modal
  const modal = useAppSelectionStore((state) => state.modal);

  // set state for the modal
  const setModal = useAppSelectionStore((state) => state.setModal);

  // get the selected publication id state
  const selectedPublication = useAppSelectionStore(
    (state) => state.selectedPublication
  );

  // get the selected applicants state
  const selectedApplicants = useAppSelectionStore(
    (state) => state.selectedApplicants
  );

  // set the selected applicants state
  const setSelectedApplicants = useAppSelectionStore(
    (state) => state.setSelectedApplicants
  );

  // get the tab state
  const tab = useAppSelectionStore((state) => state.tab);

  // set the employee details state from store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // confirmation alert
  const alert = useAppSelectionStore((state) => state.alert);

  // set confirmation alert
  const setAlert = useAppSelectionStore((state) => state.setAlert);

  // loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // open the modal
  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

  // close the modal
  const closeModal = () => {
    setIsLoading(true);
    setModal({ ...modal, isOpen: false });
  };

  // confirm action for modal
  const modalAction = async () => {
    if (modal.page === 2) {
      setAlert({ ...alert, isOpen: true });
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    if (modal.page === 1)
      setModal({ ...modal, isOpen: false }); //! Add set state default values
    else if (modal.page === 2) {
      setModal({ ...modal, page: 1 });
      setSelectedApplicants([]);
    }
  };

  // open alert
  const openAlert = () => {
    setAlert({ ...alert, isOpen: true });
  };

  // confirm modal action
  const alertAction = async () => {
    if (alert.page === 1) {
      const applicantIds = await getArrayOfIdsFromSelectedApplicants(
        selectedApplicants
      );
      const postingApplicantIds = {
        postingApplicantIds: applicantIds,
      };
      const { error, result } = await patchData(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/${selectedPublication.vppId}`, //* Changed
        postingApplicantIds
      );
      console.log(result);
      error && console.log(error);

      if (!error) {
        setAlert({ ...alert, page: 2 });
      }
    } else if (alert.page === 2) {
      setIsLoading(true);
      setModal({ ...modal, isOpen: false, page: 1 });
      setAlert({ ...alert, isOpen: false, page: 1 });
    }
  };

  // set the employee details store from server side props
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Appointing Authority Selection</title>
      </Head>

      <SideNav />

      <Modal
        open={modal.isOpen}
        setOpen={openModal}
        size={modal.page === 2 ? 'xl' : 'lg'}
        steady
      >
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="px-5">
              {modal.page === 1
                ? 'Select a publication'
                : modal.page === 2 && 'Select Applicants'}
            </div>
          </h3>
        </Modal.Header>

        <Modal.Body>
          {/* <Button onClick={() => console.log(selectedApplicants)}>Log Selected Applicants</Button> */}
          <AppSelectionModalController page={modal.page} />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {modal.page !== 4 ? (
              <div className="w-[6rem]">
                <Button variant="info" onClick={modalCancel}>
                  {modal.page === 1 ? 'Close' : 'Cancel'}
                </Button>
              </div>
            ) : null}
            {modal.page !== 1 && modal.page !== 3 && (
              <div className="min-w-[6rem] max-w-auto">
                <Button
                  onClick={modalAction}
                  disabled={
                    modal.page === 2 &&
                    !(selectedApplicants.length === 0) &&
                    modal.page === 2 &&
                    selectedApplicants.length > 0 &&
                    selectedApplicants.length !==
                      parseInt(selectedPublication.numberOfPositions!)
                  }
                >
                  {modal.page === 4
                    ? 'Got it, Thanks!'
                    : modal.page === 2 && selectedApplicants.length === 0
                    ? 'Select none'
                    : 'Confirm'}
                </Button>
              </div>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      <Alert open={alert.isOpen} setOpen={openAlert}>
        <Alert.Description>
          <AppSelAlertController page={alert.page} />
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

      <MainContainer>
        <div className="w-full h-full px-32">
          <ContentHeader
            title="Applicant Selection"
            subtitle="Select an applicant for the position"
          >
            <Button onClick={openModal}>
              <div className="flex items-center w-full gap-2">
                <HiSearch /> Find a Publication
              </div>
            </Button>
          </ContentHeader>

          {isLoading ? (
            <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
              <SpinnerDotted
                speed={70}
                thickness={70}
                className="flex w-full h-full transition-all "
                color="slateblue"
                size={100}
              />
            </div>
          ) : (
            <ContentBody>
              <>
                <div className="flex w-full">
                  <div className="w-[58rem]">
                    <AppSelectionTabs tab={tab} />
                  </div>
                  <div className="w-full">
                    <AppSelectionTabWindow
                      positionId={
                        employeeDetails.employmentDetails.assignment.positionId
                      }
                    />
                  </div>
                </div>
              </>
            </ContentBody>
          )}
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();
    return { props: { employeeDetails } };
  }
);
