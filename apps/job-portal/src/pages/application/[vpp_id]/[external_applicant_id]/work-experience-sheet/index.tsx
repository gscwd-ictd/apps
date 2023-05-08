import { Alert, Button } from '@gscwd-apps/oneui';
import { WorkExperience } from 'apps/job-portal/utils/types/data/work.type';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';
import { HiArrowSmLeft } from 'react-icons/hi';
import useSWR from 'swr';
import { DeleteButton } from '../../../../../components/fixed/buttons/Delete';
import { WorkExprSheet } from '../../../../../components/fixed/panels/work-sheet/WorkExprSheet';
import { TabHeader } from '../../../../../components/fixed/tabs/TabHeader';
import { CardContainer } from '../../../../../components/modular/cards/CardContainer';
import { axiosFetcher } from '../../../../../components/modular/fetcher/Fetcher';
import { NodeCircle } from '../../../../../components/modular/nodes/Node';
import Toggle from '../../../../../components/modular/switch/Toggle';
import TopNavigation from '../../../../../components/page-header/TopNavigation';
import { usePageStore } from '../../../../../store/page.store';
import {
  useWorkExpSheetStore,
  WorkExperienceSheet,
} from '../../../../../store/work-experience-sheet.store';

type WorkSheetPanelProps = {
  vppId: string;
  allWorkExperiences: Array<WorkExperience>;
};

