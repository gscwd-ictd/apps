import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiMail } from 'react-icons/hi';
import {
  getUserDetails,
  withCookieSession,
} from '../../../utils/helpers/session';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { MessageCard } from '../../../components/modular/common/cards/MessageCard';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { employeeDummy } from '../../../../src/types/employee.type';
import {
  PsbMembers,
  PsbMessageContent,
} from '../../../../src/types/inbox.type';
import useSWR from 'swr';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useInboxStore } from '../../../../src/store/inbox.store';
import {
  AlertNotification,
  Button,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { SpinnerDotted } from 'spinners-react';

export default function Inbox({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState<PsbMessageContent>();
  const [mailMessage, setMailMessage] = useState<string>('');
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [selectedVppId, setSelectedVppId] = useState<string>(''); // store selected PSB VPP Id for POST
  const [remarks, setRemarks] = useState<string>(''); // store remarks for declining assignment for POST

  const {
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

    submitModalIsOpen,
    setSubmitModalIsOpen,
  } = useInboxStore((state) => ({
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

    submitModalIsOpen: state.submitModalIsOpen,
    setSubmitModalIsOpen: state.setSubmitModalIsOpen,
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
    // console.log(swrMessages, 'test');
  }, [swrIsLoadingMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrMessages)) {
      getMessageListSuccess(swrIsLoadingMessages, swrMessages);
      // console.log(swrMessages, 'success');
    }

    if (!isEmpty(swrError)) {
      getMessageListFail(swrIsLoadingMessages, swrError.message);
      // console.log(swrMessages, 'error');
    }
  }, [swrMessages, swrError]);

  useEffect(() => {
    if (!isEmpty(responseApply)) {
      mutateMessages();
    }
  }, [responseApply]);

  const submitResponseRoute = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/acknowledge-schedule/`;

  async function handleResponse() {
    postMessage();
    try {
      if (isAccepted === true) {
        const res = await axios.patch(
          submitResponseRoute +
            selectedVppId +
            '/' +
            employeeDetails.employmentDetails.userId +
            '/accept',
          {}
        );

        postMessageSuccess(res);
        setRemarks('');
        closeSubmitModalAction();
      } else {
        const res = await axios.patch(
          submitResponseRoute +
            selectedVppId +
            '/' +
            employeeDetails.employmentDetails.userId +
            '/decline',
          {
            declineReason: remarks,
          }
        );

        postMessageSuccess(res);
        setRemarks('');
        closeSubmitModalAction();
      }

      setIsMessageOpen(false);
    } catch (error) {
      console.log(error);
      postMessageFail(error);
      closeSubmitModalAction();
    }
  }

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
  };

  const closeSubmitModalAction = async () => {
    setSubmitModalIsOpen(false);
  };

  const openSubmitModalAction = async (
    selectedVppId: any,
    response: boolean
  ) => {
    setSelectedVppId(selectedVppId);
    setIsAccepted(response);
    setSubmitModalIsOpen(true);
  };

  return (
    <>
      {/* Messages Load Failed Error */}
      {!isEmpty(errorMessage) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorMessage}: Failed to load messages.`}
        />
      ) : null}

      {/* PSB Member Acknowledgement Failed Error */}
      {!isEmpty(errorResponse) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorResponse}: Failed to submit response.`}
        />
      ) : null}

      {/* PSB Member Acknowledgement Success */}
      {!isEmpty(responseApply) ? (
        <ToastNotification
          toastType="success"
          notifMessage={`Response submitted.`}
        />
      ) : null}

      <Head>
        <title>Inbox</title>
      </Head>

      <SideNav />
      <Modal
        size={'sm'}
        open={submitModalIsOpen}
        setOpen={setSubmitModalIsOpen}
      >
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>PSB Member Acknowledgement</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center">
            {isAccepted
              ? 'Are you sure you want accept?'
              : 'Are you sure you want decline?'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button
                variant={'primary'}
                size={'lg'}
                loading={false}
                onClick={(e) => handleResponse()}
              >
                Yes
              </Button>
              <Button
                variant={'danger'}
                size={'lg'}
                loading={false}
                onClick={closeSubmitModalAction}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <MainContainer>
        <div className="flex flex-row w-full h-full pb-10">
          {swrIsLoadingMessages ? (
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
            <>
              <div className="flex flex-col w-4/5 h-full pl-4 pr-20 overflow-y-scroll">
                Inbox
                {swrMessages && swrMessages.length > 0 ? (
                  swrMessages.map(
                    (
                      acknowledgement: PsbMessageContent,
                      messageIdx: number
                    ) => {
                      return (
                        <div
                          key={messageIdx}
                          className={`${
                            acknowledgement.details.acknowledgedSchedule ||
                            acknowledgement.details.declinedSchedule
                              ? 'opacity-50'
                              : ''
                          }`}
                        >
                          <MessageCard
                            icon={<HiMail className="w-6 h-6 text-green-800" />}
                            color={`green`}
                            title={'PSB Member Acknowledgement'}
                            description={`Position: ${acknowledgement.details.positionTitle}`}
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
                    <label className="text-5xl text-slate-300">EMPTY</label>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center w-full h-full pt-6 ml-4 mr-4 text-gray-700">
                {isMessageOpen ? (
                  <div
                    className={'w-100 pl-8 pr-8 pt-1 flex flex-col bg-white'}
                  >
                    {messageContent?.details.acknowledgedSchedule ? (
                      <AlertNotification
                        alertType="success"
                        notifMessage={'You have accepted this assignment'}
                        dismissible={false}
                      />
                    ) : null}

                    {messageContent?.details.declinedSchedule ? (
                      <AlertNotification
                        alertType="info"
                        notifMessage={'You have declined this assignment'}
                        dismissible={false}
                      />
                    ) : null}

                    {!messageContent?.details.acknowledgedSchedule &&
                    !messageContent?.details.declinedSchedule ? (
                      <AlertNotification
                        alertType="warning"
                        notifMessage={'Awaiting action'}
                        dismissible={false}
                      />
                    ) : null}

                    <label className="pb-2">{mailMessage}</label>
                    <div>
                      <label className="font-bold">Assignment: </label>
                      {messageContent?.details.assignment}
                    </div>
                    <div>
                      <label className="font-bold">Position: </label>
                      {messageContent?.details.positionTitle}
                    </div>
                    <div>
                      <label className="font-bold">Schedule: </label>
                      {messageContent?.details.schedule}
                    </div>
                    <div>
                      <label className="font-bold">Venue: </label>
                      {messageContent?.details.venue}
                    </div>
                    <div>
                      <label className="font-bold">PSB Members: </label>
                      <ul>
                        {messageContent.psbMembers.map(
                          (member: PsbMembers, messageIdx: number) => {
                            return (
                              <li className="indent-4" key={messageIdx}>
                                {member.fullName}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <label className="font-bold">
                        Remarks:{' '}
                        {messageContent?.details.acknowledgedSchedule ||
                        messageContent?.details.declinedSchedule ? null : (
                          <label className={`font-normal text-sm text-red-500`}>
                            * required if declined
                          </label>
                        )}
                      </label>

                      <textarea
                        className={`
                        w-full h-32 p-2 border resize-none
                    `}
                        disabled={
                          messageContent?.details.acknowledgedSchedule ||
                          messageContent?.details.declinedSchedule
                            ? true
                            : false
                        }
                        value={
                          messageContent?.details.acknowledgedSchedule
                            ? 'N/A'
                            : messageContent?.details.declinedSchedule
                            ? messageContent.details.declineReason
                            : remarks
                        }
                        placeholder={
                          'If declining, please state reason and indicate personnel you recommend to be your replacement.'
                        }
                        onChange={(e) =>
                          handleRemarks(e.target.value as unknown as string)
                        }
                      ></textarea>
                    </div>
                    <div
                      className={`${
                        messageContent?.details.acknowledgedSchedule ||
                        messageContent?.details.declinedSchedule
                          ? 'hidden'
                          : 'flex flex-row gap-4 items-center justify-end'
                      }`}
                    >
                      <Button
                        variant={'primary'}
                        size={'md'}
                        onClick={(e) =>
                          openSubmitModalAction(
                            messageContent?.details.vppId,
                            true
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant={'danger'}
                        size={'md'}
                        disabled={remarks ? false : true}
                        onClick={(e) =>
                          openSubmitModalAction(
                            messageContent?.details.vppId,
                            false
                          )
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <label className="text-5xl text-slate-300">NO DATA</label>
                  </div>
                )}
              </div>
            </>
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
