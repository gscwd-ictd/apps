/* eslint-disable @nx/enforce-module-boundaries */
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

  const showPds = useAppEndStore((state) => state.showPds);

  const setShowPds = useAppEndStore((state) => state.setShowPds);

  const setApplicantList = useAppEndStore((state) => state.setApplicantList);

  const setSelectedApplicantDetails = useAppEndStore(
    (state) => state.setSelectedApplicantDetails
  );

  // use swr
  const { data: swrApplicants } = useSWR(
    `/applicant-endorsement/${vppId}/all`,
    fetcherHRIS,
    {
      revalidateOnFocus: false,
    }
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
                className="flex w-full py-3 items-center pr-2 border-b border-l-[5px] border-b-gray-100 border-l-transparent hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div
                  className="flex items-center justify-between w-full p-5 transition-colors ease-in-out cursor-pointer"
                  key={index}
                  onClick={() => {
                    onSelect(applicant.sequenceNo!);
                    // setSelectedApplicantDetails({
                    //   applicantId: applicant.applicantId,
                    //   applicantType: applicant.applicantType,
                    // });
                  }}
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
                </div>
                <div className="flex items-center justify-center text-indigo-400 border border-indigo-200 rounded h-7 bg-indigo-50 hover:bg-indigo-500 hover:text-white">
                  <button
                    className="w-[4rem] flex items-center justify-center"
                    onClick={() => {
                      setSelectedApplicantDetails({
                        applicantId: applicant.applicantId,
                        applicantType: applicant.applicantType,
                      });
                      setShowPds(true);
                    }}
                  >
                    <div className="text-xs ">View PDS</div>
                  </button>
                </div>
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
