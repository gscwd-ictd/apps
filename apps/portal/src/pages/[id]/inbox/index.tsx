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
import 'react-toastify/dist/ReactToastify.css';
import { isEmpty, isEqual } from 'lodash';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useRouter } from 'next/router';
import { useInboxStore } from '../../../store/inbox.store';
import { InboxTabs } from 'apps/portal/src/components/fixed/inbox/InboxTabs';
import { InboxTabWindow } from 'apps/portal/src/components/fixed/inbox/InboxTabWindow';
import InboxPsbModal from 'apps/portal/src/components/fixed/inbox/InboxPsbModal';
import InboxOvertimeModal from 'apps/portal/src/components/fixed/inbox/InboxOvertimeModal';
import InboxTrainingModal from 'apps/portal/src/components/fixed/inbox/InboxTrainingModal';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';

export default function PassSlip({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    loadingPsbMessages,
    loadingOvertimeMessages,
    loadingTrainingMessages,
    errorOvertimeMessages,
    errorPsbMessages,
    errorTrainingMessages,
    errorResponse,
    patchResponseApply,
    putResponseApply,
    getPsbMessageList,
    getPsbMessageListSuccess,
    getPsbMessageListFail,

    getOvertimeMessageList,
    getOvertimeMessageListSuccess,
    getOvertimeMessageListFail,

    getTrainingMessageList,
    getTrainingMessageListSuccess,
    getTrainingMessageListFail,

    emptyResponseAndError,
    setDeclineRemarks,

    psbMessageModalIsOpen,
    overtimeMessageModalIsOpen,
    trainingMessageModalIsOpen,

    setPsbMessageModalIsOpen,
    setOvertimeMessageModalIsOpen,
    setTrainingMessageModalIsOpen,
  } = useInboxStore((state) => ({
    tab: state.tab,
    loadingPsbMessages: state.loading.loadingPsbMessages,
    loadingOvertimeMessages: state.loading.loadingOvertimeMessages,
    loadingTrainingMessages: state.loading.loadingTrainingMessages,
    errorPsbMessages: state.error.errorPsbMessages,
    errorOvertimeMessages: state.error.errorOvertimeMessages,
    errorTrainingMessages: state.error.errorTrainingMessages,
    errorResponse: state.error.errorResponse,
    patchResponseApply: state.response.patchResponseApply,
    putResponseApply: state.response.putResponseApply,

    getPsbMessageList: state.getPsbMessageList,
    getPsbMessageListSuccess: state.getPsbMessageListSuccess,
    getPsbMessageListFail: state.getPsbMessageListFail,

    getOvertimeMessageList: state.getOvertimeMessageList,
    getOvertimeMessageListSuccess: state.getOvertimeMessageListSuccess,
    getOvertimeMessageListFail: state.getOvertimeMessageListFail,

    getTrainingMessageList: state.getTrainingMessageList,
    getTrainingMessageListSuccess: state.getTrainingMessageListSuccess,
    getTrainingMessageListFail: state.getTrainingMessageListFail,

    emptyResponseAndError: state.emptyResponseAndError,
    setDeclineRemarks: state.setDeclineRemarks,

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
    mutate: mutatePsbMessages,
  } = useSWR(
    Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? unacknowledgedPsbUrl : null,
    fetchWithToken
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
  } = useSWR(overtimeMessagesUrl, fetchWithToken);

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

  const trainingMessagesUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/employees/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrTrainingMessages,
    isLoading: swrIsLoadingTrainingMessages,
    error: swrTrainingMessageError,
    mutate: mutateTrainingMessages,
  } = useSWR(
    employeeDetails.employmentDetails.userId &&
      !isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
      !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER)
      ? trainingMessagesUrl
      : null,
    fetchWithToken
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingTrainingMessages) {
      getTrainingMessageList(swrIsLoadingTrainingMessages);
    }
  }, [swrIsLoadingTrainingMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingMessages)) {
      getTrainingMessageListSuccess(swrIsLoadingTrainingMessages, swrTrainingMessages);
    }

    if (!isEmpty(swrTrainingMessageError)) {
      getTrainingMessageListFail(swrIsLoadingTrainingMessages, swrTrainingMessageError.message);
    }
  }, [swrTrainingMessages, swrTrainingMessageError]);

  useEffect(() => {
    if (!isEmpty(patchResponseApply) || !isEmpty(putResponseApply)) {
      mutatePsbMessages();
      mutateTrainingMessages();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseApply, putResponseApply]);

  useEffect(() => {
    if (psbMessageModalIsOpen || overtimeMessageModalIsOpen || trainingMessageModalIsOpen) {
      setDeclineRemarks('');
    }
  }, [psbMessageModalIsOpen, overtimeMessageModalIsOpen, trainingMessageModalIsOpen]);

  const closePsbMessageModal = async () => {
    setPsbMessageModalIsOpen(false);
    setDeclineRemarks('');
  };

  const closeOvertimeMessageModal = async () => {
    setOvertimeMessageModalIsOpen(false);
    setDeclineRemarks('');
  };

  const closeTrainingMessageModal = async () => {
    setTrainingMessageModalIsOpen(false);
    setDeclineRemarks('');
  };

  return (
    <>
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Response to PSB Assignment Submitted.`} />
      ) : null}

      {!isEmpty(putResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Response to Training Nomination Submitted.`} />
      ) : null}

      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      {!isEmpty(errorOvertimeMessages) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorOvertimeMessages}: Failed to load Overtime Inbox.`}
        />
      ) : null}

      {!isEmpty(errorPsbMessages) ? (
        <ToastNotification toastType="error" notifMessage={`${errorPsbMessages}: Failed to load PSB Inbox.`} />
      ) : null}

      {!isEmpty(errorTrainingMessages) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorTrainingMessages}: Failed to load Training Inbox.`}
        />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Inbox</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Training Message Modal */}
        <InboxTrainingModal
          modalState={trainingMessageModalIsOpen}
          setModalState={setTrainingMessageModalIsOpen}
          closeModalAction={closeTrainingMessageModal}
        />

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
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Employee Inbox"
              subtitle="View messages and notifications"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            {loadingPsbMessages && loadingOvertimeMessages && loadingTrainingMessages ? (
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
                <div className={`w-full flex lg:flex-row flex-col`}>
                  <div className={`lg:w-[58rem] w-full`}>
                    <InboxTabs tab={tab} />
                  </div>
                  <div className="w-full">
                    <InboxTabWindow />
                  </div>
                </div>
              </ContentBody>
            )}
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
