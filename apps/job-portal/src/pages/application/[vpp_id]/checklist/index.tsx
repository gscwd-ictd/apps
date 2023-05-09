/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-target-blank */
import { Alert, Button } from '@gscwd-apps/oneui';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiEye, HiInformationCircle } from 'react-icons/hi';
import useSWR from 'swr';
import { MyPopover } from '../../../../components/fixed/popover/helppopover';
import { CardContainer } from '../../../../components/modular/cards/CardContainer';
import { axiosFetcher } from '../../../../components/modular/fetcher/Fetcher';
import { NodeCircle } from '../../../../components/modular/nodes/Node';
import TopNavigation from '../../../../components/page-header/TopNavigation';
import { useApplicantStore } from '../../../../store/applicant.store';
import { usePageStore } from '../../../../store/page.store';
import { Pds } from '../../../../store/pds.store';
import { useWorkExpSheetStore } from '../../../../store/work-experience-sheet.store';

type ChecklistProps = {
  vppId: string;
  externalApplicantId: string;
  pdsDetails: Pds;
  positionTitle: string;
};

export default function Checklist({ vppId, positionTitle }: ChecklistProps) {
  const router = useRouter();
  const progress = usePageStore((state) => state.progress);
  const hasPds = usePageStore((state) => state.hasPds);
  const workExperiencesSheet = useWorkExpSheetStore(
    (state) => state.workExperiencesSheet
  );
  const externalApplicantId = useApplicantStore(
    (state) => state.externalApplicantId
  );
  const [alertSubmitIsOpen, setAlertSubmitIsOpen] = useState<boolean>(false);
  const [alertSuccessIsOpen, setAlertSuccessIsOpen] = useState<boolean>(false);
  const [alertErrorIsOpen, setAlertErrorIsOpen] = useState<boolean>(false);
  // const appSubmitted = useApplicantStore((state) => state.appSubmitted)
  const noWorkExperience = useWorkExpSheetStore(
    (state) => state.noWorkExperience
  );
  const applicant = useApplicantStore((state) => state.applicant);
  const submission = useApplicantStore((state) => state.submission);
  const setHasPds = usePageStore((state) => state.setHasPds);
  const setProgress = usePageStore((state) => state.setProgress);
  const setApplicant = useApplicantStore((state) => state.setApplicant);
  // const setAppSubmitted = useApplicantStore((state) => state.setAppSubmitted)
  const setExternalApplicantId = useApplicantStore(
    (state) => state.setExternalApplicantId
  );
  const setSubmission = useApplicantStore((state) => state.setSubmission);

  // fetch pds
  const { data: pds } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/existing-pds`,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      focusThrottleInterval: 0,
      refreshInterval: 50,
    }
  );

  // fetch work experience sheet
  const { data: hasWE } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/relevant-work-experience-check`,
    axiosFetcher
  );

  // fetch applicant name
  const { data: applicantName } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/name`,
    axiosFetcher
  );

  const onClickPds = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${vppId}/pds`
    );
  };

  const onClickWorkExpSheet = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${vppId}/${externalApplicantId}/work-experience-sheet`
    );
  };

  // submit
  const onSubmit = async () => {
    // localStorage.clear()
    try {
      // checks if cookie is existing
      await axios.get(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/vacant-position-postings/publications/portal/${vppId}`,
        {
          withCredentials: true,
        }
      );

      // proceed to post if cookie if existing
      const postWorkExperienceSheet = await axios.post(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/pds/work-experience-sheet/${externalApplicantId}`,
        {
          vppId,
          workExperiencesSheet,
          withRelevantExperience: !noWorkExperience,
        }
      );

      if (
        postWorkExperienceSheet.status === 200 ||
        postWorkExperienceSheet.status === 201
      ) {
        // localStorage.clear()
        setSubmission({
          ...submission,
          hasSubmitted: true,
          hasRelevantWorkExperience: {
            withRelevantExperience: noWorkExperience ? false : true,
          },
        });
        setAlertSubmitIsOpen(false);
        setAlertSuccessIsOpen(true);
      } else {
        setAlertSubmitIsOpen(false);
        setAlertErrorIsOpen(true);
      }

      //200
    } catch (error) {
      setAlertSubmitIsOpen(false);
      setAlertErrorIsOpen(true);
    }
  };

  useEffect(() => {
    if (pds && pds.isExists) {
      setHasPds(true);
      setExternalApplicantId(pds.externalApplicantId);
    }
    // remove work experience sheet if new user
    else {
      setHasPds(false);
      localStorage.removeItem('workExperiencesSheet');
    }
  }, [pds]);

  useEffect(() => {
    if (hasPds === true || !isEmpty(localStorage.getItem('applicant')))
      setProgress({ ...progress, firstStep: true, secondStep: false });
  }, [hasPds]);

  useEffect(() => {
    if (progress.firstStep === true && progress.secondStep === false && hasPds)
      setProgress({ ...progress, secondStep: true });
    else if (progress.firstStep === true && !hasPds)
      setProgress({ ...progress, secondStep: false });
  }, [progress.firstStep, hasPds]);

  useEffect(() => {
    if (progress.secondStep === true)
      setProgress({ ...progress, thirdStep: false });
  }, [progress.secondStep]);

  useEffect(() => {
    if (
      (progress.thirdStep === false &&
        (workExperiencesSheet.length > 0 || noWorkExperience === true)) ||
      submission.hasSubmitted === true
    ) {
      setProgress({ ...progress, thirdStep: true });
    }
  }, [
    progress.thirdStep,
    workExperiencesSheet.length,
    submission.hasSubmitted,
  ]);

  // prompts when window or tab is being closed
  useEffect(() => {
    const handleTabClose = (e: any) => {
      e.preventDefault();

      return (e.returnValue = 'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  // work experience fetch effect
  useEffect(() => {
    hasWE && console.log(hasWE);
    // applicant has not submitted
    if (isEmpty(hasWE)) {
      setSubmission({
        ...submission,
        hasSubmitted: false,
        hasRelevantWorkExperience: { withRelevantExperience: null },
      });
    }
    // applicant has submitted
    else if (hasWE) {
      setSubmission({
        ...submission,
        hasSubmitted: true,
        hasRelevantWorkExperience: {
          withRelevantExperience: hasWE.hasRelevantWorkExperience
            .withRelevantWorkExperience
            ? true
            : false,
        },
      });
    }
  }, [hasWE]);

  // applicant name fetch effect
  useEffect(() => {
    if (applicantName) {
      setApplicant({
        ...applicant,
        firstName: applicantName.applicantFirstName,
        middleName: applicantName.middleName,
        lastName: applicantName.applicantLastName,
        nameExtension: applicantName.applicantNameExtension,
      });
    }
  }, [applicantName]);

  return (
    <>
      <div className="min-h-screen">
        <TopNavigation />

        {/**Submit Alert */}
        <Alert open={alertSubmitIsOpen} setOpen={setAlertSubmitIsOpen}>
          <Alert.Description>
            <div className="flex flex-col justify-center w-full h-full">
              <span className="text-lg">Hi, {applicant.firstName}!</span>
              <hr />
              <span className="text-md">
                <br />
                The following details will be submitted for the{' '}
                <span className="font-black text-black">
                  {positionTitle}
                </span>{' '}
                position:
                <br />
              </span>
              <span className="text-gray-700">
                <br />• Personal Data Sheet
              </span>
              <span className="text-gray-700">• Work Experience Sheet</span>
              <span>
                <br />
                Do you want to submit your application?
              </span>
            </div>
          </Alert.Description>
          <Alert.Footer alignEnd>
            <div className="flex gap-2">
              <Button onClick={() => setAlertSubmitIsOpen(false)}>No</Button>
              <Button onClick={onSubmit}>Yes</Button>
            </div>
          </Alert.Footer>
        </Alert>

        {/** SUCCESS ALERT */}
        <Alert open={alertSuccessIsOpen} setOpen={setAlertSuccessIsOpen}>
          <Alert.Description>
            <div className="flex h-[3rem] w-full ">
              <div className="-ml-2 w-[15%] fill-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              </div>
              <div className="flex w-[85%] items-center text-3xl font-medium text-green-500">
                Success
              </div>
            </div>
            <div className="flex flex-col justify-center w-full h-full">
              <span className="text-lg font-light">
                Your application has been submitted!
              </span>
              <span className="text-lg font-light">Thank you!</span>
            </div>
          </Alert.Description>
          <Alert.Footer alignEnd>
            <div className="w-[6rem]">
              <Button onClick={() => setAlertSuccessIsOpen(false)}>Okay</Button>
            </div>
          </Alert.Footer>
        </Alert>

        {/** ERROR ALERT */}
        <Alert open={alertErrorIsOpen} setOpen={setAlertErrorIsOpen}>
          <Alert.Description>
            <div className="flex h-[3rem] w-full ">
              <div className="-ml-2 w-[15%] fill-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex w-[85%] items-center text-3xl font-medium text-red-600">
                Error
              </div>
            </div>
            <div className="flex flex-col justify-center w-full h-full">
              <span className="text-lg font-light">
                An error has been encountered
              </span>
              <span className="text-lg font-light">
                Please try again in a few seconds
              </span>
            </div>
          </Alert.Description>
          <Alert.Footer alignEnd>
            <div className="w-[6rem]">
              <Button
                onClick={() => {
                  setAlertErrorIsOpen(false);
                  router.push(process.env.NEXT_PUBLIC_JOB_PORTAL!);
                }}
              >
                Okay
              </Button>
            </div>
          </Alert.Footer>
        </Alert>
        <header className="shadow ">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {positionTitle}
            </h1>
          </div>
        </header>
        <main className="h-[42rem]">
          <div className="flex flex-col items-center justify-center">
            <CardContainer
              title=""
              bgColor="bg-slate-50"
              remarks=""
              subtitle=""
              className="p-5 border rounded-xl"
            >
              <div className="flex w-full">
                <table className="">
                  <thead>
                    <tr className="border-b-4 text-slate-700">
                      <th className="w-[5%] py-5"></th>
                      <th className="w-[50%] py-5 text-left text-xl font-medium">
                        Checklist
                      </th>
                      <th className="w-[20%] py-5 text-center text-xl font-medium">
                        Actions
                      </th>
                      <th className="w-[15%] py-5 text-center text-xl font-medium">
                        PDF View
                      </th>
                      <th className="w-[20%] py-5 text-center text-xl font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-dotted">
                    {/**
                     *
                     * STEP 1
                     *
                     */}
                    <tr>
                      <td className="w-[5%] py-5 text-center">
                        <NodeCircle nodeText="1" />
                      </td>
                      <td className="w-[50%]">
                        <p className="grid py-5 text-left">
                          <span className="text-xl ">Initial Details</span>
                          <span className="text-lg text-gray-500">
                            Full name and Email address is provided here
                          </span>
                        </p>
                      </td>
                      <td className="w-[20%] py-5 text-center ">-</td>
                      <td className="w-[15%] py-5 text-center ">-</td>
                      <td
                        className={`w-[20%] py-5 text-center text-lg ${
                          progress.firstStep === true
                            ? 'text-green-500'
                            : 'text-rose-500'
                        }`}
                      >
                        <div className="flex justify-center w-full h-full">
                          {progress.firstStep === true &&
                          submission.hasSubmitted === false ? (
                            <>
                              <div className="w-[6rem] rounded bg-green-500 py-1 px-3 text-white">
                                Done
                              </div>
                            </>
                          ) : progress.firstStep === true &&
                            submission.hasSubmitted === true ? (
                            <div className="w-[6rem] rounded bg-green-500 py-2 px-3 text-sm text-white">
                              Submitted
                            </div>
                          ) : (
                            <div className="w-[6rem] rounded bg-red-500 py-1 px-3 text-white">
                              Pending
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/** 2nd line */}
                    <tr>
                      <td className="w-[5%] py-5 text-center">
                        <NodeCircle nodeText="2" />
                      </td>
                      <td className="w-[50%]">
                        <p className="grid py-5 text-left">
                          <span className="text-xl">Personal Data Sheet</span>
                          <span className="text-lg text-gray-500">
                            Complete, Accurate, and clear information about you
                            and your experiences
                          </span>
                        </p>
                      </td>
                      <td className="w-[20%] py-5 text-center uppercase text-indigo-500">
                        <div className="flex justify-center w-full h-full">
                          {progress.secondStep === true &&
                          progress.firstStep === true &&
                          submission.hasSubmitted === false ? (
                            <>
                              <div className="w-[6rem]">
                                <Button
                                  onClick={onClickPds}
                                  disabled={submission.hasSubmitted}
                                >
                                  <div className="font-medium text-white text-md">
                                    Update
                                  </div>
                                </Button>
                              </div>
                            </>
                          ) : progress.secondStep === true ||
                            submission.hasSubmitted === true ? (
                            <span className="text-black">-</span>
                          ) : progress.firstStep === true && !hasPds ? (
                            <>
                              <div className="w-[6rem]">
                                <Button
                                  onClick={onClickPds}
                                  disabled={submission.hasSubmitted}
                                >
                                  <div className="font-medium text-md text-slate-700">
                                    Create
                                  </div>
                                </Button>
                              </div>
                            </>
                          ) : progress.firstStep === false ? (
                            <span className="text-black">-</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="w-[15%] py-5 text-center">
                        {progress.secondStep === true ? (
                          <>
                            <div className="flex justify-center w-full">
                              <a
                                href={`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${vppId}/pds/applicant/${externalApplicantId}`}
                                target="_blank"
                              >
                                <HiEye className="text-slate-700" size={30} />
                              </a>
                            </div>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td
                        className={`w-[20%]  py-5 text-center text-lg ${
                          progress.secondStep === true
                            ? 'text-green-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {progress.secondStep === true &&
                        submission.hasSubmitted === false ? (
                          <>
                            <div className="w-[6rem] rounded bg-green-500 py-1 px-3 text-white">
                              Done
                            </div>
                          </>
                        ) : submission.hasSubmitted === true ? (
                          <div className="w-[6rem] rounded bg-green-500 py-2 px-3 text-sm text-white">
                            Submitted
                          </div>
                        ) : (
                          <div className="w-[6rem] rounded bg-red-500 py-1 px-3 text-white">
                            Pending
                          </div>
                        )}
                      </td>
                    </tr>

                    {/** 3rd line */}
                    <tr>
                      <td className="w-[5%] py-5 text-center">
                        <NodeCircle nodeText="3" />
                      </td>
                      <td className="w-[50%]">
                        <p className="grid py-5 text-left">
                          <span className="text-xl">Work Experience Sheet</span>
                          <span className="text-lg text-gray-500">
                            Select the work experiences that are relevant to the
                            position you are applying for
                          </span>
                        </p>
                      </td>
                      <td className="w-[20%] py-5 text-center  ">
                        <div className="flex justify-center w-full h-full">
                          {progress.secondStep === true &&
                          progress.thirdStep === true &&
                          submission.hasSubmitted === false ? (
                            <>
                              <div className="w-[6rem]">
                                <Button
                                  onClick={onClickWorkExpSheet}
                                  disabled={submission.hasSubmitted}
                                >
                                  <div className="font-medium text-white text-md">
                                    Update
                                  </div>
                                </Button>
                              </div>
                            </>
                          ) : progress.secondStep === true &&
                            progress.thirdStep === true &&
                            submission.hasSubmitted === true ? (
                            <span className="text-black">-</span>
                          ) : progress.secondStep === true &&
                            progress.thirdStep === false &&
                            submission.hasSubmitted === false ? (
                            <>
                              <div className="w-[6rem]">
                                <button onClick={onClickWorkExpSheet}>
                                  <div className="font-medium bg-white border py-2 w-[6rem] rounded text-md text-slate-700">
                                    Select
                                  </div>
                                </button>
                              </div>
                            </>
                          ) : progress.secondStep === false ? (
                            <span className="text-black">-</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="w-[15%] py-5 text-center ">
                        {progress.thirdStep === true &&
                        noWorkExperience === false ? (
                          <>
                            <div className="flex justify-center w-full">
                              <a
                                href={`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${vppId}/${externalApplicantId}/work-experience-sheet/pdf`}
                                target="_blank"
                              >
                                <HiEye className="text-slate-700" size={30} />
                              </a>
                            </div>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td
                        className={` w-[20%]  py-5 text-center text-lg ${
                          progress.thirdStep === true
                            ? 'text-green-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {progress.thirdStep === true ? (
                          <>
                            {noWorkExperience &&
                            submission.hasSubmitted === false ? (
                              <div
                                className={`bg-green-500' min-w-[6rem] rounded bg-green-500 py-1 px-3 text-white`}
                              >
                                <div className="flex gap-2">
                                  <span>Done</span>
                                  <MyPopover
                                    text="No relevant experience included"
                                    textClassName="text-black"
                                  />
                                </div>
                              </div>
                            ) : noWorkExperience &&
                              submission.hasSubmitted === true ? (
                              <div
                                className={`bg-green-500' min-w-[6rem] rounded bg-green-500 py-2 px-3 text-sm text-white`}
                              >
                                <div className="flex gap-1 pr-2">
                                  <span className="text-sm">Submitted</span>
                                  <MyPopover
                                    text="No relevant experience included"
                                    textClassName="text-black"
                                  />
                                </div>
                              </div>
                            ) : noWorkExperience === false &&
                              submission.hasSubmitted === true ? (
                              <div
                                className={`bg-green-500' min-w-[6rem] rounded bg-green-500 py-2 px-3 text-sm text-white`}
                              >
                                <div>
                                  <span>Submitted</span>
                                </div>
                              </div>
                            ) : noWorkExperience === false &&
                              submission.hasSubmitted === false ? (
                              <div
                                className={`bg-green-500' min-w-[6rem] rounded bg-green-500 py-1 px-3 text-white`}
                              >
                                <span>Done</span>
                              </div>
                            ) : (
                              <div className="w-[6rem] rounded bg-red-500 py-1 px-3 text-white">
                                Pending
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-[6rem] rounded bg-red-500 py-1 px-3 text-white">
                            Pending
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContainer>

            {submission.hasSubmitted === false ? (
              <CardContainer
                className="p-5 rounded-xl"
                bgColor={'bg-sky-100'}
                title={''}
                remarks={''}
                subtitle={''}
              >
                <div className="flex w-[52rem] items-center gap-4">
                  <section>
                    <HiInformationCircle size={40} className="text-slate-600" />
                  </section>
                  <section className="text-sm">
                    • Do not refresh the page. Any changes you've made in the
                    work experience sheet will be discarded. <br />
                    • If you proceed to the homepage, your session for this
                    publication will be ended and you'll have to login again.
                    <br />
                  </section>
                </div>
              </CardContainer>
            ) : submission.hasSubmitted === true ? (
              <CardContainer
                className="p-5 rounded-xl"
                bgColor={'bg-sky-100'}
                title={''}
                remarks={''}
                subtitle={''}
              >
                <div className="flex w-[52rem] items-center gap-4">
                  <section>
                    <HiInformationCircle size={40} className="text-slate-600" />
                  </section>
                  <section className="text-sm">
                    You have submitted an application for this publication.
                    <br />
                  </section>
                </div>
              </CardContainer>
            ) : null}
          </div>
        </main>
        <footer>
          {progress.firstStep &&
            progress.secondStep &&
            progress.thirdStep &&
            submission.hasSubmitted === false && (
              <div className="flex w-full justify-center sm:px-2 md:px-2 lg:px-[21.5%]">
                <Button
                  onClick={() => setAlertSubmitIsOpen(true)}
                  type="button"
                  className="w-full bg-blue-600"
                >
                  Submit Application
                </Button>
              </div>
            )}

          {/* <Button onClick={() => console.log(progress, submission, hasPds)}>Log</Button> */}
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const fetchPublication = await axios.get(
      `${
        process.env.NEXT_PUBLIC_HRIS_DOMAIN
      }/vacant-position-postings/publications/${context.params!.vpp_id}`
    );

    return {
      props: {
        vppId: context.query.vpp_id,

        positionTitle: fetchPublication.data.positionTitle,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      // redirect: { destination: process.env.NEXT_PUBLIC_JOB_PORTAL }
    };
  }
};