export default function WorkSheetPanel({
  allWorkExperiences,
  vppId,
}: WorkSheetPanelProps): JSX.Element {
  const hasPds = usePageStore((state) => state.hasPds);
  const router = useRouter();
  const progress = usePageStore((state) => state.progress);
  const isLoaded = useWorkExpSheetStore((state) => state.isLoaded);
  const [indexToRemove, setIndexToRemove] = useState<number>(-1);
  const workExperiences = useWorkExpSheetStore(
    (state) => state.workExperiences
  );
  const [unselectedWeId, setUnselectedWeId] = useState<string>('');
  const [cancelAlertIsOpen, setCancelAlertIsOpen] = useState<boolean>(false);
  const [removeAlertIsOpen, setRemoveAlertIsOpen] = useState<boolean>(false);
  const workExperiencesSheet = useWorkExpSheetStore(
    (state) => state.workExperiencesSheet
  );
  const [externalApplicantId, setExternalApplicantId] = useState<string>('');
  const selectedWorkExperience = useWorkExpSheetStore(
    (state) => state.selectedWorkExperience
  );
  const setSelectedWorkExperience = useWorkExpSheetStore(
    (state) => state.setSelectedWorkExperience
  );
  const setHasPds = usePageStore((state) => state.setHasPds);
  const setProgress = usePageStore((state) => state.setProgress);
  const setIsLoaded = useWorkExpSheetStore((state) => state.setIsLoaded);
  const setWorkExperiences = useWorkExpSheetStore(
    (state) => state.setWorkExperiences
  );
  const setWorkExperiencesSheet = useWorkExpSheetStore(
    (state) => state.setWorkExperiencesSheet
  );
  const noWorkExperience = useWorkExpSheetStore(
    (state) => state.noWorkExperience
  );
  const setNoWorkExperience = useWorkExpSheetStore(
    (state) => state.setNoWorkExperience
  );

  const dateTransformer = (date: string) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  const { data } = useSWR(
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

  const goBack = () => {
    localStorage.setItem(
      'workExperiencesSheet',
      JSON.stringify(workExperiencesSheet)
    );
    router.back();
  };

  // on remove work experience
  const onRemove = (id: string, index: number) => {
    setIndexToRemove(index);
    setRemoveAlertIsOpen(true);
    setUnselectedWeId(id);
  };

  // remove affirmative action
  const onRemoveAction = (workExpSheetIdx: number) => {
    const updatedWE = [...workExperiencesSheet];
    updatedWE.splice(workExpSheetIdx, 1);

    // map the workExperiences
    const newUpdatedWorkExperiences = workExperiences.map(
      (previousWE: WorkExperienceSheet) => {
        if (unselectedWeId === previousWE._id) {
          return {
            ...previousWE,
            isSelected: false,
            immediateSupervisor: '',
            nameOfOffice: '',
            accomplishments: [],
            duties: [],
          };
        }
        return previousWE;
      }
    );
    setWorkExperiences(newUpdatedWorkExperiences);
    // setSelectedWorkExperience({} as WorkExperienceSheet)
    setWorkExperiencesSheet(updatedWE);
    setRemoveAlertIsOpen(false);
  };

  // remove cancel action
  const onRemoveCancel = () => {
    setRemoveAlertIsOpen(false);
    setIndexToRemove(-1);
  };

  useEffect(() => {
    if (!isLoaded) {
      const newWorkExperiences: any = [...allWorkExperiences];
      newWorkExperiences.map((work: Partial<WorkExperienceSheet>) => {
        work.accomplishments = [];
        work.duties = [];
        work.immediateSupervisor = '';
        work.nameOfOffice = '';
      });
      setWorkExperiences(newWorkExperiences);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (data && data.isExists) {
      setHasPds(true);
      setExternalApplicantId(data.externalApplicantId);
    } else setHasPds(false);
  }, [data]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <TopNavigation />

        <button
          className="fixed flex items-center gap-2 mb-5 text-gray-500 transition-colors ease-in-out hover:text-gray-700"
          onClick={() => setCancelAlertIsOpen(true)}
        >
          <HiArrowSmLeft className="w-5 h-5" />
          <span className="font-medium">Go back</span>
        </button>

        <header className="shadow ">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Work Experience Sheet
            </h1>
          </div>
        </header>
        <main>
          {/**Go Back alert */}
          <Alert open={cancelAlertIsOpen} setOpen={setCancelAlertIsOpen}>
            <Alert.Description>
              <div className="flex justify-center w-full h-full">
                Do you want to go back to the checklist page?
              </div>
            </Alert.Description>
            <Alert.Footer alignEnd>
              <div className="w-[6rem]">
                <Button onClick={() => setCancelAlertIsOpen(false)}>No</Button>
              </div>
              <div className="w-[6rem]">
                <Button onClick={goBack}>Yes</Button>
              </div>
            </Alert.Footer>
          </Alert>

          {/**Remove alert */}
          <Alert open={removeAlertIsOpen} setOpen={setRemoveAlertIsOpen}>
            <Alert.Description>
              <div className="flex justify-center w-full h-full">
                Do you want to remove the following from the work experience
                sheet?
              </div>
            </Alert.Description>
            <Alert.Footer alignEnd>
              <div className="w-[6rem]">
                <Button onClick={onRemoveCancel}>No</Button>
              </div>
              <div className="w-[6rem]">
                <Button onClick={() => onRemoveAction(indexToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          <div className="flex flex-col items-center justify-center gap-4">
            <WorkExprSheet />

            {noWorkExperience ? (
              <></>
            ) : (
              <div className="flex justify-center w-full pt-5">
                <section className="h-full sm:w-[30rem] lg:w-[60rem] ">
                  <div className="w-full ">
                    {workExperiencesSheet &&
                      workExperiencesSheet.length > 0 && (
                        <CardContainer
                          title=""
                          bgColor="bg-slate-50"
                          remarks=""
                          subtitle=""
                          className="px-2 py-5 border rounded-xl"
                        >
                          <table>
                            <thead>
                              <tr className="border-b-4 text-slate-700">
                                <th className="w-[5%] px-2 "></th>
                                <th className="w-[20%] px-2 text-left text-xl font-medium">
                                  Position Title
                                </th>
                                <th className="w-[35%] px-2 text-left text-xl font-medium">
                                  Company Name
                                </th>
                                <th className="w-[30%] px-2 text-left text-xl font-medium">
                                  Duration
                                </th>
                                <th className="w-[10%] px-2 text-left text-xl font-medium">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="">
                              {workExperiencesSheet &&
                                noWorkExperience === false &&
                                workExperiencesSheet.length > 0 &&
                                workExperiencesSheet.map(
                                  (
                                    workExpSheet: WorkExperience,
                                    index: number
                                  ) => {
                                    return (
                                      <React.Fragment key={index}>
                                        <tr className="divide-y-2 divide-gray-300 divide-dashed">
                                          <td className="w-[5%] px-2 pt-4 text-left">
                                            *
                                          </td>
                                          <td className="w-[20%] px-2 pt-4 text-left">
                                            {workExpSheet.positionTitle}
                                          </td>
                                          <td className="w-[35%] px-2 pt-4 text-left">
                                            {workExpSheet.companyName}
                                          </td>
                                          <td className="w-[30%] px-2 pt-4 text-left">{`${dateTransformer(
                                            workExpSheet.from
                                          )} to ${
                                            workExpSheet.to === null
                                              ? 'Present'
                                              : workExpSheet.to
                                          }`}</td>
                                          <td className="w-[10%] px-2 pt-4 text-center">
                                            <div className="flex">
                                              <span
                                                className="flex items-center justify-center px-2 text-2xl font-medium text-center text-white bg-red-500 rounded hover:cursor-pointer"
                                                onClick={() =>
                                                  onRemove(
                                                    workExpSheet._id!,
                                                    index
                                                  )
                                                }
                                              >
                                                x
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    );
                                  }
                                )}
                            </tbody>
                          </table>
                        </CardContainer>
                      )}
                  </div>
                </section>
              </div>
            )}

            {/** CHECKBOX */}

            <div className="flex justify-center w-full pt-6">
              <div className="flex w-[60rem] justify-end">
                <Toggle
                  enabled={noWorkExperience}
                  setEnabled={setNoWorkExperience}
                  label={
                    <div>
                      <span className="text-xs italic">
                        I do not have a relevant work experience yet
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/pds/work-experience/${context.params?.external_applicant_id}`,
      {
        withCredentials: true,
        headers: { Cookie: `${context.req.headers.cookie}` },
      }
    );

    return {
      props: { vppId: context.params?.vpp_id, allWorkExperiences: data },
    };
  } catch (error) {
    return { props: { vppId: context.query.vpp_id } };
  }
};
