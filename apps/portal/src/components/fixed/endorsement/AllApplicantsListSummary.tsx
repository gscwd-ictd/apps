import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Applicant } from '../../../types/applicant.type';

export const AllApplicantsListSummary = () => {
  // const [applicantListIsLoaded, setApplicantListIsLoaded] = useState<boolean>(false);

  // use this to assign as a parameter in useSWR
  const random = useRef(Date.now());

  const vppId = useAppEndStore((state) => state.selectedPublicationId);

  const applicantList = useAppEndStore((state) => state.applicantList);

  const setApplicantList = useAppEndStore((state) => state.setApplicantList);

  // initialize url to get applicant
  const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/shortlisted/${vppId}`;

  // use swr
  const { data } = useSWR([applicantGetUrl, random], fetchWithSession);

  useEffect(() => {
    if (data) {
      const applicants = data.map((applicant: any, index: number) => {
        applicant.state = false;
        applicant.sequenceNo = index;
        return applicant;
      });
      setApplicantList(applicants);
    }
  }, [data]);

  return (
    <>
      <div className="pl-4 mt-5 text-gray-500">Applicants:</div>
      <div className="w-full flex flex-col bg-slate-100 rounded p-4 mt-2 text-gray-500 h-[10rem] overflow-y-scroll">
        {applicantList.length > 0 ? (
          applicantList.map((applicant: Applicant, index: number) => {
            return (
              <div
                key={index}
                className="w-full flex flex-col justify-start px-4"
              >
                <span className="flex w-full gap-2 font-light">
                  <div className="w-[2rem]">{index + 1}.</div>
                  <div>{applicant.applicantName}</div>
                </span>
              </div>
            );
          })
        ) : (
          <>
            <div className="w-full h-full flex justify-center items-center animate-pulse text-gray-500 uppercase">
              No Applicant Data
            </div>
          </>
        )}
      </div>
    </>
  );
};
