import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiMail } from 'react-icons/hi';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import SideNav from '../../../components/fixed/nav/SideNav';
import { MessageCard } from '../../../components/modular/common/cards/MessageCard';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { employeeDummy } from '../../../../src/types/employee.type';
import { PsbMessageContent } from '../../../../src/types/inbox.type';
import useSWR from 'swr';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useInboxStore } from '../../../../src/store/inbox.store';
import { ToastNotification } from '@gscwd-apps/oneui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InboxMessageType } from 'libs/utils/src/lib/enums/inbox.enum';
import { InboxPsbContent } from 'apps/portal/src/components/fixed/inbox/InboxPsbContent';
import { ConfirmationInboxModal } from 'apps/portal/src/components/fixed/inbox/ConfirmationModal';
import { InboxTrainingContent } from 'apps/portal/src/components/fixed/inbox/InboxTrainingContent';
import { InboxOvertimeContent } from 'apps/portal/src/components/fixed/inbox/InboxOvertimeContent';

export default function Inbox({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState<PsbMessageContent>();
  const [mailMessage, setMailMessage] = useState<string>('');
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [selectedVppId, setSelectedVppId] = useState<string>(''); // store selected PSB VPP Id for POST
  const [remarks, setRemarks] = useState<string>(''); // store remarks for declining assignment for POST

  const {
    loadingResponse,
    errorMessage,
    errorResponse,
    patchResponseApply,

    getMessageList,
    getMessageListSuccess,
    getMessageListFail,

    patchInboxReponse,
    patchInboxReponseSuccess,
    patchInboxReponseFail,

    confirmModalIsOpen,
    setConfirmModalIsOpen,
    emptyResponseAndError,

    setMessagePsb,
    setMessageOvertime,
    setDeclineRemarks,
    selectedMessageType,
    setSelectedMessageType,
    isMessageOpen,
    setIsMessageOpen,
  } = useInboxStore((state) => ({
    loadingResponse: state.loading.loadingResponse,
    errorMessage: state.error.errorMessages,
    errorResponse: state.error.errorResponse,
    patchResponseApply: state.response.patchResponseApply,

    getMessageList: state.getMessageList,
    getMessageListSuccess: state.getMessageListSuccess,
    getMessageListFail: state.getMessageListFail,

    patchInboxReponse: state.patchInboxReponse,
    patchInboxReponseSuccess: state.patchInboxReponseSuccess,
    patchInboxReponseFail: state.patchInboxReponseFail,

    confirmModalIsOpen: state.confirmModalIsOpen,
    setConfirmModalIsOpen: state.setConfirmModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,

    setMessagePsb: state.setMessagePsb,
    setMessageOvertime: state.setMessageOvertime,
    setDeclineRemarks: state.setDeclineRemarks,
    selectedMessageType: state.selectedMessageType,
    setSelectedMessageType: state.setSelectedMessageType,
    isMessageOpen: state.isMessageOpen,
    setIsMessageOpen: state.setIsMessageOpen,
  }));

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
    data: swrMessages,
    isLoading: swrIsLoadingMessages,
    error: swrError,
    mutate: mutateMessages,
  } = useSWR(unacknowledgedPsbUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingMessages) {
      getMessageList(swrIsLoadingMessages);
    }
  }, [swrIsLoadingMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrMessages)) {
      getMessageListSuccess(swrIsLoadingMessages, swrMessages);
    }

    if (!isEmpty(swrError)) {
      getMessageListFail(swrIsLoadingMessages, swrError.message);
    }
  }, [swrMessages, swrError]);

  useEffect(() => {
    if (!isEmpty(patchResponseApply)) {
      mutateMessages();
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [patchResponseApply]);

  const handleMessage = (acknowledgement?: PsbMessageContent, type?: string) => {
    let sampleType = type;
    if (sampleType == InboxMessageType.PSB) {
      setSelectedMessageType(InboxMessageType.PSB);
      setMessagePsb(acknowledgement);
    } else if (sampleType == InboxMessageType.TRAINING_NOMINATION) {
      setSelectedMessageType(InboxMessageType.TRAINING_NOMINATION);
      // setMessagePsb(acknowledgement);
    } else if (sampleType == InboxMessageType.OVERTIME) {
      setSelectedMessageType(InboxMessageType.OVERTIME);
      // setMessageOvertime(acknowledgement);
    }
    setDeclineRemarks('');
    setIsMessageOpen(true);
  };

  const closeConfirmModalAction = async () => {
    setConfirmModalIsOpen(false);
  };

  return (
    <>
      {/* Messages Load Failed Error */}
      {!isEmpty(errorMessage) ? (
        <ToastNotification toastType="error" notifMessage={`${errorMessage}: Failed to load messages.`} />
      ) : null}

      {/* PSB Member Acknowledgement Failed Error */}
      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to submit response.`} />
      ) : null}

      {/* PSB Member Acknowledgement Success */}
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Response submitted.`} />
      ) : null}

      <Head>
        <title>Inbox</title>
      </Head>

      <SideNav employeeDetails={employeeDetails} />

      <ConfirmationInboxModal
        modalState={confirmModalIsOpen}
        setModalState={setConfirmModalIsOpen}
        closeModalAction={closeConfirmModalAction}
      />

      <MainContainer>
        <div className="flex flex-col w-full h-full px-4 pb-10 md:flex-row md:px-0">
          <div className="flex flex-col w-full px-8 pb-5 overflow-y-auto md:px-0 md:w-full h-1/2 md:h-full md:pl-4 md:pr-20">
            <label className="pb-4">Inbox</label>
            {swrMessages && swrMessages.length > 0 ? (
              swrMessages.map((acknowledgement: PsbMessageContent, messageIdx: number) => {
                return (
                  <div
                    key={messageIdx}
                    className={`${
                      acknowledgement.details.acknowledgedSchedule || acknowledgement.details.declinedSchedule
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    <MessageCard
                      icon={<HiMail className="w-6 h-6 text-green-800" />}
                      color={`green`}
                      title={'PSB Member Acknowledgement'}
                      description={`Position: ${acknowledgement.details.positionTitle}`}
                      linkType={'router'}
                      onClick={() => handleMessage(acknowledgement, 'psb')}
                    />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center w-full px-8 pb-5 overflow-y-auto bg-slate-50 md:px-0 md:w-full h-80 md:h-full md:pl-4 md:pr-20">
                <label className="w-full text-4xl text-center text-gray-400 ">NO MESSAGES</label>
              </div>
            )}
            <MessageCard
              icon={<HiMail className="w-6 h-6 text-green-800" />}
              color={`green`}
              title={'Training Nomination'}
              description={`Course Title: Sample Training`}
              linkType={'router'}
              onClick={() => handleMessage({} as PsbMessageContent, 'training')}
            />

            <MessageCard
              icon={<HiMail className="w-6 h-6 text-green-800" />}
              color={`green`}
              title={'Overtime Assignment'}
              description={`Estimated Hours: 4 `}
              linkType={'router'}
              onClick={() => handleMessage({} as PsbMessageContent, 'overtime')}
            />
          </div>
          {isMessageOpen ? (
            <div className="flex flex-col items-center w-full pt-1 text-gray-700 h-1/2 md:h-full md:pt-6 md:ml-4 md:mr-4 rounded-xl">
              {selectedMessageType == InboxMessageType.PSB ? <InboxPsbContent /> : null}
              {selectedMessageType == InboxMessageType.TRAINING_NOMINATION ? <InboxTrainingContent /> : null}
              {selectedMessageType == InboxMessageType.OVERTIME ? <InboxOvertimeContent /> : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full pt-1 text-4xl text-center text-gray-400 h-1/2 md:h-full md:pt-6 md:ml-4 md:mr-4">
              NO MESSAGE SELECTED
            </div>
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

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
