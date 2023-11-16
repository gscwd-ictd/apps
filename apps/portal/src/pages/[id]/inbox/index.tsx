/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
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
import { ToastNotification } from '@gscwd-apps/oneui';
import React from 'react';
import { employeeDummy } from '../../../../src/types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import { isEmpty } from 'lodash';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { getUserDetails, withCookieSession } from '../../../../src/utils/helpers/session';
import { useRouter } from 'next/router';
import { useInboxStore } from '../../../store/inbox.store';
import { InboxTabs } from 'apps/portal/src/components/fixed/inbox/InboxTabs';
import { InboxTabWindow } from 'apps/portal/src/components/fixed/inbox/InboxTabWindow';
import InboxPsbModal from 'apps/portal/src/components/fixed/inbox/InboxPsbModal';
import InboxOvertimeModal from 'apps/portal/src/components/fixed/inbox/InboxOvertimeModal';

export default function PassSlip({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    loadingResponse,
    loadingPsbMessages,
    loadingOvertimeMessages,
    errorOvertimeMessage,
    errorPsbMessage,
    errorResponse,
    patchResponseApply,

    getPsbMessageList,
    getPsbMessageListSuccess,
    getPsbMessageListFail,

    getOvertimeMessageList,
    getOvertimeMessageListSuccess,
    getOvertimeMessageListFail,

    emptyResponseAndError,

    psbMessageModalIsOpen,
    overtimeMessageModalIsOpen,
    trainingMessageModalIsOpen,

    setPsbMessageModalIsOpen,
    setOvertimeMessageModalIsOpen,
    setTrainingMessageModalIsOpen,
  } = useInboxStore((state) => ({
    tab: state.tab,
    loadingResponse: state.loading.loadingResponse,
    loadingPsbMessages: state.loading.loadingPsbMessages,
    loadingOvertimeMessages: state.loading.loadingOvertimeMessages,
    errorPsbMessage: state.error.errorPsbMessages,
    errorOvertimeMessage: state.error.errorOvertimeMessages,
    errorResponse: state.error.errorResponse,
    patchResponseApply: state.response.patchResponseApply,

    getPsbMessageList: state.getPsbMessageList,
    getPsbMessageListSuccess: state.getPsbMessageListSuccess,
    getPsbMessageListFail: state.getPsbMessageListFail,

    getOvertimeMessageList: state.getOvertimeMessageList,
    getOvertimeMessageListSuccess: state.getOvertimeMessageListSuccess,
    getOvertimeMessageListFail: state.getOvertimeMessageListFail,

    emptyResponseAndError: state.emptyResponseAndError,

    psbMessageModalIsOpen: state.psbMessageModalIsOpen,
    overtimeMessageModalIsOpen: state.overtimeMessageModalIsOpen,
    trainingMessageModalIsOpen: state.trainingMessageModalIsOpen,

    setPsbMessageModalIsOpen: state.setPsbMessageModalIsOpen,
    setOvertimeMessageModalIsOpen: state.setOvertimeMessageModalIsOpen,
    setTrainingMessageModalIsOpen: state.setTrainingMessageModalIsOpen,
  }));

  const router = useRouter();

  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const unacknowledgedPsbUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/schedules/${employeeDetails.employmentDetails.userId}/unacknowledged`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPsbMessages,
    isLoading: swrIsLoadingPsbMessages,
    error: swrPsbMessageError,
    mutate: mutateMessages,
  } = useSWR(
    Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? unacknowledgedPsbUrl : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingPsbMessages) {
      getPsbMessageList(swrIsLoadingPsbMessages);
    }
  }, [swrIsLoadingPsbMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPsbMessages)) {
      getPsbMessageListSuccess(swrIsLoadingPsbMessages, swrPsbMessages);
    }

    if (!isEmpty(swrPsbMessageError)) {
      getPsbMessageListFail(swrIsLoadingPsbMessages, swrPsbMessageError.message);
    }
  }, [swrPsbMessages, swrPsbMessageError]);

  const overtimeMessagesUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/employees/${employeeDetails.employmentDetails.userId}/notifications`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrOvertimeMessages,
    isLoading: swrIsLoadingOvertimeMessages,
    error: swrOvertimeMessageError,
    mutate: mutateOvertimeMessages,
  } = useSWR(overtimeMessagesUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingOvertimeMessages) {
      getOvertimeMessageList(swrIsLoadingOvertimeMessages);
    }
  }, [swrIsLoadingOvertimeMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeMessages)) {
      getOvertimeMessageListSuccess(swrIsLoadingOvertimeMessages, swrOvertimeMessages);
    }

    if (!isEmpty(swrOvertimeMessageError)) {
      getOvertimeMessageListFail(swrIsLoadingOvertimeMessages, swrOvertimeMessageError.message);
    }
  }, [swrOvertimeMessages, swrOvertimeMessageError]);

  useEffect(() => {
    if (!isEmpty(patchResponseApply)) {
      mutateMessages();
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [patchResponseApply]);

  const closePsbMessageModal = async () => {
    setPsbMessageModalIsOpen(false);
  };

  const closeOvertimeMessageModal = async () => {
    setOvertimeMessageModalIsOpen(false);
  };

  return (
    <>
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Response to PSB Assignment Submitted.`} />
      ) : null}

      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      {!isEmpty(errorOvertimeMessage) ? (
        <ToastNotification toastType="error" notifMessage={`${errorOvertimeMessage}: Failed to Overtime Inbox.`} />
      ) : null}

      {!isEmpty(errorPsbMessage) ? (
        <ToastNotification toastType="error" notifMessage={`${errorPsbMessage}: Failed to PSB Inbox.`} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Inbox</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Psb Message Modal */}
        <InboxPsbModal
          modalState={psbMessageModalIsOpen}
          setModalState={setPsbMessageModalIsOpen}
          closeModalAction={closePsbMessageModal}
        />

        {/* Overtime Message Modal */}
        <InboxOvertimeModal
          modalState={overtimeMessageModalIsOpen}
          setModalState={setOvertimeMessageModalIsOpen}
          closeModalAction={closeOvertimeMessageModal}
        />

        <MainContainer>
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Employee Inbox"
              subtitle="View messages and notifications"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            {loadingPsbMessages && loadingOvertimeMessages ? (
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
                  <div className={`w-full flex lg:flex-row flex-col`}>
                    <div className={`lg:w-[58rem] w-full`}>
                      <InboxTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <InboxTabWindow />
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
