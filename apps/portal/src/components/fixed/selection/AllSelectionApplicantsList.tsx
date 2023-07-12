/* eslint-disable @nx/enforce-module-boundaries */
import { Pds } from 'apps/pds/src/store/pds.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Applicant } from '../../../types/applicant.type';
import { ApplicantWithScores, PsbScores } from '../../../types/selection.type';
import { ActionDropdown } from '../dropdown/ActionDropdown';
import { AppSelectionPdsAlert } from './AppSelectionPdsAlert';
import { AppSelectionPsbDetailsAlert } from './AppSelectionPsbDetailsAlert';

export const AllSelectionApplicantsList = () => {
  const [applicantListIsLoaded, setApplicantListIsLoaded] =
    useState<boolean>(false);

  // for the alert component for pds
  // const [pdsAlertState, setPdsAlertState] = useState<boolean>(false);

  // use this to assign as a parameter in useSWR

  const {
    applicantList,
    applicantScores,
    selectedApplicantDetails,
    selectedPublication,
    selectedPublicationId,
    dropdownAction,
    showPdsAlert,
    showPsbDetailsAlert,
    setShowPsbDetailsAlert,
    setShowPdsAlert,
    setDropdownAction,
    setApplicantList,
    setApplicantScores,
    setPublicationDetails,
    setSelectedApplicantDetails,
    setSelectedApplicants,
    setPsbDetails,
    setPds,
  } = useAppSelectionStore((state) => ({
    applicantList: state.applicantList,
    applicantScores: state.applicantScores,
    selectedPublicationId: state.selectedPublicationId,
    selectedApplicantDetails: state.selectedApplicantDetails,
    selectedPublication: state.selectedPublication,
    dropdownAction: state.dropdownAction,
    showPdsAlert: state.showPdsAlert,
    showPsbDetailsAlert: state.showPsbDetailsAlert,
    setPsbDetails: state.setPsbDetails,
    setShowPsbDetailsAlert: state.setShowPsbDetailsAlert,
    setDropdownAction: state.setDropdownAction,
    setPds: state.setPds,
    setApplicantScores: state.setApplicantScores,
    setPublicationDetails: state.setPublicationDetails,
    setApplicantList: state.setApplicantList,
    setSelectedApplicants: state.setSelectedApplicants,
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
    setShowPdsAlert: state.setShowPdsAlert,
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
    setSelectedApplicantDetails({
      applicantAvgScore: '',
      applicantId: '',
      applicantName: '',
      applicantType: '',
      postingApplicantId: '',
      positionTitle: '',
      rank: '',
    });
    setDropdownAction('');
  };

  const psbDetailsAlertCloseAction = () => {
    setSelectedApplicantDetails({
      applicantAvgScore: '',
      applicantId: '',
      applicantName: '',
      applicantType: '',
      postingApplicantId: '',
      positionTitle: '',
      rank: '',
    });
    setPsbDetails([]);
    setDropdownAction('');
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
        alertState={showPdsAlert}
        setAlertState={setShowPdsAlert}
        closeAlertAction={pdsAlertCloseAction}
      />
      <AppSelectionPsbDetailsAlert
        alertState={showPsbDetailsAlert}
        setAlertState={setShowPsbDetailsAlert}
        closeAlertAction={psbDetailsAlertCloseAction}
      />
      <div className="min-h-auto max-h-[24rem] overflow-y-auto overflow-x-auto bg-slate-100 py-5 rounded-md m-2">
        {applicantList.length > 0 ? (
          <div className="px-5 min-w-[60rem] ">
            <div className="flex w-full grid-cols-6 border-b border-gray-400">
              <div className="col-span-1 w-[2%] flex justify-center items-center">
                <p className="text-xs font-light"></p>
              </div>

              <div className="flex w-[93%] col-span-4 grid-cols-4">
                <div className="col-span-1 w-[5%] flex justify-center items-center">
                  <p className="font-light">Rank</p>
                </div>

                <div className="col-span-1 w-[23%] flex justify-start">
                  <p className="font-light">Name of Applicants</p>
                </div>

                <div className="col-span-2 w-[75%] flex">
                  {selectedPublication.salaryGradeLevel &&
                  selectedPublication.salaryGradeLevel <= 23 ? (
                    <div className="flex w-full grid-cols-2">
                      <div className="col-span-1 flex w-[80%]">
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 1</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 2</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 3</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 4</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 5</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 6</p>
                        </div>
                      </div>

                      <div className="items-center w-[20%] flex justify-center   col-span-1">
                        <p className="font-light">Average</p>
                      </div>
                    </div>
                  ) : selectedPublication.salaryGradeLevel &&
                    selectedPublication.salaryGradeLevel === 24 ? (
                    <div className="flex w-full grid-cols-2">
                      <div className="col-span-1 flex w-[80%]">
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 1</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 2</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 3</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 4</p>
                        </div>
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 5</p>
                        </div>

                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 6</p>
                        </div>

                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 7</p>
                        </div>

                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 8</p>
                        </div>
                      </div>

                      <div className="flex w-[20%] items-center justify-center  col-span-1">
                        <p className="font-light">Average</p>
                      </div>
                    </div>
                  ) : selectedPublication.salaryGradeLevel &&
                    selectedPublication.salaryGradeLevel >= 26 ? (
                    <div className="flex w-full grid-cols-2">
                      <div className="col-span-1 flex w-[80%]">
                        <div className="flex items-center w-full justify-center  col-span-1">
                          <p className="font-light">PSB 1</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 2</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 3</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 4</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 5</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 6</p>
                        </div>
                        <div className="flex items-center w-full justify-center col-span-1">
                          <p className="font-light">PSB 7</p>
                        </div>
                      </div>

                      <div className="flex w-[20%] items-center justify-center col-span-1">
                        <p className="font-light">Average</p>
                      </div>
                    </div>
                  ) : (
                    <>No Records Found</>
                  )}
                </div>
              </div>

              <div className="col-span-1 flex w-[5%] justify-center items-center  ">
                <p className="font-light flex justify-center items-center">
                  Actions
                </p>
              </div>
            </div>
            <ul className="divide-y">
              {applicantList.map(
                (applicant: ApplicantWithScores, index: number) => {
                  return (
                    <li
                      key={index}
                      className={`flex items-center w-full  hover:bg-indigo-100  ${
                        applicant.state && 'bg-slate-300 '
                      }  `}
                    >
                      <div
                        className={`flex grid-cols-6 items-center w-full transition-colors ease-in-out`}
                      >
                        <div className="w-[2%] flex items-center col-span-1 ">
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
                                : applicant.isSelectedByAppointingAuthority ===
                                  1
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
                                : applicant.isSelectedByAppointingAuthority ===
                                  1
                                ? ''
                                : 'hidden'
                            } m-2 p-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500`}
                          />
                        </div>

                        <div
                          onClick={() =>
                            swrApplicants.data.positionDetails.postingStatus ===
                            'Appointing authority selection'
                              ? onSelect(applicant.sequenceNo!)
                              : {}
                          }
                          className="flex w-[93%] py-5 col-span-4 grid-cols-4 hover:cursor-pointer"
                        >
                          <div className="w-[5%] flex justify-center col-span-1  items-center">
                            {applicant.rank}
                          </div>

                          <div className="w-[23%] flex justify-start items-center col-span-1 ">
                            <p className="font-medium text-gray-600">
                              {applicant.applicantName}
                            </p>
                          </div>

                          <div className="w-[75%] flex items-center col-span-2 justify-center">
                            {selectedPublication.salaryGradeLevel &&
                            selectedPublication.salaryGradeLevel <= 23 ? (
                              <div className="flex w-full grid-cols-2">
                                <div className="w-[80%] flex col-span-1">
                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_1)
                                        ? `0.00`
                                        : applicant.psb_1}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_2)
                                        ? `0.00`
                                        : applicant.psb_2}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_3)
                                        ? `0.00`
                                        : applicant.psb_3}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_4)
                                        ? `0.00`
                                        : applicant.psb_4}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_5)
                                        ? `0.00`
                                        : applicant.psb_5}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center ">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_6)
                                        ? `0.00`
                                        : applicant.psb_6}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center w-[20%] justify-center ">
                                  <p className="font-normal">
                                    {applicant.average}
                                  </p>
                                </div>
                              </div>
                            ) : selectedPublication.salaryGradeLevel &&
                              selectedPublication.salaryGradeLevel === 24 ? (
                              <div className="flex w-full grid-cols-2">
                                <div className="flex w-[80%] col-span-1">
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_1)
                                        ? `0.00`
                                        : applicant.psb_1}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_2)
                                        ? `0.00`
                                        : applicant.psb_2}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_3)
                                        ? `0.00`
                                        : applicant.psb_3}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_4)
                                        ? `0.00`
                                        : applicant.psb_4}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_5)
                                        ? `0.00`
                                        : applicant.psb_5}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_6)
                                        ? `0.00`
                                        : applicant.psb_6}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_7)
                                        ? `0.00`
                                        : applicant.psb_7}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_8)
                                        ? `0.00`
                                        : applicant.psb_8}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center w-[20%] justify-center">
                                  <p className="font-normal">
                                    {applicant.average}
                                  </p>
                                </div>
                              </div>
                            ) : selectedPublication.salaryGradeLevel &&
                              selectedPublication.salaryGradeLevel >= 26 ? (
                              <div className="flex w-full grid-cols-2">
                                <div className="flex w-[80%] col-span-1">
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_1)
                                        ? `0.00`
                                        : applicant.psb_1}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_2)
                                        ? `0.00`
                                        : applicant.psb_2}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_3)
                                        ? `0.00`
                                        : applicant.psb_3}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_4)
                                        ? `0.00`
                                        : applicant.psb_4}
                                    </p>
                                  </div>
                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_5)
                                        ? `0.00`
                                        : applicant.psb_5}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_6)
                                        ? `0.00`
                                        : applicant.psb_6}
                                    </p>
                                  </div>

                                  <div className="flex items-center w-full justify-center">
                                    <p className="font-normal">
                                      {isEmpty(applicant.psb_7)
                                        ? `0.00`
                                        : applicant.psb_7}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center w-[20%] justify-center">
                                  <p className="font-normal">
                                    {applicant.average}
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex col-span-1 items-center justify-center w-[5%] font-medium text-gray-600 hover:cursor-pointer">
                          <ActionDropdown applicant={applicant} />
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        ) : (
          <>
            <div className="flex items-center w-full h-full text-gray-500 uppercase justify-start animate-pulse">
              No Applicant Data
            </div>
          </>
        )}
      </div>
    </>
  );
};
