/* eslint-disable @nx/enforce-module-boundaries */
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Applicant } from '../../../types/applicant.type';

export const AllApplicantsListSummary = () => {
  const vppId = useAppEndStore((state) => state.selectedPublicationId);

  const applicantList = useAppEndStore((state) => state.applicantList);

  const setApplicantList = useAppEndStore((state) => state.setApplicantList);

  // use swr
  const { data: swrApplicants } = useSWR(
    `/applicant-endorsement/shortlisted/${vppId}`,
    fetcherHRIS
  );

  useEffect(() => {
    if (swrApplicants) {
      const applicants = swrApplicants.data.map(
        (applicant: any, index: number) => {
          applicant.state = false;
          applicant.sequenceNo = index;
          return applicant;
        }
      );
      setApplicantList(applicants);
    }
  }, [swrApplicants]);

  return (
    <div className="mt-5 border-2 border-gray-200 rounded">
      <div className="px-4 py-2 text-lg text-gray-500">Applicants</div>
      <div className="w-full flex flex-col bg-indigo-100/50 rounded p-4 mt-2 text-gray-500 h-[10rem] overflow-y-auto">
        {applicantList.length > 0 ? (
          applicantList.map((applicant: Applicant, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-start w-full px-2"
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
            <div className="flex items-center justify-center w-full h-full text-gray-500 uppercase animate-pulse">
              No Applicant Data
            </div>
          </>
        )}
      </div>
    </div>
  );
};
