import Head from 'next/head';
import { useEffect } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
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
import {
  getUserDetails,
  withCookieSession,
} from '../../../../src/utils/helpers/session';
import useWindowDimensions from '../../../../src/components/fixed/window-size/useWindowDimensions';

export default function PassSlip({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen,
    loading,
    errorPassSlips,
    errorResponse,
    responseApply,
    responseCancel,

    setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen,

    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,
  } = usePassSlipStore((state) => ({
    tab: state.tab,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen: state.completedPassSlipModalIsOpen,
    loading: state.loading.loadingPassSlips,
    errorPassSlips: state.error.errorPassSlips,
    errorResponse: state.error.errorResponse,
    responseApply: state.response.postResponseApply,
    responseCancel: state.response.deleteResponseCancel,

    setApplyPassSlipModalIsOpen: state.setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen: state.setCompletedPassSlipModalIsOpen,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,
  }));

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
    console.log(swrPassSlips, 'passslips');
    if (!isEmpty(swrPassSlips)) {
      getPassSlipListSuccess(swrIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrError)) {
      getPassSlipListFail(swrIsLoading, swrError.message);
    }
  }, [swrPassSlips, swrError]);

  useEffect(() => {
    if (!isEmpty(responseApply) || !isEmpty(responseCancel)) {
      mutatePassSlips();
    }
  }, [responseApply, responseCancel]);

  const { windowWidth } = useWindowDimensions();

  return (
    <>
      <>
        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(errorPassSlips) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorPassSlips}: Failed to load Pass Slips.`}
          />
        ) : null}

        {/* Post/Submit Pass Slip Error */}
        {!isEmpty(errorResponse) ? (
          <ToastNotification toastType="error" notifMessage={errorResponse} />
        ) : null}

        {/* Post/Submit Pass Slip Success */}
        {!isEmpty(responseApply) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Pass Slip Application Successful! Please wait for supervisor's decision on this application"
          />
        ) : null}
      </>

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Pass Slips</title>
        </Head>

        <SideNav />

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
          <div
            className={`w-full h-full  ${
              windowWidth > 1024 ? 'pl-32 pr-32 ' : 'pl-24 pr-4'
            }`}
          >
            <ContentHeader
              title="Employee Pass Slips"
              subtitle="Apply for pass slip"
            >
              <Button
                size={`${windowWidth > 1024 ? 'md' : 'lg'}`}
                onClick={openApplyPassSlipModal}
              >
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd />{' '}
                  {windowWidth > 1024 ? 'Apply Pass Slip' : ''}
                </div>
              </Button>
            </ContentHeader>

            {loading ? (
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            ) : (
              <ContentBody>
                <>
                  <div
                    className={`w-full ${
                      windowWidth > 1024 ? 'flex' : 'flex-col'
                    }`}
                  >
                    <div
                      className={` ${
                        windowWidth > 1024 ? 'w-[58rem]' : 'w-full'
                      }`}
                    >
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withCookieSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
