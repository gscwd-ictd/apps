/* eslint-disable @nx/enforce-module-boundaries */
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Applicant } from '../../../types/applicant.type';
import { ApplicantWithScores, PsbScores } from '../../../types/selection.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';

export const AllSelectionApplicantsList = () => {
  const [applicantListIsLoaded, setApplicantListIsLoaded] =
    useState<boolean>(false);

  // use this to assign as a parameter in useSWR
  const random = useRef(Date.now());
  const applicantList = useAppSelectionStore((state) => state.applicantList);
  const applicantScores = useAppSelectionStore(
    (state) => state.applicantScores
  );
  const setSelectedApplicants = useAppSelectionStore(
    (state) => state.setSelectedApplicants
  );
  const setApplicantList = useAppSelectionStore(
    (state) => state.setApplicantList
  );
  const setPublicationDetails = useAppSelectionStore(
    (state) => state.setPublicationDetails
  );
  const setApplicantScores = useAppSelectionStore(
    (state) => state.setApplicantScores
  );
  const selectedPublicationId = useAppSelectionStore(
    (state) => state.selectedPublicationId
  );

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
    console.log(updatedApplicantList, 'updated applicants');
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
    console.log(swrApplicants, 'swrapplicants');
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
    <div className="min-h-auto max-h-[24rem] overflow-y-auto bg-slate-100 py-5 rounded-md">
      {applicantList.length > 0 ? (
        <div className="px-5">
          <div className="flex w-full grid-cols-3 gap-4 border-b border-gray-400">
            <div className="col-span-1 w-[5%] flex justify-center">
              <p className="font-light">Rank</p>
            </div>
            <div className="col-span-1 w-[20%]">
              <p className="font-light">Name of Applicants</p>
            </div>
            <div className="col-span-1 w-[70%]">
              <div className="flex w-full">
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 1</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 2</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 3</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 4</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 5</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 6</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 7</p>
                </div>
                <div className="flex items-center justify-center w-full">
                  <p className="font-light">PSB 8</p>
                </div>
                {/* {applicantScores && applicantScores.map((appScore, index: number) => {
                                    return (<div key={index} className="flex items-center justify-center w-full">
                                        <p className="font-light">PSB {index + 1}</p>
                                    </div>)
                                })} */}

                <div className="flex items-center justify-center w-full">
                  <p className="font-light">Average</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 w-[5%]">
              <p className="font-light"></p>
            </div>
          </div>
          <ul>
            {applicantList.map(
              (applicant: ApplicantWithScores, index: number) => {
                console.log(applicant.isSelectedByAppointingAuthority);
                return (
                  <li
                    key={index}
                    onClick={() =>
                      swrApplicants.data.positionDetails.postingStatus ===
                      'Appointing authority selection'
                        ? onSelect(applicant.sequenceNo!)
                        : {}
                    }
                    className={`flex grid-cols-3 items-center border-b gap-4 ${
                      applicant.state && 'bg-slate-300'
                    } w-full hover:cursor-pointer border-b-gray-100 border-l-transparent py-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-100`}
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
                    <div className="w-[70%] ">
                      <div className="flex w-full">
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_1)
                              ? `0.00`
                              : applicant.psb_1}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_2)
                              ? `0.00`
                              : applicant.psb_2}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_3)
                              ? `0.00`
                              : applicant.psb_3}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_4)
                              ? `0.00`
                              : applicant.psb_4}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_5)
                              ? `0.00`
                              : applicant.psb_5}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_6)
                              ? `0.00`
                              : applicant.psb_6}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_7)
                              ? `0.00`
                              : applicant.psb_7}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_8)
                              ? `0.00`
                              : applicant.psb_8}
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <p className="font-normal">{applicant.average}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-[5%] flex justify-end">
                      <input
                        type="checkbox"
                        onChange={() => (applicant: Applicant) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          applicant.state;
                        }}
                        checked={
                          swrApplicants?.data.positionDetails.postingStatus ===
                          'Appointing authority selection'
                            ? applicant.state
                              ? true
                              : false
                            : applicant.isSelectedByAppointingAuthority === 1
                            ? true
                            : false
                        }
                        className={`${
                          swrApplicants?.data.positionDetails.postingStatus ===
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
                  </li>
                );
              }
            )}
          </ul>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center w-full h-full text-gray-500 uppercase animate-pulse">
            No Applicant Data
          </div>
        </>
      )}
    </div>
  );
};
