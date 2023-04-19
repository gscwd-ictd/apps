/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
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
import { employeeDummy } from '../../../../src/types/employee.type';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import AppSelectionModal from '../../../../src/components/fixed/selection/AppSelectionModal';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';

export default function AppPosAppointment({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    loadingPublicationList,
    loadingFulfilledPublicationList,
    loadingPendingPublicationList,
    loadingResponse,
    errorPublicationList,
    errorFulfilledPublicationList,
    errorPendingPublicationList,
    errorResponse,
    patchResponseApply,
    appSelectionModalIsOpen,

    setAppSelectionModalIsOpen,
    getPendingPublicationList,
    getPendingPublicationListSuccess,
    getPendingPublicationListFail,

    getFulfilledPublicationList,
    getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail,

    patchPublication,
    patchPublicationSuccess,
    patchPublicationFail,
  } = useAppSelectionStore((state) => ({
    loadingPublicationList: state.loading.loadingPublicationList,
    loadingFulfilledPublicationList:
      state.loading.loadingFulfilledPublicationList,
    loadingPendingPublicationList: state.loading.loadingPendingPublicationList,
    loadingResponse: state.loading.loadingResponse,

    errorPublicationList: state.errors.errorPublicationList,
    errorFulfilledPublicationList: state.errors.errorFulfilledPublicationList,
    errorPendingPublicationList: state.errors.errorPendingPublicationList,
    errorResponse: state.errors.errorResponse,

    patchResponseApply: state.response.patchResponseApply,
    appSelectionModalIsOpen: state.appSelectionModalIsOpen,

    setAppSelectionModalIsOpen: state.setAppSelectionModalIsOpen,
    getPendingPublicationList: state.getPendingPublicationList,
    getPendingPublicationListSuccess: state.getPendingPublicationListSuccess,
    getPendingPublicationListFail: state.getPendingPublicationListFail,

    getFulfilledPublicationList: state.getFulfilledPublicationList,
    getFulfilledPublicationListSuccess:
      state.getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail: state.getFulfilledPublicationListFail,

    patchPublication: state.patchPublication,
    patchPublicationSuccess: state.patchPublicationSuccess,
    patchPublicationFail: state.patchPublicationFail,
  }));

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
    setAppSelectionModalIsOpen(true);
  };

  // close the modal
  const closeModal = () => {
    setIsLoading(true);
    setModal({ ...modal, isOpen: false });
  };

  // cancel action for App Selection Modal
  const closeAppSelectionModal = async () => {
    setAppSelectionModalIsOpen(false);
    setSelectedApplicants([]);
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
    let data;
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
      console.log('patched start');
      patchPublication();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data = result;
      console.log(result, 'result');
      error && console.log(error, 'error');

      if (!error) {
        console.log('patched successfully');
        console.log(data, 'patched data');
        patchPublicationSuccess(data);
        setAlert({ ...alert, page: 2 });
      } else {
        patchPublicationFail(data);
        console.log(data, 'patch error message');
        setAlert({ ...alert, page: 2 });
      }
    } else if (alert.page === 2) {
      console.log('closed alert modal');
      setIsLoading(true);
      setModal({ ...modal, isOpen: false, page: 1 });
      setAlert({ ...alert, isOpen: false, page: 1 });
      closeAppSelectionModal();
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

  const pendingUrl = `/applicant-endorsement/appointing-authority-selection/publications/pending`;
  const fulfilledUrl = `/applicant-endorsement/appointing-authority-selection/publications/selected`;

  //PENDING SELECTION
  const {
    data: swrPendingPublications,
    isLoading: swrPendingPublicationIsLoading,
    error: swrPendingPublicationError,
    mutate: mutatePendingPublications,
  } = useSWR(pendingUrl, fetcherHRIS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  //FULFILLED SELECTION
  const {
    data: swrFulfilledPublications,
    isLoading: swrFulfilledPublicationIsLoading,
    error: swrFulfilledPublicationError,
    mutate: mutateFulfilledPublications,
  } = useSWR(fulfilledUrl, fetcherHRIS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  //PENDING SELECTION
  // Initial zustand state update
  useEffect(() => {
    if (swrPendingPublicationIsLoading) {
      getPendingPublicationList(swrPendingPublicationIsLoading);
    }
  }, [swrPendingPublicationIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPendingPublications)) {
      getPendingPublicationListSuccess(
        swrPendingPublicationIsLoading,
        swrPendingPublications.data
      );
    }

    if (!isEmpty(swrPendingPublicationError)) {
      getPendingPublicationListFail(false, swrPendingPublicationError);
    }
  }, [swrPendingPublications, swrPendingPublicationError]);

  //FULFILLED SELECTION
  // Initial zustand state update
  useEffect(() => {
    if (swrFulfilledPublicationIsLoading) {
      getFulfilledPublicationList(swrFulfilledPublicationIsLoading);
    }
  }, [swrFulfilledPublicationIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrFulfilledPublications)) {
      getFulfilledPublicationListSuccess(
        swrFulfilledPublicationIsLoading,
        swrFulfilledPublications.data
      );
    }

    if (!isEmpty(swrFulfilledPublicationError)) {
      getFulfilledPublicationListFail(false, swrFulfilledPublicationError);
    }
  }, [swrFulfilledPublications, swrFulfilledPublicationError]);

  //mutate publications when patchResponseApply is updated
  useEffect(() => {
    if (!isEmpty(patchResponseApply)) {
      console.log('mag mutate dapat');
      mutatePendingPublications();
      mutateFulfilledPublications();
    }
  }, [patchResponseApply]);

  return (
    <>
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification
          toastType="success"
          notifMessage={`Selection Complete!`}
        />
      ) : null}

      {!isEmpty(errorResponse) ? (
        <ToastNotification
          toastType="error"
          notifMessage={` ${errorResponse}.`}
        />
      ) : null}

      {!isEmpty(errorPublicationList) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`Search Publication: ${errorPublicationList}.`}
        />
      ) : null}

      {!isEmpty(errorFulfilledPublicationList) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`For Selection Publications: ${errorFulfilledPublicationList}.`}
        />
      ) : null}

      {!isEmpty(errorPendingPublicationList) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`Fulfilled Publications: ${errorPendingPublicationList}.`}
        />
      ) : null}

      <Head>
        <title>Appointing Authority Selection</title>
      </Head>

      <SideNav />

      <AppSelectionModal
        modalState={appSelectionModalIsOpen}
        setModalState={setAppSelectionModalIsOpen}
        closeModalAction={closeAppSelectionModal}
      />

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

          {loadingPendingPublicationList && loadingFulfilledPublicationList ? (
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

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();
    return { props: { employeeDetails } };
  }
);
