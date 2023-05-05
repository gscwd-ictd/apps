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
import {
  getUserDetails,
  withCookieSession,
} from '../../../utils/helpers/session';
import { isEmpty } from 'lodash';
import {
  AlertNotification,
  Button,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
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

  const {
    errorJobOpening,
    errorIfApplied,
    errorWorkExperience,
    errorApplyJob,
    errorCaptcha,
    errorMessage,
    responseApply,

    setErrorJobOpening,
    setErrorWorkExperience,
    setErrorApplyJob,
    setErrorCaptcha,
    setErrorMessage,
    setResponseApply,
  } = useWorkExpStore((state) => ({
    errorJobOpening: state.error.errorJobOpening,
    errorIfApplied: state.error.errorIfApplied,
    errorWorkExperience: state.error.errorWorkExperience,
    errorApplyJob: state.error.errorApplyJob,
    errorCaptcha: state.error.errorCaptcha,
    errorMessage: state.error.errorMessage,
    responseApply: state.response.responseApplyJob,

    setErrorJobOpening: state.setErrorJobOpening,
    setErrorWorkExperience: state.setErrorWorkExperience,
    setErrorApplyJob: state.setErrorApplyJob,
    setErrorCaptcha: state.setErrorCaptcha,
    setErrorMessage: state.setErrorMessage,
    setResponseApply: state.setResponseApply,
  }));

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
    console.log(jobOpeningDesc);
    if (jobOpeningDesc) {
      setJobDetails(jobOpeningDesc);
      if (jobOpeningDesc.error) {
        setErrorJobOpening(jobOpeningDesc.error + '');
        // toast.error(jobOpeningDesc.error + '');
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
        setErrorWorkExperience(data.error + ' Error');
        // toast.error(data.error + ' Error');
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
      setResponseApply(null);
      setErrorJobOpening(null);
      setErrorWorkExperience(null);
      setErrorApplyJob(null);
      setErrorCaptcha(null);
      setErrorMessage(null);
      setPassword('');
      handleWorkExperience(employeeId);
      setPwdArray([]);
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });
    setResponseApply(null);
    setErrorJobOpening(null);
    setErrorWorkExperience(null);
    setErrorApplyJob(null);
    setErrorCaptcha(null);
    setErrorMessage(null);
    setPassword('');
  };

  // set modal main modal action (confirm)
  const modalAction = async () => {
    setResponseApply(null);
    setErrorJobOpening(null);
    setErrorWorkExperience(null);
    setErrorApplyJob(null);
    setErrorCaptcha(null);
    setErrorMessage(null);
    setTimeout(() => {
      if (!messageContent) {
        setIsCaptchaError(true);
        setWiggleEffect(true);
        setErrorMessage('Failed to load message contents!');
      } else if (
        password != captchaPassword ||
        password == '' ||
        captchaPassword == ''
      ) {
        setIsCaptchaError(true);
        setWiggleEffect(true);
        setErrorCaptcha('Incorrect Captcha!');
      } else {
        completeApplication();
      }
    }, 100);
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
      setResponseApply('Application Successful!');
      changeModalPage(1);
    } else {
      setErrorApplyJob(data.error.response.data.message);
    }
  };

  // generate captcha
  const getCaptcha = () => {
    setPassword('');
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
      {
        //error response from POST if tried to POST with empty supervisor/office
        !isEmpty(errorApplyJob) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorApplyJob}`}
          />
        ) : null
      }

      {!isEmpty(errorIfApplied) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorIfApplied}`}
        />
      ) : null}

      {!isEmpty(errorWorkExperience) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorWorkExperience}`}
        />
      ) : null}

      {!isEmpty(errorJobOpening) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorJobOpening}`}
        />
      ) : null}

      {!isEmpty(errorCaptcha) ? (
        <ToastNotification toastType="error" notifMessage={`${errorCaptcha}`} />
      ) : null}

      {!isEmpty(errorMessage) ? (
        <ToastNotification toastType="error" notifMessage={`${errorMessage}`} />
      ) : null}

      {!isEmpty(responseApply) ? (
        <ToastNotification
          toastType="success"
          notifMessage={`${responseApply}`}
        />
      ) : null}

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
              <div className="flex items-start justify-between px-2">
                <div className="flex flex-col">
                  <label className="text-2xl font-semibold text-gray-700">
                    {messageContent?.positionTitle}
                  </label>
                  <p>{messageContent?.placeOfAssignment}</p>
                </div>

                <button
                  className="h-8 px-1 text-2xl rounded-full hover:bg-slate-100"
                  onClick={modalCancel}
                >
                  <HiX />
                </button>
              </div>
            </Modal.Header>

            <Modal.Body>
              {isApplied || hasApplied ? (
                <AlertNotification
                  alertType="info"
                  notifMessage="You have already applied for this position."
                  dismissible={false}
                />
              ) : null}

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
                  <div className="flex items-center justify-between w-full h-10">
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
                          <div className="w-4 font-medium text-indigo-800 scale-105 -rotate-12">
                            {pwdArray && pwdArray[0]}
                          </div>
                          <div className="w-4 font-bold scale-90 rotate-6 text-sky-800">
                            {pwdArray && pwdArray[1]}
                          </div>
                          <div className="w-4 font-light text-red-800 scale-105 rotate-45">
                            {pwdArray && pwdArray[2]}
                          </div>
                          <div className="w-4 pr-2 font-semibold text-green-800 scale-100 rotate-12">
                            {pwdArray && pwdArray[3]}
                          </div>
                          <div className="w-4 font-bold text-blue-600 scale-90 -rotate-45">
                            {pwdArray && pwdArray[4]}
                          </div>
                          <div className="w-4 font-medium scale-105 -rotate-6 text-stone-800">
                            {pwdArray && pwdArray[5]}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={password}
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

                      <div className="flex flex-row justify-end w-2/6 gap-2">
                        <Button variant="danger" onClick={getCaptcha}>
                          Generate
                        </Button>
                        {/* captcha */}
                        <div
                          className={`${
                            pwdArray ? '' : 'animate-pulse'
                          } select-none h-full  px-4 transition-all duration-150 bg-slate-200 text-xl flex flex-row justify-center items-center gap-1`}
                        >
                          <div className="w-4 font-medium text-indigo-800 scale-105 -rotate-12">
                            {pwdArray && pwdArray[0]}
                          </div>
                          <div className="w-4 font-bold scale-90 rotate-6 text-sky-800">
                            {pwdArray && pwdArray[1]}
                          </div>
                          <div className="w-4 font-light text-red-800 scale-105 rotate-45">
                            {pwdArray && pwdArray[2]}
                          </div>
                          <div className="w-4 pr-2 font-semibold text-green-800 scale-100 rotate-12">
                            {pwdArray && pwdArray[3]}
                          </div>
                          <div className="w-4 font-bold text-blue-600 scale-90 -rotate-45">
                            {pwdArray && pwdArray[4]}
                          </div>
                          <div className="w-4 font-medium scale-105 -rotate-6 text-stone-800">
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
            <div className="flex flex-row w-full h-full pb-10">
              <div className="flex flex-col w-4/5 h-full pl-4 pr-20 overflow-y-scroll">
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
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <label className="w-full text-4xl text-center text-gray-400 ">
                      NO VACANCIES
                    </label>
                  </div>
                )}
              </div>
              {isEmpty(jobDetails?.error) && jobDetails && messageContent ? (
                <div className="flex flex-col items-center w-full h-full pt-6 ml-4 mr-4 text-gray-700">
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
                <div className="flex flex-col items-center justify-center w-full h-full pt-6 ml-4 mr-4 text-4xl text-gray-400">
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
export const getServerSideProps: GetServerSideProps = withCookieSession(
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
