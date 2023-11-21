/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { useEmployeeStore } from '../../../store/employee.store';
import useSWR from 'swr';
import { SpinnerDotted } from 'spinners-react';
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { PassSlipTabs } from '../../../../src/components/fixed/passslip/PassSlipTabs';
import { PassSlipTabWindow } from '../../../../src/components/fixed/passslip/PassSlipTabWindow';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import React from 'react';
import { employeeDummy } from '../../../../src/types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import PassSlipApplicationModal from '../../../../src/components/fixed/passslip/PassSlipApplicationModal';
import PassSlipPendingModal from '../../../../src/components/fixed/passslip/PassSlipPendingModal';
import PassSlipCompletedModal from '../../../../src/components/fixed/passslip/PassSlipCompletedModal';
import { isEmpty } from 'lodash';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { getUserDetails, withCookieSession } from '../../../../src/utils/helpers/session';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { useRouter } from 'next/router';

export default function PassSlip({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen,
    loading,
    errorPassSlips,
    errorResponse,
    responsePatch,
    responsePost,
    responseCancel,

    setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen,

    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,
    emptyResponseAndError,
  } = usePassSlipStore((state) => ({
    tab: state.tab,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen: state.completedPassSlipModalIsOpen,
    loading: state.loading.loadingPassSlips,
    errorPassSlips: state.error.errorPassSlips,
    errorResponse: state.error.errorResponse,
    responsePatch: state.response.patchResponse,
    responsePost: state.response.postResponse,
    responseCancel: state.response.cancelResponse,

    setApplyPassSlipModalIsOpen: state.setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen: state.setCompletedPassSlipModalIsOpen,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // open the modal
  const openApplyPassSlipModal = () => {
    if (!applyPassSlipModalIsOpen) {
      setApplyPassSlipModalIsOpen(true);
    }
  };

  // cancel action for Pass Slip Application Modal
  const closeApplyPassSlipModal = async () => {
    setApplyPassSlipModalIsOpen(false);
  };

  // cancel action for Pass Slip Pending Modal
  const closePendingPassSlipModal = async () => {
    setPendingPassSlipModalIsOpen(false);
  };

  // cancel action for Pass Slip Completed Modal
  const closeCompletedPassSlipModal = async () => {
    setCompletedPassSlipModalIsOpen(false);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutatePassSlips,
  } = useSWR(passSlipUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getPassSlipList(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlips)) {
      getPassSlipListSuccess(swrIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrError)) {
      getPassSlipListFail(swrIsLoading, swrError.message);
    }
  }, [swrPassSlips, swrError]);

  useEffect(() => {
    if (!isEmpty(responsePost) || !isEmpty(responseCancel) || !isEmpty(responsePatch)) {
      mutatePassSlips();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [responsePatch, responsePost, responseCancel]);

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
      <>
        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(errorPassSlips) ? (
          <ToastNotification toastType="error" notifMessage={`${errorPassSlips}: Failed to load Pass Slips.`} />
        ) : null}

        {/* Post/Submit Pass Slip Error */}
        {!isEmpty(errorResponse) ? (
          <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
        ) : null}

        {/* Post/Submit Pass Slip Success */}
        {!isEmpty(responsePost) ? (
          <ToastNotification toastType="success" notifMessage="Pass Slip Application Successful!" />
        ) : null}

        {/* Post/Submit Pass Slip Success */}
        {!isEmpty(responsePatch) ? (
          <ToastNotification toastType="success" notifMessage="Pass Slip Dispute Application Successful!" />
        ) : null}

        {/* Cancel Pass Slip Success */}
        {!isEmpty(responseCancel) ? (
          <ToastNotification toastType="success" notifMessage="Pass Slip Cancellation Successful!" />
        ) : null}
      </>

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Pass Slips</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Pass Slip Application Modal */}
        <PassSlipApplicationModal
          modalState={applyPassSlipModalIsOpen}
          setModalState={setApplyPassSlipModalIsOpen}
          closeModalAction={closeApplyPassSlipModal}
        />

        {/* Pass Slip Pending Modal */}
        <PassSlipPendingModal
          modalState={pendingPassSlipModalIsOpen}
          setModalState={setPendingPassSlipModalIsOpen}
          closeModalAction={closePendingPassSlipModal}
        />

        {/* Pass Slip Pending Modal */}
        <PassSlipCompletedModal
          modalState={completedPassSlipModalIsOpen}
          setModalState={setCompletedPassSlipModalIsOpen}
          closeModalAction={closeCompletedPassSlipModal}
        />

        <MainContainer>
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader title="Employee Pass Slips" subtitle="Apply for pass slip" backUrl={`/${router.query.id}`}>
              <Button className="hidden lg:block" size={`md`} onClick={openApplyPassSlipModal}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd /> Apply Pass Slip
                </div>
              </Button>

              <Button className="block lg:hidden" size={`lg`} onClick={openApplyPassSlipModal}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd />
                </div>
              </Button>
            </ContentHeader>

            {loading ? (
              <div className="w-full h-96 static flex flex-col justify-items-center items-center place-items-center">
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
                  <div className={`w-full flex lg:flex-row flex-col`}>
                    <div className={`lg:w-[58rem] w-full`}>
                      <PassSlipTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <PassSlipTabWindow />
                    </div>
                  </div>
                </>
              </ContentBody>
            )}
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
