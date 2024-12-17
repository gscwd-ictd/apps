/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import SideNav from '../../../components/fixed/nav/SideNav';
import { AppSelectionTabs } from '../../../components/fixed/selection/AppSelectionTabs';
import { AppSelectionTabWindow } from '../../../components/fixed/selection/AppSelectionTabWindow';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { useAppSelectionStore } from '../../../store/selection.store';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import AppSelectionModal from '../../../components/fixed/selection/AppSelectionModal';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { AppSelAlertConfirmation } from 'apps/portal/src/components/fixed/selection/alert/AppSelAlertConfirmation';
import { AppSelAlertInfo } from 'apps/portal/src/components/fixed/selection/alert/AppSelAlertInfo';
import { useRouter } from 'next/router';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';

export default function AppPosAppointment({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    loadingFulfilledPublicationList,
    loadingPendingPublicationList,
    errorPublicationList,
    errorFulfilledPublicationList,
    errorPendingPublicationList,
    errorResponse,
    patchResponseApply,
    getPendingPublicationList,
    getPendingPublicationListSuccess,
    getPendingPublicationListFail,
    getFulfilledPublicationList,
    getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail,
    emptyResponseAndError,
  } = useAppSelectionStore((state) => ({
    loadingFulfilledPublicationList: state.loading.loadingFulfilledPublicationList,
    loadingPendingPublicationList: state.loading.loadingPendingPublicationList,
    errorPublicationList: state.errors.errorPublicationList,
    errorFulfilledPublicationList: state.errors.errorFulfilledPublicationList,
    errorPendingPublicationList: state.errors.errorPendingPublicationList,
    errorResponse: state.errors.errorResponse,
    patchResponseApply: state.response.patchResponseApply,
    getPendingPublicationList: state.getPendingPublicationList,
    getPendingPublicationListSuccess: state.getPendingPublicationListSuccess,
    getPendingPublicationListFail: state.getPendingPublicationListFail,
    getFulfilledPublicationList: state.getFulfilledPublicationList,
    getFulfilledPublicationListSuccess: state.getFulfilledPublicationListSuccess,
    getFulfilledPublicationListFail: state.getFulfilledPublicationListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  // get state for the modal
  const modal = useAppSelectionStore((state) => state.modal);

  // set state for the modal
  const setModal = useAppSelectionStore((state) => state.setModal);

  // get the selected publication id state
  const selectedPublication = useAppSelectionStore((state) => state.selectedPublication);

  // get the selected applicants state
  const selectedApplicants = useAppSelectionStore((state) => state.selectedApplicants);

  // get the tab state
  const tab = useAppSelectionStore((state) => state.tab);

  // set the employee details state from store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  // open the modal
  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

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

  // set the employee details store from server side props
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, []);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPendingPublications)) {
      getPendingPublicationListSuccess(swrPendingPublicationIsLoading, swrPendingPublications.data);
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
      getFulfilledPublicationListSuccess(swrFulfilledPublicationIsLoading, swrFulfilledPublications.data);
    }

    if (!isEmpty(swrFulfilledPublicationError)) {
      getFulfilledPublicationListFail(false, swrFulfilledPublicationError);
    }
  }, [swrFulfilledPublications, swrFulfilledPublicationError]);

  //mutate publications when patchResponseApply is updated
  useEffect(() => {
    if (!isEmpty(patchResponseApply)) {
      mutatePendingPublications();
      mutateFulfilledPublications();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseApply]);

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: employeeDetails.user.email,
      fullName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
      initials: UseNameInitials(employeeDetails.profile.firstName, employeeDetails.profile.lastName),
    });
  }, []);

  return (
    <>
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Selection Complete!`} />
      ) : null}

      {!isEmpty(errorResponse) ? <ToastNotification toastType="error" notifMessage={` ${errorResponse}.`} /> : null}

      {!isEmpty(errorPublicationList) ? (
        <ToastNotification toastType="error" notifMessage={`Search Publication: ${errorPublicationList}.`} />
      ) : null}

      {!isEmpty(errorFulfilledPublicationList) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`For Selection Publications: ${errorFulfilledPublicationList}.`}
        />
      ) : null}

      {!isEmpty(errorPendingPublicationList) ? (
        <ToastNotification toastType="error" notifMessage={`Fulfilled Publications: ${errorPendingPublicationList}.`} />
      ) : null}

      <Head>
        <title>Appointing Authority Selection</title>
      </Head>

      <SideNav employeeDetails={employeeDetails} />

      <AppSelectionModal />

      <AppSelAlertConfirmation />

      <AppSelAlertInfo />

      <MainContainer>
        <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
          <ContentHeader
            title="Appointing Authority Selection"
            subtitle="Select an applicant for the position"
            backUrl={`/${router.query.id}`}
          >
            {tab === 1 ? (
              <Button onClick={openModal} className="hidden lg:block" size={`md`}>
                <div className="flex items-center w-full gap-2">
                  <HiSearch /> Find a Publication
                </div>
              </Button>
            ) : null}

            <Button onClick={openModal} className="block lg:hidden" size={`lg`}>
              <div className="flex items-center w-full gap-2">
                <HiSearch />
              </div>
            </Button>
          </ContentHeader>

          {loadingPendingPublicationList && loadingFulfilledPublicationList ? (
            <div className="w-full h-96  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                speed={70}
                thickness={70}
                className="flex w-full h-full transition-all "
                color="slateblue"
                size={100}
              /> */}
            </div>
          ) : (
            <ContentBody>
              <>
                <div className={`w-full flex lg:flex-row flex-col`}>
                  <div className={`lg:w-[58rem] w-full`}>
                    <AppSelectionTabs tab={tab} />
                  </div>
                  <div className="w-full">
                    <AppSelectionTabWindow positionId={employeeDetails.employmentDetails.assignment.positionId} />
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

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();
  // check if user role is not GM
  if (
    employeeDetails.employmentDetails.userRole !== UserRole.GENERAL_MANAGER &&
    employeeDetails.employmentDetails.userRole !== UserRole.OIC_GENERAL_MANAGER
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
