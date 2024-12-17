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
import { isEmpty, isEqual } from 'lodash';
import { AlertNotification, Button, CaptchaModal, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { JobDetailsPanel } from '../../../components/fixed/vacancies/JobDetailsPanel';
import { VacancyModalController } from '../../../components/fixed/vacancies/VacancyModalController';
import { WorkExperiencePds } from '../../../types/workexp.type';
import { useWorkExpStore } from '../../../store/workexperience.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { useRouter } from 'next/router';
import { JobApplicationCaptcha } from 'apps/portal/src/components/fixed/vacancies/JobApplicationCaptcha';
import { ContentBody } from 'apps/portal/src/components/modular/custom/containers/ContentBody';
import { ContentHeader } from 'apps/portal/src/components/modular/custom/containers/ContentHeader';
import useSWR from 'swr';
import { useVacanciesStore } from 'apps/portal/src/store/vacancies.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';

export default function Vacancies({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setEmployeeDetails, employeeDetail } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
    employeeDetail: state.employeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

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

  const { vacancies, errorVacancies, loadingVacancies, getVacancies, getVacanciesSuccess, getVacanciesFail } =
    useVacanciesStore((state) => ({
      vacancies: state.vacancies,
      errorVacancies: state.error.errorVacancies,
      loadingVacancies: state.loading.loadingVacancies,
      getVacancies: state.getVacancies,
      getVacanciesSuccess: state.getVacanciesSuccess,
      getVacanciesFail: state.getVacanciesFail,
    }));

  const router = useRouter();

  const vacanciesUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/publications/`;

  const {
    data: swrVacancies,
    isLoading: swrVacanciesIsLoading,
    error: swrVacanciesError,
    mutate: mutateVacancies,
  } = useSWR(employeeDetails.employmentDetails.userId ? vacanciesUrl : null, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrVacanciesIsLoading) {
      getVacancies(swrVacanciesIsLoading);
    }
  }, [swrVacanciesIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrVacancies)) {
      getVacanciesSuccess(swrVacanciesIsLoading, swrVacancies);
    }

    if (!isEmpty(swrVacanciesError)) {
      getVacanciesFail(swrVacanciesIsLoading, swrVacanciesError.message);
    }
  }, [swrVacancies, swrVacanciesError]);

  useEffect(() => {
    if (!isEmpty(responseApply)) {
      mutateVacancies();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [responseApply]);

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

    const applicantApplication = await checkIfApplied(vacancies.vppId, employeeDetail.employmentDetails.userId);
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
      setErrorCaptcha(null);
      setErrorMessage(null);
    }
    if (e == 2) {
      handleWorkExperience(employeeDetail.employmentDetails.userId);
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });

    setErrorJobOpening(null);
    setErrorWorkExperience(null);
    setErrorCaptcha(null);
    setErrorMessage(null);
  };

  // set modal main modal action (confirm)
  const modalAction = async () => {
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
      {/* failed to load vacancies */}
      {!isEmpty(swrVacanciesError) ? (
        <ToastNotification toastType="error" notifMessage={`${swrVacanciesError}: Failed to load Vacancies.`} />
      ) : null}

      {
        //error response from POST if tried to POST with empty supervisor/office
        !isEmpty(errorApplyJob) ? <ToastNotification toastType="error" notifMessage={`${errorApplyJob}`} /> : null
      }

      {!isEmpty(errorIfApplied) ? <ToastNotification toastType="error" notifMessage={`${errorIfApplied}`} /> : null}

      {!isEmpty(errorWorkExperience) ? (
        <ToastNotification toastType="error" notifMessage={`${errorWorkExperience}`} />
      ) : null}

      {!isEmpty(errorJobOpening) ? <ToastNotification toastType="error" notifMessage={`${errorJobOpening}`} /> : null}

      {!isEmpty(errorCaptcha) ? <ToastNotification toastType="error" notifMessage={`${errorCaptcha}`} /> : null}

      {!isEmpty(errorMessage) ? <ToastNotification toastType="error" notifMessage={`${errorMessage}`} /> : null}

      {!isEmpty(responseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Job Application Submitted`} />
      ) : null}

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
                employeeId={employeeDetail?.employmentDetails.userId}
                withRelevantExperience={withRelevantExperience}
                workExperienceArray={workExperienceArray}
              />
            </CaptchaModal>
          </Modal.Body>

          <Modal.Footer className={`${modal.page === 2 ? 'h-36' : 'h-auto'} md:h-auto`}>
            <div className="flex flex-col justify-center w-full h-full px-4">
              {modal.page === 1 ? (
                <div className="flex flex-col items-end w-full">
                  {hasApplied ? (
                    <Button variant="default" className={`h-10`} onClick={(e) => modalCancel()}>
                      Close
                    </Button>
                  ) : (
                    <Button className={`h-10`} onClick={(e) => changeModalPage(2)}>
                      Next
                    </Button>
                  )}
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
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Job Vacancies"
              subtitle="View open positions"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            {swrVacanciesIsLoading ? (
              <div className="w-full h-96 static flex flex-col justify-center items-center place-items-center">
                <LoadingSpinner size={'lg'} />
                {/* <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                /> */}
              </div>
            ) : (
              <ContentBody>
                <div className={`w-full flex lg:flex-row flex-col`}>
                  <div className={`lg:w-[58rem] w-full`}>
                    {employeeDetails.employmentDetails.userRole !== UserRole.JOB_ORDER &&
                    employeeDetails.employmentDetails.userRole !== UserRole.COS &&
                    employeeDetails.employmentDetails.userRole !== UserRole.COS_JO ? (
                      vacancies && vacancies.length > 0 ? (
                        vacancies.map((vacancies: VacancyDetails, messageIdx: number) => {
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
                        <div className="flex justify-center pt-20 px-5">
                          <h1 className="text-4xl text-gray-300">No vacancies found</h1>
                        </div>
                      )
                    ) : (
                      <div className="flex justify-center pt-20 px-5">
                        <h1 className="text-4xl text-gray-300">No data found</h1>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    {isEmpty(jobDetails?.error) && jobDetails && messageContent ? (
                      <div className="flex flex-col items-center w-full text-gray-700 h-1/2 md:h-full md:ml-4 md:mr-4 ">
                        <div
                          className={`${
                            isMessageOpen ? 'w-full md:ml-10 md:mr-10 px-4 flex flex-col bg-white' : 'hidden'
                          }`}
                        >
                          {/* <label className="pb-2">{mailMessage}</label> */}
                          <JobDetailsPanel data={jobDetails} details={messageContent} />

                          <label className="pt-2 pb-2">Click Details button for more information.</label>
                          <div className="flex flex-row justify-end gap-4 pb-10">
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
                      <div className="flex justify-center pt-20 px-5">
                        <h1 className="text-4xl text-gray-300">No posting selected</h1>
                      </div>
                    )}
                  </div>
                </div>
              </ContentBody>
            )}
          </div>
        </MainContainer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is job order or less = kick out
  if (
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS_JO)
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
