/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import React, { useEffect } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import useSWR from 'swr';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import LoadingVisual from '../loading/LoadingVisual';
import ordinal from 'ordinal-number-suffix';

type AppSelectionPsbDetailsAlertProps = {
  alertState: boolean;
  setAlertState: React.Dispatch<React.SetStateAction<boolean>>;
  closeAlertAction: () => void;
};

export const AppSelectionPsbDetailsAlert = ({
  alertState,
  setAlertState,
  closeAlertAction,
}: AppSelectionPsbDetailsAlertProps) => {
  const {
    applicantList,
    psbDetails,
    selectedApplicantDetails,
    getPsbDetails,
    getPsbDetailsFail,
    getPsbDetailsSuccess,
  } = useAppSelectionStore((state) => ({
    applicantList: state.applicantList,
    psbDetails: state.psbDetails,
    selectedApplicantDetails: state.selectedApplicantDetails,
    getPsbDetails: state.getPsbDetails,
    getPsbDetailsSuccess: state.getPsbDetailsSuccess,
    getPsbDetailsFail: state.getPsbDetailsFail,
  }));

  const {
    data: swrPsbDetails,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    selectedApplicantDetails.postingApplicantId
      ? `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb-applicants/remarks/${selectedApplicantDetails.postingApplicantId}`
      : null,
    fetcherHRIS,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (swrIsLoading) {
      getPsbDetails();
    }
  }, [swrIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrPsbDetails)) {
      // swrPsbDetails.data.map
      getPsbDetailsSuccess(
        swrPsbDetails.data,
        applicantList,
        selectedApplicantDetails
      );
    }

    if (!isEmpty(swrError)) {
      getPsbDetailsFail(swrError.message);
    }
  }, [swrPsbDetails, swrError]);

  useEffect(() => {
    if (!alertState) closeAlertAction();
  }, [alertState]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <Modal
      open={alertState}
      setOpen={setAlertState}
      size={`${windowWidth > 1024 ? 'lg' : 'full'}`}
    >
      <Modal.Body>
        {swrIsLoading ? (
          <LoadingVisual />
        ) : (
          <div className="sm:p-2 md:p-2 lg:p-5">
            <div className="px-2 flex justify-between w-full pb-5">
              <div className="flex items-center gap-2 px-2">
                <i className="text-slate-500 text-7xl bx bxs-user-circle"></i>
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold text-gray-800">
                    {selectedApplicantDetails.applicantName}
                  </div>
                  <span className="text-lg text-gray-700">
                    {selectedApplicantDetails.positionTitle} Applicant
                  </span>
                </div>
              </div>
              <div className="text-lg text-gray-700 mt-2">
                <div className="w-full flex flex-col">
                  <div>
                    <span className="">Rank: </span>
                    <span className=" font-semibold">
                      {ordinal(parseInt(selectedApplicantDetails.rank))}
                    </span>
                  </div>
                  <div>
                    Average rating:{' '}
                    <span className="underline font-semibold">
                      {selectedApplicantDetails.applicantAvgScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="p-2">
              {psbDetails &&
                psbDetails.map((psb) => {
                  return (
                    <div key={psb.psbNo}>
                      {!isEmpty(psb.psbName) ? (
                        <>
                          <section className="bg-indigo-900 rounded-md m-10 px-5 py-4">
                            <div className="flex flex-col">
                              <div className="text-white text-2xl">
                                <span className="font-semibold">
                                  {psb.psbName}
                                </span>
                              </div>
                              <div className="text-white text-xl flex gap-2">
                                <span className="text-gray-200 font-light">
                                  Interview Rating:
                                </span>
                                <span>{psb.score}</span>
                              </div>
                              <div className="text-white pt-5">
                                {!isEmpty(psb.remarks) ? (
                                  <div className="text-lg flex flex-col gap-2">
                                    <span className="italic font-extralight px-2 text-justify">
                                      ❝ {psb.remarks} ❞
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-lg flex gap-2">
                                    <span className="">No remarks</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </section>
                        </>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
