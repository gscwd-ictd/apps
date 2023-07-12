/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
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
import { Button } from '@gscwd-apps/oneui';
import useSWR from 'swr';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import AppEndAlert from 'apps/portal/src/components/fixed/endorsement/alert/AppEndAlert';
import AppEndModal from 'apps/portal/src/components/fixed/endorsement/modal/AppEndModal';
import { employeeDummy } from '../../../../src/types/employee.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';

export default function ApplicantEndorsement({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // swr pending
  const {
    data: swrPendingPublications,
    isLoading: swrPendingIsLoading,
    error: swrPendingError,
    mutate: swrPendingMutate,
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
    mutate: swrFulfilledMutate,
  } = useSWR(
    `/applicant-endorsement/publications/${employeeDetails.employmentDetails.userId}/selected`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // call app-end store
  const {
    tab,
    modal,
    updateResponse,
    getPendingPublications,
    getPendingPublicationsFail,
    getPendingPublicationsSuccess,
    getFulfilledPublications,
    getFulfilledPublicationsFail,
    getFulfilledPublicationsSuccess,
    setModal,
    emptyResponseAndError,
  } = useAppEndStore((state) => ({
    tab: state.tab,
    modal: state.modal,
    getPendingPublications: state.getPendingPublications,
    getPendingPublicationsSuccess: state.getPendingPublicationsSuccess,
    getPendingPublicationsFail: state.getPendingPublicationsFail,
    getFulfilledPublications: state.getFulfilledPublications,
    getFulfilledPublicationsSuccess: state.getFulfilledPublicationsSuccess,
    getFulfilledPublicationsFail: state.getFulfilledPublicationsFail,
    updateResponse: state.publicationResponse.updateResponse,
    setModal: state.setModal,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // open the modal
  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, []);

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
    if (!isEmpty(swrPendingPublications))
      getPendingPublicationsSuccess(swrPendingPublications.data);

    if (!isEmpty(swrPendingError)) getPendingPublicationsFail(swrPendingError);
  }, [swrPendingPublications, swrPendingError]);

  // fulfilled publications set
  useEffect(() => {
    if (!isEmpty(swrFulfilledPublications))
      getFulfilledPublicationsSuccess(swrFulfilledPublications.data);

    if (!isEmpty(swrFulfilledError))
      getFulfilledPublicationsFail(swrFulfilledError);
  }, [swrFulfilledPublications, swrFulfilledError]);

  // mutate on response
  useEffect(() => {
    if (!isEmpty(updateResponse)) {
      swrPendingMutate();
      swrFulfilledMutate();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [updateResponse]);

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: employeeDetails.user.email,
      fullName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
      initials: UseNameInitials(
        employeeDetails.profile.firstName,
        employeeDetails.profile.lastName
      ),
    });
  }, []);

  return (
    <>
      <>
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Applicant Endorsement</title>
          </Head>

          <SideNav navDetails={navDetails} />

          <AppEndModal />

          <AppEndAlert />

          <MainContainer>
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Applicant Endorsement"
                subtitle="Select a list of endorsed applicants"
              >
                <Button
                  onClick={openModal}
                  className="hidden lg:block"
                  size={`md`}
                >
                  <div className="flex items-center w-full gap-2">
                    <HiSearch /> Find an Endorsement
                  </div>
                </Button>

                <Button
                  onClick={openModal}
                  className="block lg:hidden"
                  size={`lg`}
                >
                  <div className="flex items-center w-full gap-2">
                    <HiSearch />
                  </div>
                </Button>
              </ContentHeader>

              <ContentBody>
                <>
                  <div className={`w-full flex lg:flex-row flex-col`}>
                    <div className={`lg:w-[58rem] w-full`}>
                      <AppEndTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <AppEndTabWindow />
                    </div>
                  </div>
                </>
              </ContentBody>
            </div>
          </MainContainer>
        </EmployeeProvider>
      </>
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

    // check if user role is rank_and_file or job order = kick out
    if (
      employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
      employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER
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
  }
);
