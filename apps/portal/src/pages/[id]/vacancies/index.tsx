/* eslint-disable @nx/enforce-module-boundaries */
import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiNewspaper, HiX } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
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
import { employeeDummy } from '../../../../src/types/employee.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';

export default function Vacancies({
  data,
  employeeId,
  employeeDetails,
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
    emptyResponseAndError,
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
    emptyResponseAndError: state.emptyResponseAndError,
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
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    } else {
      setErrorApplyJob(data.error.response.data.message);
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
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

  const { windowWidth } = UseWindowDimensions();

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
            size={`${windowWidth > 768 ? 'xl' : 'full'}`}
            open={modal.isOpen}
            setOpen={() => setModal({ ...modal })}
          >
            <Modal.Header>
              <div className="flex items-start justify-between px-2">
                <div className="flex flex-col">
                  <label className="text-xl md:text-2xl font-semibold text-gray-700">
                    {messageContent?.positionTitle}
                  </label>
                  <p className="text-md">{messageContent?.placeOfAssignment}</p>
                </div>

                <button
                  className="h-8 px-1 text-xl outline-slate-100 outline-8 rounded-full hover:bg-slate-100"
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

            <Modal.Footer
              className={`${modal.page === 2 ? 'h-36' : 'h-auto'} md:h-auto`}
            >
              <div className="flex flex-col justify-center w-full h-full">
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
                          : 'w-full h-10 flex flex-row gap-3 justify-between items-center'
                      }`}
                    >
                      <Button onClick={(e) => changeModalPage(1)}>Back</Button>

                      <div
                        className={`${
                          isApplied || hasApplied
                            ? 'hidden'
                            : 'hidden lg:flex justify-start items-center text-xs text-red-600'
                        }`}
                      >
                        Warning: Going back or closing the window will reset
                        your entries.
                      </div>

                      <div className="flex w-36 md:w-auto flex-col md:flex-row justify-end gap-2">
                        <Button
                          variant="danger"
                          onClick={getCaptcha}
                          size={`${windowWidth > 768 ? 'md' : 'sm'}`}
                        >
                          Generate Captcha
                        </Button>
                        {/* captcha */}
                        <div
                          className={`${
                            pwdArray ? '' : 'animate-pulse'
                          } select-none h-10 px-4 py-1 transition-all duration-150 bg-slate-200 text-xl flex lex-rowf justify-center items-center gap-1`}
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
                          }  md:w-28 border text-xs`}
                          onAnimationEnd={() => setWiggleEffect(false)}
                          onChange={(e) =>
                            handlePassword(e.target.value as unknown as string)
                          }
                        />
                      </div>
                      <Button onClick={modalAction}>Apply</Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Modal.Footer>
          </Modal>

          <SideNav navDetails={navDetails} />
          <MainContainer>
            <div className="flex flex-col md:flex-row w-full h-full pb-10 px-4 md:px-0">
              <div className="flex flex-col w-full pb-5 px-8 md:px-0 md:w-full h-1/2 md:h-full md:pl-4 md:pr-20 overflow-y-auto">
                <label className="pb-4">Job Vacancies</label>
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
                  <div className="bg-slate-50 flex flex-col justify-center items-center w-full pb-5 px-8 md:px-0 md:w-full h-80 md:h-full md:pl-4 md:pr-20 overflow-y-auto">
                    <label className="w-full text-4xl text-center text-gray-400 ">
                      NO VACANCIES
                    </label>
                  </div>
                )}
              </div>
              {isEmpty(jobDetails?.error) && jobDetails && messageContent ? (
                <div className="flex flex-col items-center w-full h-1/2 md:h-full pt-1 md:pt-6 md:ml-4 md:mr-4 text-gray-700">
                  <div
                    className={`${
                      isMessageOpen
                        ? 'w-full md:ml-10 md:mr-10 p-8 flex flex-col bg-white'
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
                <div className="text-center flex flex-col items-center justify-center w-full h-1/2 md:h-full pt-1 md:pt-6 md:ml-4 md:mr-4 text-4xl text-gray-400">
                  NO JOB POSTING SELECTED
                </div>
              )}
            </div>
          </MainContainer>
        </div>
      )}
    </>
  );
}

//use for dummy login only
// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   try {
//     const userDetails = employeeDummy;
//     const { data } = await axios.get(
//       `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/publications/`
//     );
//     if (data) {
//       return { props: { data, employeeId: userDetails.user._id } };
//     } else {
//       return { props: {} };
//     }
//   } catch (error) {
//     return { props: {} };
//   }
// };

//get list of all posted job positions
export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    try {
      const userDetails = getUserDetails(); //get employee details from ssid token - using _id only
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/publications/`
      );
      if (data) {
        return {
          props: {
            data,
            employeeId: userDetails.user._id,
            employeeDetails: userDetails,
          },
        };
      } else {
        return { props: {} };
      }
    } catch (error) {
      return { props: {} };
    }
  }
);
