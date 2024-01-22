/* eslint-disable @nx/enforce-module-boundaries */
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiNewspaper, HiX } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
import { MessageCard } from '../../../components/modular/common/cards/MessageCard';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { JobOpeningDetails, VacancyDetails } from '../../../types/vacancies.type';
import {
  getJobOpeningDetails,
  checkIfApplied,
  getWorkExp,
} from '../../../utils/helpers/http-requests/applicants-requests';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { isEmpty } from 'lodash';
import { AlertNotification, Button, CaptchaModal, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { JobDetailsPanel } from '../../../components/fixed/vacancies/JobDetailsPanel';
import { VacancyModalController } from '../../../components/fixed/vacancies/VacancyModalController';
import { WorkExperiencePds } from '../../../types/workexp.type';
import { useWorkExpStore } from '../../../store/workexperience.store';
import { employeeDummy } from '../../../types/employee.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { useRouter } from 'next/router';
import { JobApplicationCaptcha } from 'apps/portal/src/components/fixed/vacancies/JobApplicationCaptcha';

export default function Vacancies({
  data,
  employeeId,
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState<VacancyDetails>();
  const [mailMessage, setMailMessage] = useState<string>('');
  const [isMessageOpen, setIsMessageOpen] = useState<boolean>(false);
  const [jobDetails, setJobDetails] = useState<JobOpeningDetails>();
  const [workExperience, setWorkExperience] = useState<WorkExperiencePds>();

  const {
    errorJobOpening,
    errorIfApplied,
    errorWorkExperience,
    errorApplyJob,
    errorCaptcha,
    errorMessage,
    responseApply,
    captchaModalIsOpen,
    hasApplied,
    modal,
    withRelevantExperience,
    workExperienceArray,
    resetExperience,
    setModal,
    setCaptchaModalIsOpen,
    setErrorJobOpening,
    setErrorWorkExperience,
    setErrorApplyJob,
    setErrorCaptcha,
    setErrorMessage,
    emptyResponseAndError,
    setHasApplied,
  } = useWorkExpStore((state) => ({
    errorJobOpening: state.error.errorJobOpening,
    errorIfApplied: state.error.errorIfApplied,
    errorWorkExperience: state.error.errorWorkExperience,
    errorApplyJob: state.error.errorApplyJob,
    errorCaptcha: state.error.errorCaptcha,
    errorMessage: state.error.errorMessage,
    responseApply: state.response.responseApplyJob,
    captchaModalIsOpen: state.captchaModalIsOpen,
    hasApplied: state.hasApplied,
    modal: state.modal,
    withRelevantExperience: state.withRelevantExperience,
    workExperienceArray: state.workExperience,
    resetExperience: state.resetWorkExperience,
    setModal: state.setModal,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen,
    setErrorJobOpening: state.setErrorJobOpening,
    setErrorWorkExperience: state.setErrorWorkExperience,
    setErrorApplyJob: state.setErrorApplyJob,
    setErrorCaptcha: state.setErrorCaptcha,
    setErrorMessage: state.setErrorMessage,
    emptyResponseAndError: state.emptyResponseAndError,
    setHasApplied: state.setHasApplied,
  }));

  const router = useRouter();

  const handleMessage = async (vacancies: VacancyDetails) => {
    setHasApplied(false); //initial values when opening job basic info
    setMessageContent(vacancies);
    setMailMessage('A job vacancy is available for application.');
    setIsMessageOpen(true);

    const jobOpeningDesc = await getJobOpeningDetails(vacancies.vppId);

    if (jobOpeningDesc) {
      setJobDetails(jobOpeningDesc);
      if (jobOpeningDesc.error) {
        setErrorJobOpening(jobOpeningDesc.error + '');
      }
    }

    const applicantApplication = await checkIfApplied(vacancies.vppId, employeeId);
    if (applicantApplication.hasApplied) {
      setHasApplied(applicantApplication.hasApplied);
    }
  };

  const handleWorkExperience = async (employeeId: string) => {
    const data = await getWorkExp(employeeId);

    if (data) {
      if (data.error) {
        setErrorWorkExperience(data.error + ' Error');
      } else {
        setWorkExperience(data);
      }
    }
  };

  const openModal = () => {
    // open the prf modal
    setModal({ page: 1, isOpen: true });
    resetExperience();
  };

  const changeModalPage = (e: number) => {
    //move to specific page of the modal
    setModal({ page: e, isOpen: true });
    if (e == 1) {
      resetExperience();
      setErrorJobOpening(null);
      setErrorWorkExperience(null);
      // setErrorApplyJob(null);
      setErrorCaptcha(null);
      setErrorMessage(null);
    }
    if (e == 2) {
      // setErrorJobOpening(null);
      // setErrorWorkExperience(null);
      // setErrorApplyJob(null);
      // setErrorCaptcha(null);
      // setErrorMessage(null);
      handleWorkExperience(employeeId);
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });

    setErrorJobOpening(null);
    setErrorWorkExperience(null);
    // setErrorApplyJob(null);
    setErrorCaptcha(null);
    setErrorMessage(null);
  };

  // set modal main modal action (confirm)
  const modalAction = async () => {
    // setErrorJobOpening(null);
    // setErrorWorkExperience(null);
    // setErrorApplyJob(null);
    // setErrorCaptcha(null);
    // setErrorMessage(null);
    setTimeout(() => {
      if (!messageContent) {
        setErrorMessage('Failed to load message contents!');
      } else {
        setCaptchaModalIsOpen(true);
      }
    }, 100);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      {
        //error response from POST if tried to POST with empty supervisor/office
        !isEmpty(errorApplyJob) ? <ToastNotification toastType="error" notifMessage={`${errorApplyJob}`} /> : null
      }

      {!isEmpty(errorIfApplied) ? <ToastNotification toastType="error" notifMessage={`${errorIfApplied}`} /> : null}

      {!isEmpty(errorWorkExperience) ? (
        <ToastNotification toastType="error" notifMessage={`${errorWorkExperience}`} />
      ) : null}

      {!isEmpty(errorJobOpening) ? <ToastNotification toastType="error" notifMessage={`${errorJobOpening}`} /> : null}

      {!isEmpty(errorCaptcha) ? <ToastNotification toastType="error" notifMessage={`${errorCaptcha} test`} /> : null}

      {!isEmpty(errorMessage) ? <ToastNotification toastType="error" notifMessage={`${errorMessage}`} /> : null}

      {!isEmpty(responseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Job Application Submitted`} />
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
            steady
          >
            <Modal.Header>
              <div className="flex items-start justify-between px-2">
                <div className="flex flex-col">
                  <label className="text-xl font-semibold text-gray-700 md:text-2xl">
                    {messageContent?.positionTitle}
                  </label>
                  <p className="text-md">{messageContent?.placeOfAssignment}</p>
                </div>

                <button
                  className="h-8 px-1 text-xl rounded-full outline-slate-100 outline-8 hover:bg-slate-100"
                  onClick={modalCancel}
                >
                  <HiX />
                </button>
              </div>
            </Modal.Header>

            <Modal.Body>
              {hasApplied ? (
                <div className="px-2">
                  <AlertNotification
                    alertType="info"
                    notifMessage="You have already applied for this position."
                    dismissible={false}
                  />
                </div>
              ) : null}

              <VacancyModalController page={modal.page} dataJobOpening={jobDetails} workExperience={workExperience} />

              <CaptchaModal
                modalState={captchaModalIsOpen}
                setModalState={setCaptchaModalIsOpen}
                title={'JOB APPLICATION CAPTCHA'}
              >
                {/* contents */}
                <JobApplicationCaptcha
                  vppId={messageContent?.vppId}
                  employeeId={employeeId}
                  withRelevantExperience={withRelevantExperience}
                  workExperienceArray={workExperienceArray}
                />
              </CaptchaModal>
            </Modal.Body>

            <Modal.Footer className={`${modal.page === 2 ? 'h-36' : 'h-auto'} md:h-auto`}>
              <div className="flex flex-col justify-center w-full h-full">
                {modal.page === 1 ? (
                  <div className="flex flex-col items-end w-full">
                    <Button className={`${hasApplied ? 'hidden' : 'h-10'}`} onClick={(e) => changeModalPage(2)}>
                      Next
                    </Button>
                  </div>
                ) : modal.page === 2 ? (
                  <div className="flex items-center justify-between w-full h-10">
                    <div
                      className={`${
                        hasApplied ? 'hidden' : 'w-full h-10 flex flex-row gap-3 justify-between items-center'
                      }`}
                    >
                      <Button onClick={(e) => changeModalPage(1)}>Back</Button>

                      <div
                        className={`${
                          hasApplied ? 'hidden' : 'hidden lg:flex justify-start items-center text-xs text-red-600'
                        }`}
                      >
                        Warning: Going back or closing the window will reset your entries.
                      </div>

                      <Button onClick={modalAction}>Apply</Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Modal.Footer>
          </Modal>

          <SideNav employeeDetails={employeeDetails} />
          <MainContainer>
            <div className="flex flex-col w-full h-full px-4 pb-10 md:flex-row md:px-0">
              <div className="flex flex-col w-full px-8 pb-5 overflow-y-auto md:px-0 md:w-full h-1/2 md:h-full md:pl-4 md:pr-20">
                <label className="pb-4">Job Vacancies</label>

                {employeeDetails.employmentDetails.userRole !== UserRole.JOB_ORDER ? (
                  data && data.length > 0 ? (
                    data.map((vacancies: VacancyDetails, messageIdx: number) => {
                      return (
                        <div key={messageIdx}>
                          <MessageCard
                            icon={<HiNewspaper className="w-6 h-6 text-green-800" />}
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
                    <div className="flex flex-col items-center justify-center w-full px-8 pb-5 overflow-y-auto bg-slate-50 md:px-0 md:w-full h-80 md:h-full md:pl-4 md:pr-20">
                      <label className="w-full text-4xl text-center text-gray-400 ">NO VACANCIES</label>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center w-full px-8 pb-5 overflow-y-auto bg-slate-50 md:px-0 md:w-full h-80 md:h-full md:pl-4 md:pr-20">
                    <label className="w-full text-4xl text-center text-gray-400 ">NO DATA</label>
                  </div>
                )}
              </div>
              {isEmpty(jobDetails?.error) && jobDetails && messageContent ? (
                <div className="flex flex-col items-center w-full pt-1 text-gray-700 h-1/2 md:h-full md:pt-6 md:ml-4 md:mr-4">
                  <div
                    className={`${isMessageOpen ? 'w-full md:ml-10 md:mr-10 p-8 flex flex-col bg-white' : 'hidden'}`}
                  >
                    <label className="pb-2">{mailMessage}</label>
                    <JobDetailsPanel data={jobDetails} details={messageContent} />

                    <label className="pt-2 pb-2">Click Details button for more information.</label>
                    <div className="flex flex-row justify-end gap-4">
                      <div
                        className={`${
                          messageContent?.postingDeadline ? '' : 'flex flex-row gap-4 items-center justify-end'
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
                <div className="flex flex-col items-center justify-center w-full pt-1 text-4xl text-center text-gray-400 h-1/2 md:h-full md:pt-6 md:ml-4 md:mr-4">
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
export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  try {
    const userDetails = getUserDetails(); //get employee details from ssid token - using _id only
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/publications/`);
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
});
