import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiMail } from 'react-icons/hi';
import { withCookieSession, withSession } from '../../../utils/helpers/session';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { MessageCard } from '../../../components/modular/common/cards/MessageCard';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { employeeDummy } from '../../../../src/types/employee.type';
import { PsbMessageContent } from '../../../../src/types/inbox.type';
import useSWR, { mutate } from 'swr';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useInboxStore } from '../../../../src/store/inbox.store';
import { ToastNotification } from '@gscwd-apps/oneui';

export default function Inbox({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const route = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/acknowledge-schedule/`;

  // const [vppId, setVppId] = useState<string>();
  // const [employeeId, setEmployeeId] = useState<string>(employee.employmentDetails.employeeId);
  const [messageContent, setMessageContent] = useState<PsbMessageContent>();
  const [mailMessage, setMailMessage] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);
  const [acknowledgements, setAcknowledgments] = useState<
    Array<PsbMessageContent>
  >([]);

  const {
    loadingMessages,
    loadingResponse,
    errorMessage,
    errorResponse,
    responseApply,

    getMessageList,
    getMessageListSuccess,
    getMessageListFail,

    postMessage,
    postMessageSuccess,
    postMessageFail,
  } = useInboxStore((state) => ({
    loadingMessages: state.loading.loadingMessages,
    loadingResponse: state.loading.loadingResponse,
    errorMessage: state.error.errorMessages,
    errorResponse: state.error.errorResponse,
    responseApply: state.response.postResponseApply,

    getMessageList: state.getMessageList,
    getMessageListSuccess: state.getMessageListSuccess,
    getMessageListFail: state.getMessageListFail,

    postMessage: state.postMessage,
    postMessageSuccess: state.postMessageSuccess,
    postMessageFail: state.postMessageFail,
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
    console.log(swrMessages);
  }, [swrIsLoadingMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrMessages)) {
      getMessageListSuccess(swrIsLoadingMessages, swrMessages);
      console.log(swrMessages, 'test');
    }

    if (!isEmpty(swrError)) {
      getMessageListFail(swrIsLoadingMessages, swrError.message);
    }
  }, [swrMessages, swrError]);

  useEffect(() => {
    if (!isEmpty(responseApply)) {
      mutateMessages();
    }
  }, [responseApply]);

  async function handleResponse(
    selectedVppId: any,
    response: string,
    remarks: string
  ) {
    postMessage();
    try {
      if (response == 'accept') {
        const res = await axios.patch(
          route +
            selectedVppId +
            '/' +
            employeeDetails.employmentDetails.userId +
            '/accept',
          {}
        );
        console.log(res);
        postMessageSuccess('test');
      } else {
        const res = await axios.patch(
          route +
            selectedVppId +
            '/' +
            employeeDetails.employmentDetails.userId +
            '/decline',
          {
            declineReason: remarks,
          }
        );
        console.log(res);
        postMessageSuccess('test');
      }

      setAcknowledgments(swrMessages);
      setIsMessageOpen(false);
    } catch (error) {
      console.log(error);
      postMessageFail(error);
      return [];
    }
  }

  useEffect(() => {
    setAcknowledgments(swrMessages);
  }, []);

  //UPDATE REMARKS ON RESPONSE
  const handleRemarks = (e: string) => {
    setRemarks(e);
  };

  const handleMessage = (acknowledgement: PsbMessageContent) => {
    setMessageContent(acknowledgement);
    setRemarks('');
    setMailMessage(
      'You have been requested to become a member of the Personnel Selection Board for the scheduled interview stated below. Do you accept this task?'
    );
    setIsMessageOpen(true);
    console.log(messageContent);
  };

  return (
    <>
      {/* Pass Slip List Load Failed Error */}
      {errorMessage ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorMessage}: Failed to load messages.`}
        />
      ) : null}

      <Head>
        <title>Messages</title>
      </Head>

      <SideNav />
      <MainContainer>
        <div className="flex flex-row w-full h-full pb-10">
          <div className="flex flex-col w-4/5 h-full pl-4 pr-20 overflow-y-scroll">
            Inbox
            {swrMessages && swrMessages.length > 0 ? (
              swrMessages.map(
                (acknowledgement: PsbMessageContent, messageIdx: number) => {
                  return (
                    <div
                      key={messageIdx}
                      className={`${
                        acknowledgement.acknowledgedSchedule ||
                        acknowledgement.declinedSchedule
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <MessageCard
                        icon={<HiMail className="w-6 h-6 text-green-800" />}
                        color={`green`}
                        title={'Pending Acknowledgement'}
                        description={'Personnel Selection Board'}
                        // children={<></>}
                        linkType={'router'}
                        onClick={() => handleMessage(acknowledgement)}
                      />
                    </div>
                  );
                }
              )
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <label className="text-5xl opacity-50">NO MAIL</label>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center w-full h-full pt-6 ml-4 mr-4 text-gray-700">
            <div
              className={`${
                isMessageOpen ? 'w-100 p-8 flex flex-col bg-white' : 'hidden'
              }`}
            >
              <label className="pb-2">{mailMessage}</label>
              <div>
                <label className="font-bold">Assignment: </label>
                {messageContent?.assignment}
              </div>
              <div>
                <label className="font-bold">Position: </label>
                {messageContent?.positionTitle}
              </div>
              <div>
                <label className="font-bold">Schedule: </label>
                {messageContent?.schedule}
              </div>
              <div>
                <label className="font-bold">Venue: </label>
                {messageContent?.venue}
              </div>

              <div className="pt-4">
                {/* <label className="text-gray-700">Enter remarks before submitting response.</label> */}
                <textarea
                  className="w-full h-32 p-2 border"
                  disabled={
                    messageContent?.acknowledgedSchedule ||
                    messageContent?.declinedSchedule
                      ? true
                      : false
                  }
                  defaultValue={
                    messageContent?.declineReason
                      ? messageContent?.declineReason
                      : 'No Remarks'
                  }
                  placeholder={'Enter reason if you are to decline.'}
                  onChange={(e) =>
                    handleRemarks(e.target.value as unknown as string)
                  }
                ></textarea>
              </div>
              <div
                className={`${
                  messageContent?.acknowledgedSchedule ||
                  messageContent?.declinedSchedule
                    ? 'hidden'
                    : 'flex flex-row gap-4 items-center justify-end'
                }`}
              >
                <button
                  className={`w-20 h-8 rounded bg-indigo-500 text-white hover:bg-indigo-600`}
                  onClick={(e) =>
                    handleResponse(messageContent?.vppId, 'accept', remarks)
                  }
                >
                  Accept
                </button>
                <button
                  className={`${
                    remarks ? '' : 'cursor-not-allowed'
                  } w-20 h-8 rounded bg-red-500 text-white hover:bg-red-600`}
                  disabled={remarks ? false : true}
                  onClick={(e) =>
                    handleResponse(messageContent?.vppId, 'decline', remarks)
                  }
                >
                  Decline
                </button>
              </div>
              <div
                className={`${
                  messageContent?.acknowledgedSchedule
                    ? 'flex flex-row gap-4 items-center justify-center'
                    : 'hidden'
                }`}
              >
                <label className="text-green-700">
                  You have already accepted this assignment.
                </label>
              </div>
              <div
                className={`${
                  messageContent?.declinedSchedule
                    ? 'flex flex-row gap-4 items-center justify-center'
                    : 'hidden'
                }`}
              >
                <label className="text-rose-700">
                  You have already declined this assignment.
                </label>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = withCookieSession(
//   async (context: GetServerSidePropsContext) => {
//     const { data } = await axios.get(
//       `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/schedules/${context.query.id}/unacknowledged`
//     );
//     return { props: { pendingAcknowledgements: data, id: context.query.id } };
//   }
// );

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
