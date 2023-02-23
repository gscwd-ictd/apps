import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Applicant } from '../../../types/applicant.type';
import { ApplicantWithScores, PsbScores } from '../../../types/selection.type';

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

  // initialize url to get applicant
  // const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/${vppId}`;

  const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/interview-rating/${selectedPublicationId}`;

  // use swr
  const { data } = useSWR([applicantGetUrl, random], fetchWithSession);

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
    if (data && applicantListIsLoaded === false) {
      console.log(data);

      const fetchedData: any = [...data.ranking];

      const applicants = fetchedData.map((applicant: any, index: number) => {
        applicant.state = false;
        applicant.sequenceNo = index;

        return applicant;
      });

      const scores = applicants.map((applicant: any) => {
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
      } = data;
      setPublicationDetails({
        allPsbSubmitted,
        dateOfPanelInterview,
        interviewDone,
        numberOfApplicants,
        numberOfInterviewedApplicants,
        numberOfQualifiedApplicants,
        salaryGrade,
      });
    }
  }, [data]);

  return (
    <div className="min-h-auto max-h-[24rem] overflow-y-auto bg-slate-100 py-5 rounded-md">
      {applicantList.length > 0 ? (
        <div className="px-5">
          <div className="flex grid-cols-3 w-full gap-4 border-b border-gray-400">
            <div className="col-span-1 w-[5%] flex justify-center">
              <p className="font-light">Rank</p>
            </div>
            <div className="col-span-1 w-[20%]">
              <p className="font-light">Name of Applicants</p>
            </div>
            <div className="col-span-1 w-[70%]">
              <div className="w-full flex">
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 1</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 2</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 3</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 4</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 5</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 6</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 7</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <p className="font-light">PSB 8</p>
                </div>
                {/* {applicantScores && applicantScores.map((appScore, index: number) => {
                                    return (<div key={index} className="w-full flex justify-center items-center">
                                        <p className="font-light">PSB {index + 1}</p>
                                    </div>)
                                })} */}

                <div className="w-full flex justify-center items-center">
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
                return (
                  <li
                    key={index}
                    onClick={() => onSelect(applicant.sequenceNo!)}
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
                      <div className="w-full flex">
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_1)
                              ? `0.00`
                              : applicant.psb_1}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_2)
                              ? `0.00`
                              : applicant.psb_2}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_3)
                              ? `0.00`
                              : applicant.psb_3}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_4)
                              ? `0.00`
                              : applicant.psb_4}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_5)
                              ? `0.00`
                              : applicant.psb_5}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_6)
                              ? `0.00`
                              : applicant.psb_6}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_7)
                              ? `0.00`
                              : applicant.psb_7}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                          <p className="font-normal">
                            {isEmpty(applicant.psb_8)
                              ? `0.00`
                              : applicant.psb_8}
                          </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
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
                        // onChange={() => onSelect(applicant.sequenceNo!)}
                        checked={applicant.state ? true : false}
                        className="mr-2 cursor-pointer rounded-sm border-2 border-gray-300 p-2 transition-colors checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
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
          <div className="w-full h-full flex justify-center items-center animate-pulse text-gray-500 uppercase">
            No Applicant Data
          </div>
        </>
      )}
    </div>
  );
};
