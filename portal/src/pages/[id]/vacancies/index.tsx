import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { HiNewspaper, HiX } from 'react-icons/hi';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { MessageCard } from '../../../components/modular/common/cards/MessageCard';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import {
  JobOpeningDetails,
  VacancyDetails,
} from '../../../types/vacancies.type';
import { GenerateCaptcha } from '../../../components/fixed/captcha/CaptchaGenerator';
import {
  getJobOpeningDetails,
  checkIfApplied,
  applyJobPost,
  getWorkExp,
} from '../../../utils/helpers/http-requests/applicants-requests';
import { getUserDetails, withSession } from '../../../utils/helpers/session';
import { isEmpty } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from '@gscwd-apps/oneui';
import { JobDetailsPanel } from '../../../components/fixed/vacancies/JobDetailsPanel';
import { VacancyModalController } from '../../../components/fixed/vacancies/VacancyModalController';
import { WorkExperiencePds } from '../../../types/workexp.type';
import { useWorkExpStore } from '../../../../src/store/workexperience.store';

export default function Vacancies({
  data,
  employeeId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState<VacancyDetails>();
  const [mailMessage, setMailMessage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaPassword, setCaptchaPassword] = useState<string>('');
  const [pwdArray, setPwdArray] = useState<string[]>();
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<JobOpeningDetails>();
  const [hasApplied, setHasApplied] = useState<boolean>();
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [workExperience, setWorkExperience] = useState<WorkExperiencePds>();

  // const workExperienceArray = useWorkExpStore((state) => state.workExperience);
  const resetExperience = useWorkExpStore((state) => state.resetWorkExperience);
  const workExperienceArray = useWorkExpStore((state) => state.workExperience);
  const withRelevantExperience = useWorkExpStore(
    (state) => state.withRelevantExperience
  );

  // set state for handling modal page
  const [modal, setModal] = useState({
    isOpen: false,
    page: 1,
    title: '',
    subtitle: '',
  });

  const handlePassword = (e: string) => {
    setPassword(e);
  };

  const handleMessage = async (vacancies: VacancyDetails) => {
    setIsApplied(false); //initial values when opening job basic info
    setHasApplied(false); //initial values when opening job basic info
    setMessageContent(vacancies);
    setPassword('');
    setMailMessage('A job vacancy is available for application.');
    setIsMessageOpen(true);

    const jobOpeningDesc = await getJobOpeningDetails(vacancies.vppId);
    if (jobOpeningDesc) {
      setJobDetails(jobOpeningDesc);
      if (jobOpeningDesc.error) {
        toast.error(jobOpeningDesc.error + '');
      }
    }

    const applicantApplication = await checkIfApplied(
      vacancies.vppId,
      employeeId
    );
    if (applicantApplication.hasApplied) {
      setHasApplied(applicantApplication.hasApplied);
    }
  };

  const handleWorkExperience = async (employeeId: string) => {
    const data = await getWorkExp(employeeId);
    if (data) {
      if (data.error) {
        toast.error(data.error + ' Error');
      } else {
        setWorkExperience(data);
      }
    }
  };

  const openModal = () => {
    // open the prf modal
    setModal({ ...modal, page: 1, isOpen: true });
    setPwdArray([]);
    resetExperience();
  };

  const changeModalPage = (e: number) => {
    //move to specific page of the modal
    setModal({ ...modal, page: e, isOpen: true });
    setIsCaptchaError(false);
    if (e == 1) {
      resetExperience();
    }
    if (e == 2) {
      handleWorkExperience(employeeId);
      setPwdArray([]);
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });
  };

  // set modal main modal action (confirm)
  const modalAction = async () => {
    if (!messageContent) {
      setIsCaptchaError(true);
      setWiggleEffect(true);
      toast.error('Failed to load message contents!');
    } else if (
      password != captchaPassword ||
      password == '' ||
      captchaPassword == ''
    ) {
      setIsCaptchaError(true);
      setWiggleEffect(true);
      toast.error('Incorrect Captcha!');
    } else {
      completeApplication();
    }
  };

  // complete appilcation
  const completeApplication = async () => {
    const data = await applyJobPost(
      messageContent.vppId,
      employeeId,
      withRelevantExperience,
      workExperienceArray
    );
    if (data && data.internalApplicant?.applicantStatus == 'For review') {
      setIsApplied(true);
      setIsCaptchaError(false);
      toast.success('Application Successful!');
      changeModalPage(1);
      console.log(data);
    } else {
      toast.error(data.error.response.data.message);
    }
  };

  // generate captcha
  const getCaptcha = () => {
    const data = GenerateCaptcha();
    if (data) {
      setCaptchaPassword(data.pwd);
      setPwdArray([
        `${data.captcha[0]}`,
        `${data.captcha[1]}`,
        `${data.captcha[2]}`,
        `${data.captcha[3]}`,
        `${data.captcha[4]}`,
        `${data.captcha[5]}`,
      ]);
    }
  };

  return (
    <>
      {data && (
        <div>
          <Head>
            <title>Job Vacancies</title>
          </Head>

          <Modal
            size={'xl'}
            open={modal.isOpen}
            setOpen={() => setModal({ ...modal })}
          >
            <Modal.Header>
              <div className="px-2 flex justify-between items-start">
                <div className="flex flex-col">
                  <label className="font-semibold text-2xl text-gray-700">
                    {messageContent?.positionTitle}
                  </label>
                  <p>{messageContent?.placeOfAssignment}</p>
                </div>

                <button
                  className="hover:bg-slate-100 px-1 h-8 text-2xl rounded-full"
                  onClick={modalCancel}
                >
                  <HiX />
                </button>
              </div>
            </Modal.Header>

            <Modal.Body>
              <VacancyModalController
                page={modal.page}
                dataJobOpening={jobDetails}
                workExperience={workExperience}
              />
            </Modal.Body>

            <Modal.Footer>
              <div className="flex flex-col w-full">
                {modal.page === 1 ? (
                  <div className="flex flex-col items-end w-full">
                    <div
                      className={`${
                        isApplied || hasApplied
                          ? 'bg-green-500 p-2 text-white rounded w-full text-center'
                          : 'hidden'
                      }`}
                    >
                      <label>You have applied for this position.</label>
                    </div>
                    <Button
                      className={`${
                        isApplied || hasApplied ? 'hidden' : 'h-10'
                      }`}
                      onClick={(e) => changeModalPage(2)}
                    >
                      Next
                    </Button>
                  </div>
                ) : modal.page === 2 ? (
                  <div className="flex h-10 justify-between items-center w-full">
                    <div
                      className={`${
                        isApplied || hasApplied
                          ? 'bg-green-500 p-2 text-white rounded w-full text-center'
                          : 'hidden'
                      }`}
                    >
                      <label>You have applied for this position.</label>
                    </div>

                    <div
                      className={`${
                        isApplied || hasApplied
                          ? 'hidden'
                          : 'w-full h-10 flex flex-row gap-3 justify-between'
                      }`}
                    >
                      <div className="flex flex-row gap-2">
                        <Button onClick={(e) => changeModalPage(1)}>
                          Back
                        </Button>
                      </div>
                      <div
                        className={`${
                          isApplied || hasApplied
                            ? 'hidden'
                            : 'flex justify-start items-center text-xs text-red-600'
                        }`}
                      >
                        Warning: Going back or closing the window will reset
                        your entries.
                      </div>
                      {/* <div
                        className={`${
                          isApplied || hasApplied
                            ? 'hidden'
                            : 'flex justify-end items-center text-xs'
                        }`}
                      >
                        Generate and enter the correct Captcha to apply.
                      </div> */}
                      <div className="flex flex-row justify-end gap-2">
                        <Button variant="danger" onClick={getCaptcha}>
                          Generate Captcha
                        </Button>
                        {/* captcha */}
                        <div
                          className={`${
                            pwdArray ? '' : 'animate-pulse'
                          } select-none h-full  px-4 transition-all duration-150 bg-slate-200 text-xl flex flex-row justify-center items-center gap-1`}
                        >
                          <div className="-rotate-12 scale-105 font-medium text-indigo-800 w-4">
                            {pwdArray && pwdArray[0]}
                          </div>
                          <div className="rotate-6 scale-90 font-bold text-sky-800 w-4">
                            {pwdArray && pwdArray[1]}
                          </div>
                          <div className="rotate-45 scale-105 font-light text-red-800 w-4">
                            {pwdArray && pwdArray[2]}
                          </div>
                          <div className="rotate-12 scale-100 font-semibold text-green-800 pr-2 w-4">
                            {pwdArray && pwdArray[3]}
                          </div>
                          <div className="-rotate-45 scale-90 font-bold text-blue-600 w-4">
                            {pwdArray && pwdArray[4]}
                          </div>
                          <div className="-rotate-6 scale-105 font-medium text-stone-800 w-4">
                            {pwdArray && pwdArray[5]}
                          </div>
                        </div>
                        <input
                          type="text"
                          defaultValue=""
                          placeholder="Enter Captcha"
                          className={`${
                            wiggleEffect && 'animate-shake border-red-600'
                          } ${
                            isCaptchaError
                              ? 'border-red-600'
                              : 'border-stone-200'
                          }  w-32 border text-xs`}
                          onAnimationEnd={() => setWiggleEffect(false)}
                          onChange={(e) =>
                            handlePassword(e.target.value as unknown as string)
                          }
                        />
                        <Button onClick={modalAction}>Apply</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-end w-full">
                    <label
                      className={`${
                        isApplied || hasApplied
                          ? 'hidden'
                          : 'pt-2 pb-2 right-0 pr-12'
                      }`}
                    >
                      Generate and enter the correct Captcha to apply.
                    </label>

                    <div
                      className={`${
                        isApplied || hasApplied
                          ? 'bg-green-500 p-2 text-white rounded w-full text-center'
                          : 'hidden'
                      }`}
                    >
                      <label>You have applied for this position.</label>
                    </div>

                    <div
                      className={`${
                        isApplied || hasApplied
                          ? 'hidden'
                          : 'w-full h-10 flex flex-row gap-2 justify-between'
                      }`}
                    >
                      <div className="flex flex-row gap-2">
                        <Button onClick={(e) => changeModalPage(2)}>
                          Back
                        </Button>
                      </div>

                      <div className="flex flex-row justify-end gap-2 w-2/6">
                        <Button variant="danger" onClick={getCaptcha}>
                          Generate
                        </Button>
                        {/* captcha */}
                        <div
                          className={`${
                            pwdArray ? '' : 'animate-pulse'
                          } select-none h-full  px-4 transition-all duration-150 bg-slate-200 text-xl flex flex-row justify-center items-center gap-1`}
                        >
                          <div className="-rotate-12 scale-105 font-medium text-indigo-800 w-4">
                            {pwdArray && pwdArray[0]}
                          </div>
                          <div className="rotate-6 scale-90 font-bold text-sky-800 w-4">
                            {pwdArray && pwdArray[1]}
                          </div>
                          <div className="rotate-45 scale-105 font-light text-red-800 w-4">
                            {pwdArray && pwdArray[2]}
                          </div>
                          <div className="rotate-12 scale-100 font-semibold text-green-800 pr-2 w-4">
                            {pwdArray && pwdArray[3]}
                          </div>
                          <div className="-rotate-45 scale-90 font-bold text-blue-600 w-4">
                            {pwdArray && pwdArray[4]}
                          </div>
                          <div className="-rotate-6 scale-105 font-medium text-stone-800 w-4">
                            {pwdArray && pwdArray[5]}
                          </div>
                        </div>
                        <input
                          type="text"
                          defaultValue=""
                          placeholder="Captcha"
                          className={`${
                            wiggleEffect && 'animate-shake border-red-600'
                          } ${
                            isCaptchaError
                              ? 'border-red-600'
                              : 'border-stone-200'
                          }  w-24 border`}
                          onAnimationEnd={() => setWiggleEffect(false)}
                          onChange={(e) =>
                            handlePassword(e.target.value as unknown as string)
                          }
                        />
                        <Button onClick={modalAction}>Apply</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Footer>
          </Modal>

          <SideNav />
          <MainContainer>
            <ToastContainer
              className={'uppercase text-xs'}
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <div className="w-full h-full flex flex-row pb-10">
              <div className="w-4/5 h-full pr-20 pl-4 overflow-y-scroll flex flex-col">
                Job Vacancies
                {data && data.length > 0 ? (
                  data.map((vacancies: VacancyDetails, messageIdx: number) => {
                    return (
                      <div key={messageIdx}>
                        <MessageCard
                          icon={
                            <HiNewspaper className="w-6 h-6 text-green-800" />
                          }
                          color={`green`}
                          title={vacancies.positionTitle}
                          description={vacancies.occupationName}
                          linkType={'router'}
                          onClick={() => handleMessage(vacancies)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <label className="text-4xl opacity-50 w-full text-center ">
                      NO VACANCIES
                    </label>
                  </div>
                )}
              </div>
              {isEmpty(jobDetails?.error) && jobDetails && messageContent ? (
                <div className="h-full w-full flex flex-col items-center pt-6 mr-4 ml-4 text-gray-700">
                  <div
                    className={`${
                      isMessageOpen
                        ? 'w-full ml-10  mr-10 p-8 flex flex-col bg-white'
                        : 'hidden'
                    }`}
                  >
                    <label className="pb-2">{mailMessage}</label>
                    <JobDetailsPanel
                      data={jobDetails}
                      details={messageContent}
                    />

                    <label className="pt-2 pb-2">
                      Click Details button for more information.
                    </label>
                    <div className="flex flex-row justify-end gap-4">
                      <div
                        className={`${
                          messageContent?.postingDeadline
                            ? ''
                            : 'flex flex-row gap-4 items-center justify-end'
                        }`}
                      >
                        <button
                          className={`w-24 h-10 rounded bg-indigo-500 text-white hover:bg-indigo-600`}
                          onClick={openModal}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col justify-center items-center pt-6 mr-4 ml-4 text-gray-400 text-4xl">
                  NO DATA FOUND
                </div>
              )}
            </div>
          </MainContainer>
        </div>
      )}
    </>
  );
}

//get list of all posted job positions
export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    try {
      const userDetails = getUserDetails(); //get employee details from ssid token - using _id only
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/publications/`
      );
      if (data) {
        return { props: { data, employeeId: userDetails.user._id } };
      } else {
        return { props: {} };
      }
    } catch (error) {
      return { props: {} };
    }
  }
);
