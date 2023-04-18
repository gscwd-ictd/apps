import Head from 'next/head';
import { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import { AppEndModalController } from '../../../components/fixed/endorsement/AppEndListController';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { patchData } from '../../../utils/hoc/axios';
import { Applicant } from '../../../types/applicant.type';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AppEndTabs } from '../../../components/fixed/endorsement/AppEndTabs';
import { AppEndTabWindow } from '../../../components/fixed/endorsement/AppEndTabWindow';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { AppEndAlertController } from '../../../components/fixed/endorsement/AppEndAlertController';
import { Modal, Button, Alert } from '@gscwd-apps/oneui';

export default function ApplicantEndorsement({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // get state for the modal
  const modal = useAppEndStore((state) => state.modal);

  // get loading state from store
  const isLoading = useAppEndStore((state) => state.isLoading);

  // set tab state
  const tab = useAppEndStore((state) => state.tab);

  // get the selected publication state
  const selectedPublication = useAppEndStore(
    (state) => state.selectedPublication
  );

  // get state for selected applicants
  const selectedApplicants = useAppEndStore(
    (state) => state.selectedApplicants
  );

  // set loading state from store
  const setIsLoading = useAppEndStore((state) => state.setIsLoading);

  // set state for the modal
  const setModal = useAppEndStore((state) => state.setModal);

  // set the selected publication list state
  const setPublicationList = useAppEndStore(
    (state) => state.setPublicationList
  );

  // set the filtered publication list state
  const setFilteredPublicationList = useAppEndStore(
    (state) => state.setFilteredPublicationList
  );

  // set state for selected applicants
  const setSelectedApplicants = useAppEndStore(
    (state) => state.setSelectedApplicants
  );

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // set action
  const setAction = useAppEndStore((state) => state.setAction);

  const alert = useAppEndStore((state) => state.alert);

  const setAlert = useAppEndStore((state) => state.setAlert);

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
    setModal({ ...modal, isOpen: false });
    setPublicationList([]);
    setFilteredPublicationList([]);
    setIsLoading(true);
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
      setIsLoading(true);
      setAlert({ ...alert, isOpen: false });
    }
  };

  // alert set open
  const openAlert = () => {
    setAlert({ ...alert, isOpen: true });
  };

  // confirm action for main modal
  const modalAction = async () => {
    if (modal.page === 2) {
      setAlert({ ...alert, isOpen: true, page: 1 });
      // setModal({ ...modal, page: 4 });
      setIsLoading(true);
    } else if (modal.page === 4) {
      setDefaultValues();
      setModal({ ...modal, isOpen: false });
      setIsLoading(true);
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    if (modal.page === 1) {
      setModal({ ...modal, isOpen: false });
      setPublicationList([]);
      setFilteredPublicationList([]);
      setIsLoading(true);
    } else if (modal.page === 2) {
      setModal({ ...modal, page: 1 });
      setSelectedApplicants([]);
    } else if (modal.page === 3) {
      setModal({ ...modal, page: 1 });
      setAction('');
    }
  };

  const setDefaultValues = () => {
    setAction('');
    setPublicationList([]);
    setFilteredPublicationList([]);
    setSelectedApplicants([]);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsLoading(true);
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
      <>
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Applicant Endorsement</title>
          </Head>

          <SideNav />

          <Modal
            open={modal.isOpen}
            setOpen={openModal}
            size={
              modal.page === 1
                ? 'lg'
                : modal.page === 3
                ? 'md'
                : modal.page === 4
                ? 'sm'
                : 'xl'
            }
            steady
          >
            <Modal.Header>
              <h3 className="text-xl font-semibold text-gray-700">
                <div className="px-5">
                  {modal.page === 1
                    ? 'Select an endorsement'
                    : modal.page === 3
                    ? 'Endorsement Summary'
                    : 'Endorsement'}
                </div>
              </h3>
            </Modal.Header>
            <Modal.Body>
              <AppEndModalController page={modal.page} />
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
                        modal.page === 2 && selectedApplicants.length < 1
                      }
                    >
                      {modal.page !== 4 ? 'Confirm' : 'Got it, Thanks!'}
                    </Button>
                  </div>
                )}
              </div>
            </Modal.Footer>
          </Modal>

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

          <MainContainer>
            <div className="w-full h-full px-32">
              <ContentHeader
                title="Applicant Endorsement"
                subtitle="Select a list of endorsed applicants"
              >
                <Button onClick={openModal}>
                  <div className="flex items-center w-full gap-2">
                    <HiSearch /> Find an Endorsement
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
                        <AppEndTabs tab={tab} />
                      </div>
                      <div className="w-full">
                        <AppEndTabWindow
                          employeeId={employeeDetails.employmentDetails.userId}
                        />
                      </div>
                    </div>
                  </>
                </ContentBody>
              )}
            </div>
          </MainContainer>
        </EmployeeProvider>
      </>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
