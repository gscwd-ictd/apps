/* eslint-disable @nx/enforce-module-boundaries */
import { Pds } from 'apps/pds/src/store/pds.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Applicant } from '../../../types/applicant.type';
import { ApplicantWithScores, PsbScores } from '../../../types/selection.type';
import { AppSelectionPdsAlert } from './AppSelectionPdsAlert';

export const AllSelectionApplicantsList = () => {
  const [applicantListIsLoaded, setApplicantListIsLoaded] =
    useState<boolean>(false);

  // for the alert component for pds
  const [pdsAlertState, setPdsAlertState] = useState<boolean>(false);

  // use this to assign as a parameter in useSWR

  const {
    applicantList,
    applicantScores,
    selectedApplicantDetails,
    selectedPublication,
    selectedPublicationId,
    setApplicantList,
    setApplicantScores,
    setPublicationDetails,
    setSelectedApplicantDetails,
    setSelectedApplicants,
    setPds,
  } = useAppSelectionStore((state) => ({
    applicantList: state.applicantList,
    applicantScores: state.applicantScores,
    selectedPublicationId: state.selectedPublicationId,
    selectedApplicantDetails: state.selectedApplicantDetails,
    selectedPublication: state.selectedPublication,
    setPds: state.setPds,
    setApplicantScores: state.setApplicantScores,
    setPublicationDetails: state.setPublicationDetails,
    setApplicantList: state.setApplicantList,
    setSelectedApplicants: state.setSelectedApplicants,
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
  }));

  const { patchResponseApply } = useAppSelectionStore((state) => ({
    patchResponseApply: state.response.patchResponseApply,
  }));

  // use swr
  const applicantsUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/interview-rating/${selectedPublicationId}`;

  //Applicants SWR
  const {
    data: swrApplicants,
    isLoading: swrIsLoadingApplicants,
    error: swrApplicantsError,
    mutate: mutateApplicants,
  } = useSWR(applicantsUrl, fetcherHRIS, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const pdsAlertCloseAction = () => {
    setPds({} as Pds);
  };

  //mutate publications when patchResponseApply is updated
  useEffect(() => {
    if (!isEmpty(patchResponseApply)) {
      mutateApplicants();
    }
  }, [patchResponseApply]);

  // on select
  const onSelect = (sequenceNo: number) => {
    // copy the current state of applicant list
    const updatedApplicantList = [...applicantList];

    // loop through all the applicants
    updatedApplicantList.map((applicant: Applicant, applicantIndex: number) => {
      // check if a particular applicant's index is selected
      if (sequenceNo === applicantIndex) {
        // reverse the current applicant state value
        applicant.state = !applicant.state;
      }
    });

    setApplicantList(updatedApplicantList);

    addToSelectedApplicants();
  };

  const addToSelectedApplicants = () => {
    // create an empty array of applicants
    const selectedApplicants: Array<ApplicantWithScores> = [];

    // map all applicant list
    applicantList.map((applicant: ApplicantWithScores) => {
      // add this applicant if it is checked
      applicant.state === true && selectedApplicants.push(applicant);
    });

    // set selected applicants state
    setSelectedApplicants(selectedApplicants);
  };

  useEffect(() => {
    if (swrApplicants && applicantListIsLoaded === false) {
      const fetchedData: any = [...swrApplicants.data.ranking]; //! changed --added data

      const applicants =
        fetchedData &&
        fetchedData.map((applicant: any, index: number) => {
          applicant.state = false;
          applicant.sequenceNo = index;

          return applicant;
        });

      const scores =
        applicants &&
        applicants.map((applicant: any) => {
          const tempScoreArray: Array<PsbScores> = [];
          if (parseInt(applicant.psb_1) > 0)
            tempScoreArray.push({ id: 1, score: applicant.psb_1 });
          if (parseInt(applicant.psb_2) > 0)
            tempScoreArray.push({ id: 2, score: applicant.psb_2 });
          if (parseInt(applicant.psb_3) > 0)
            tempScoreArray.push({ id: 3, score: applicant.psb_3 });
          if (parseInt(applicant.psb_4) > 0)
            tempScoreArray.push({ id: 4, score: applicant.psb_4 });
          if (parseInt(applicant.psb_5) > 0)
            tempScoreArray.push({ id: 5, score: applicant.psb_5 });
          if (parseInt(applicant.psb_6) > 0)
            tempScoreArray.push({ id: 6, score: applicant.psb_6 });
          if (parseInt(applicant.psb_7) > 0)
            tempScoreArray.push({ id: 7, score: applicant.psb_7 });
          if (parseInt(applicant.psb_8) > 0)
            tempScoreArray.push({ id: 8, score: applicant.psb_8 });
          const applicantScores = tempScoreArray;
          return applicantScores;
        });

      setApplicantScores(scores);
      setApplicantList(applicants);
      setApplicantListIsLoaded(true);
      const {
        allPsbSubmitted,
        dateOfPanelInterview,
        interviewDone,
        numberOfApplicants,
        numberOfInterviewedApplicants,
        numberOfQualifiedApplicants,
        salaryGrade,
        positionDetails: { postingStatus },
      } = swrApplicants.data; //! changed --added data
      setPublicationDetails({
        allPsbSubmitted,
        dateOfPanelInterview,
        interviewDone,
        numberOfApplicants,
        numberOfInterviewedApplicants,
        numberOfQualifiedApplicants,
        salaryGrade,
        positionDetails: {
          postingStatus,
        },
      });
    }
  }, [swrApplicants, applicantListIsLoaded]);

  return (
    <>
      <AppSelectionPdsAlert
        alertState={pdsAlertState}
        setAlertState={setPdsAlertState}
        closeAlertAction={pdsAlertCloseAction}
      />
      <div className="min-h-auto max-h-[24rem] overflow-y-auto overflow-x-auto bg-slate-100 py-5 rounded-md">
        {applicantList.length > 0 ? (
          <div className="px-5 min-w-[60rem] ">
            <div className="flex w-full grid-cols-5 gap-4 border-b border-gray-400 w-100">
              <div className="col-span-1 w-[5%] flex justify-center items-center">
                <p className="text-xs font-light"></p>
              </div>

              <div className="col-span-1 w-[5%] flex justify-center items-center">
                <p className="font-light whitespace-nowrap">Rank</p>
              </div>
              <div className="col-span-1 w-[20%]  flex justify-left">
                <p className="font-light whitespace-nowrap">
                  Name of Applicants
                </p>
              </div>

              <div className="col-span-1 w-[70%]">
                {selectedPublication.salaryGradeLevel &&
                selectedPublication.salaryGradeLevel <= 23 ? (
                  <div className="flex w-full">
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 1</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 2</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 3</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 4</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 5</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 6</p>
                    </div>

                    {/* {applicantScores && applicantScores.map((appScore, index: number) => {
                                    return (<div key={index} className="flex items-center w-full justify-left">
                                        <p className="font-light">PSB {index + 1}</p>
                                    </div>)
                                })} */}

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light">Average</p>
                    </div>
                  </div>
                ) : selectedPublication.salaryGradeLevel &&
                  selectedPublication.salaryGradeLevel === 24 ? (
                  <div className="flex w-full">
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 1</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 2</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 3</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 4</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 5</p>
                    </div>

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 6</p>
                    </div>

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 7</p>
                    </div>

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 8</p>
                    </div>

                    {/* {applicantScores && applicantScores.map((appScore, index: number) => {
                                    return (<div key={index} className="flex items-center w-full justify-left">
                                        <p className="font-light">PSB {index + 1}</p>
                                    </div>)
                                })} */}

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light">Average</p>
                    </div>
                  </div>
                ) : selectedPublication.salaryGradeLevel &&
                  selectedPublication.salaryGradeLevel >= 25 ? (
                  <div className="flex w-full">
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 1</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 2</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 3</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 4</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 5</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 6</p>
                    </div>
                    <div className="flex items-center w-full justify-left">
                      <p className="font-light whitespace-nowrap">PSB 7</p>
                    </div>

                    {/* {applicantScores && applicantScores.map((appScore, index: number) => {
                                    return (<div key={index} className="flex items-center w-full justify-left">
                                        <p className="font-light">PSB {index + 1}</p>
                                    </div>)
                                })} */}

                    <div className="flex items-center w-full justify-left">
                      <p className="font-light">Average</p>
                    </div>
                  </div>
                ) : (
                  <>No Records Found</>
                )}
              </div>
              <div className="col-span-1 w-[5%]">
                <p className="font-light"></p>
              </div>
            </div>
            <ul className="divide-y">
              {applicantList.map(
                (applicant: ApplicantWithScores, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`flex items-center w-full grid-cols-5 gap-4 justify-left hover:bg-indigo-100  ${
                        applicant.state && 'bg-slate-300 '
                      }  `}
                    >
                      <div className="w-[5%] flex justify-center">
                        <input
                          type="checkbox"
                          onChange={() =>
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions

                            onSelect(applicant.sequenceNo)
                          }
                          checked={
                            swrApplicants?.data.positionDetails
                              .postingStatus ===
                            'Appointing authority selection'
                              ? applicant.state
                                ? true
                                : false
                              : applicant.isSelectedByAppointingAuthority === 1
                              ? true
                              : false
                          }
                          className={`${
                            swrApplicants?.data.positionDetails
                              .postingStatus ===
                            'Appointing authority selection'
                              ? applicant.state
                                ? ''
                                : ''
                              : applicant.isSelectedByAppointingAuthority === 1
                              ? ''
                              : 'hidden'
                          } p-2 mr-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500`}
                        />
                      </div>

                      <li
                        onClick={() =>
                          swrApplicants.data.positionDetails.postingStatus ===
                          'Appointing authority selection'
                            ? onSelect(applicant.sequenceNo!)
                            : {}
                        }
                        className={`flex grid-cols-3 items-center  gap-4 w-[95%] hover:cursor-pointer  border-l-transparent py-5 transition-colors ease-in-out hover:border-l-indigo-500 `}
                      >
                        <div className="w-[5%] flex justify-center items-center">
                          {/* <RankingPopover data={applicant} /> */}
                          {applicant.rank}
                        </div>
                        <div className="w-[20%] ">
                          <p className="font-medium text-gray-600">
                            {applicant.applicantName}
                          </p>
                        </div>

                        <div className="w-[75%]">
                          <div className="flex w-full gap-4">
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">
                                {isEmpty(applicant.psb_1)
                                  ? `0.00`
                                  : applicant.psb_1}
                              </p>
                            </div>
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">
                                {isEmpty(applicant.psb_2)
                                  ? `0.00`
                                  : applicant.psb_2}
                              </p>
                            </div>
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">
                                {isEmpty(applicant.psb_3)
                                  ? `0.00`
                                  : applicant.psb_3}
                              </p>
                            </div>
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">
                                {isEmpty(applicant.psb_4)
                                  ? `0.00`
                                  : applicant.psb_4}
                              </p>
                            </div>
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">
                                {isEmpty(applicant.psb_5)
                                  ? `0.00`
                                  : applicant.psb_5}
                              </p>
                            </div>
                            {selectedPublication.salaryGradeLevel <= 23 && (
                              <div className="flex items-center w-full justify-left">
                                <p className="font-normal">
                                  {isEmpty(applicant.psb_6)
                                    ? `0.00`
                                    : applicant.psb_6}
                                </p>
                              </div>
                            )}
                            {selectedPublication.salaryGradeLevel >= 25 && (
                              <div className="flex items-center w-full justify-left">
                                <p className="font-normal">
                                  {isEmpty(applicant.psb_7)
                                    ? `0.00`
                                    : applicant.psb_7}
                                </p>
                              </div>
                            )}
                            {selectedPublication.salaryGradeLevel == 24 && (
                              <div className="flex items-center w-full justify-left">
                                <p className="font-normal">
                                  {isEmpty(applicant.psb_8)
                                    ? `0.00`
                                    : applicant.psb_8}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center w-full justify-left">
                              <p className="font-normal">{applicant.average}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <div className="w-[5%]">
                        <div className="flex items-center justify-center w-full font-medium text-gray-600 hover:cursor-pointer">
                          <button
                            tabIndex={-1}
                            className="px-1 text-white rounded"
                            onClick={() => {
                              setSelectedApplicantDetails({
                                applicantId: applicant.applicantId,
                                applicantType: applicant.applicantType,
                              });
                              setPdsAlertState(true);
                            }}
                          >
                            <span className="text-indigo-600 underline uppercase">
                              Pds
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </ul>
          </div>
        ) : (
          <>
            <div className="flex items-center w-full h-full text-gray-500 uppercase justify-left animate-pulse">
              No Applicant Data
            </div>
          </>
        )}
      </div>
    </>
  );
};
