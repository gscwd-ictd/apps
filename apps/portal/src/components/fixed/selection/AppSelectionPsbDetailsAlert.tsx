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
          <div className="sm:px-2 md:px-2 lg:px-5">
            <div className="flex justify-between w-full pb-5">
              <div className="flex items-center gap-2">
                <i className="text-slate-500 text-7xl bx bxs-user-circle"></i>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-gray-800">
                    {selectedApplicantDetails.applicantName}{' '}
                  </span>

                  <div className="flex gap-2">
                    <div className="text-lg font-semibold text-gray-800 ">
                      Rank {selectedApplicantDetails.rank}
                    </div>
                    <span className="text-lg"> • </span>

                    <span className="text-lg text-gray-500 font-medium">
                      {selectedApplicantDetails.positionTitle} Applicant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {psbDetails &&
              psbDetails.map((psb) => {
                return (
                  <div key={psb.psbNo}>
                    {!isEmpty(psb.psbName) && (
                      <div className="flex flex-col rounded bg-slate-100  px-5 py-4 shadow mb-2">
                        <div className="text-gray-800 text-xl flex gap-2">
                          <span className="font-semibold">PSB {psb.psbNo}</span>
                          <span className="text-gray-700"> • </span>
                          <span className="font-semibold">{psb.psbName}</span>
                          <span className="text-gray-700"> • </span>
                          <span className="text-gray-700 font-medium">
                            {psb.score}
                          </span>
                        </div>
                        <div className="text-gray-700 pt-5">
                          {!isEmpty(psb.remarks) ? (
                            <div className="text-md flex flex-col gap-2 ">
                              <span className="font-light px-2 text-justify">
                                ❝{psb.remarks}❞
                              </span>
                            </div>
                          ) : (
                            <div className="text-lg flex gap-2">
                              <span className="">No remarks</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
