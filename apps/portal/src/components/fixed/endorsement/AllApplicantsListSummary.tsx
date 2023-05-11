/* eslint-disable @nx/enforce-module-boundaries */
import { Pds } from 'apps/pds/src/store/pds.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Applicant } from '../../../types/applicant.type';
import { AppEndPds } from './AppEndPds';

export const AllApplicantsListSummary = () => {
  const {
    vppId,
    showPds,
    applicantList,
    selectedApplicantDetails,
    setSelectedApplicantDetails,
    setApplicantList,
    setShowPds,
    setPds,
  } = useAppEndStore((state) => ({
    showPds: state.showPds,
    selectedApplicantDetails: state.selectedApplicantDetails,
    vppId: state.selectedPublicationId,
    applicantList: state.applicantList,
    setShowPds: state.setShowPds,
    setApplicantList: state.setApplicantList,
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
    setPds: state.setPds,
  }));

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
    <div className="mt-5 transition-all ease-in-out">
      <div className="flex items-center justify-between w-full grid-cols-2">
        <div className="px-2 text-gray-500 text-md">Shortlisted Applicants</div>
        <div className="col-span-1 px-5 mt-5 mb-2 font-light text-gray-500">
          <button
            type="button"
            tabIndex={-1}
            className="text-sm font-medium text-indigo-700"
            onClick={() => {
              setPds({} as Pds);
              setShowPds(!showPds);
            }}
          >
            {showPds ? 'Hide PDS' : 'Show PDS'}
          </button>
        </div>
      </div>
      {/* <div className="w-full flex flex-col bg-indigo-100/50 rounded p-4 mt-2 text-gray-500 h-[10rem] overflow-y-auto">
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
      </div> */}
      <div className="flex w-full grid-cols-2 gap-5 ">
        <ul
          className={`border-2 rounded w-full ${
            showPds === false ? 'col-span-2' : 'col-span-1'
          }`}
        >
          {applicantList.map((applicant: Applicant, index: number) => {
            return (
              <li
                key={index}
                className="flex w-full items-center pr-2 border-b border-l-[5px] border-b-gray-100 border-l-transparent hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div
                  className="flex items-center justify-between w-full p-5 transition-colors ease-in-out cursor-pointer"
                  key={index}
                >
                  <div>
                    <p className="font-medium text-gray-600">
                      {applicant.applicantName}
                    </p>
                  </div>
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
        {showPds ? (
          <section className="w-full h-[32rem] bg-gray-100 border-2 rounded overflow-y-auto">
            {/** PDS COMPONENT */}
            <AppEndPds applicantDetails={selectedApplicantDetails} />
          </section>
        ) : null}
      </div>
    </div>
  );
};
