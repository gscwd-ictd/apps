/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react';
import useSWR from 'swr';

import { useAppEndStore } from '../../../store/endorsement.store';
import { Applicant } from '../../../types/applicant.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';

export const AllApplicantsList = () => {
  const vppId = useAppEndStore((state) => state.selectedPublicationId);

  const applicantList = useAppEndStore((state) => state.applicantList);

  const setSelectedApplicants = useAppEndStore(
    (state) => state.setSelectedApplicants
  );

  const setApplicantList = useAppEndStore((state) => state.setApplicantList);

  // initialize url to get applicant
  // const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/${vppId}/all`;

  // use swr
  const { data: swrApplicants } = useSWR(
    `/applicant-endorsement/${vppId}/all`,
    fetcherHRIS
  );


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
    const selectedApplicants: Array<Applicant> = [];

    // map all applicant list
    applicantList.map((applicant) => {
      // add this applicant if it is checked
      applicant.state === true && selectedApplicants.push(applicant);
    });

    // set selected applicants state
    setSelectedApplicants(selectedApplicants);
  };

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
    <>
      {applicantList.length > 0 ? (
        <ul>
          {applicantList.map((applicant: Applicant, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(applicant.sequenceNo!)}
                className="flex cursor-pointer items-center justify-between border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <p className="font-medium text-gray-600">
                    {applicant.applicantName}
                  </p>
                </div>
                <input
                  type="checkbox"
                  onChange={() => (applicant: Applicant) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    applicant.state;
                  }}
                  checked={applicant.state ? true : false}
                  className="p-2 mr-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <>
          <div className="flex items-center justify-center w-full h-full text-gray-500 uppercase animate-pulse">
            No Applicant Data
          </div>
        </>
      )}
    </>
  );
};
