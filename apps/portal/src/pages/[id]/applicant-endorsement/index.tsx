/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
} from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { AppEndAlertController } from '../../../components/fixed/endorsement/AppEndAlertController';
import { Button, Alert } from '@gscwd-apps/oneui';
import useSWR from 'swr';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import AppEndAlert from 'apps/portal/src/components/fixed/endorsement/alert/AppEndAlert';
import AppEndModal from 'apps/portal/src/components/fixed/endorsement/modal/AppEndModal';

export default function ApplicantEndorsement({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // swr pending
  const {
    data: swrPendingPublications,
    isLoading: swrPendingIsLoading,
    error: swrPendingError,
  } = useSWR(
    `applicant-endorsement/publications/${employeeDetails.employmentDetails.userId}/pending`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // swr fulfilled
  const {
    data: swrFulfilledPublications,
    isLoading: swrFulfilledIsLoading,
    error: swrFulfilledError,
  } = useSWR(
    `/applicant-endorsement/publications/${employeeDetails.employmentDetails.userId}/selected`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // pending get
  useEffect(() => {
    if (swrPendingIsLoading) getPendingPublications();
  }, [swrPendingIsLoading]);

  // fulfilled get
  useEffect(() => {
    if (swrFulfilledIsLoading) getFulfilledPublications();
  }, [swrFulfilledIsLoading]);

  // pending publications set
  useEffect(() => {
    if (!isEmpty(swrPendingPublications)) {
      //! changed from pendingPublicationList
      // setPendingPublicationList(swrPendingPublications.data);
      getPendingPublicationsSuccess(swrPendingPublications.data);
    }

    if (!isEmpty(swrPendingError)) getPendingPublicationsFail(swrPendingError);
  }, [swrPendingPublications, swrPendingError]);

  // fulfilled publications set
  useEffect(() => {
    if (!isEmpty(swrFulfilledPublications)) {
      //! changed from fulfilledPublicationList
      // setFulfilledPublicationList(swrFulfilledPublications);
      getFulfilledPublicationsSuccess(swrFulfilledPublications.data);
    }

    if (!isEmpty(swrFulfilledError))
      getFulfilledPublicationsFail(swrFulfilledError);
  }, [swrFulfilledPublications, swrFulfilledError]);

  // call app-end store
  const {
    getPendingPublications,
    getPendingPublicationsFail,
    getPendingPublicationsSuccess,
    getFulfilledPublications,
    getFulfilledPublicationsFail,
    getFulfilledPublicationsSuccess,
    action,
    alert,
    isLoading,
    modal,
    selectedApplicants,
    selectedPublication,
    setAlert,
    setFilteredPublicationList,
    setIsLoading,
    setModal,
    setPublicationList,
    tab,
    setAction,
    setSelectedApplicants,
  } = useAppEndStore((state) => ({
    tab: state.tab,
    alert: state.alert,
    modal: state.modal,
    action: state.action,
    isLoading: state.isLoading,
    selectedApplicants: state.selectedApplicants,
    selectedPublication: state.selectedPublication,
    setAction: state.setAction,
    setSelectedApplicants: state.setSelectedApplicants,
    getPendingPublications: state.getPendingPublications,
    getPendingPublicationsSuccess: state.getPendingPublicationsSuccess,
    getPendingPublicationsFail: state.getPendingPublicationsFail,
    getFulfilledPublications: state.getFulfilledPublications,
    getFulfilledPublicationsSuccess: state.getFulfilledPublicationsSuccess,
    getFulfilledPublicationsFail: state.getFulfilledPublicationsFail,
    setAlert: state.setAlert,
    setIsLoading: state.setIsLoading,
    setModal: state.setModal,
    setPublicationList: state.setPublicationList,
    setFilteredPublicationList: state.setFilteredPublicationList,
  }));

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

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

          <AppEndModal />

          <AppEndAlert />

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
                        <AppEndTabWindow />
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
