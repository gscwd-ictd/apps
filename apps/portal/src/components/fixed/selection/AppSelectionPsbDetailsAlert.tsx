/* eslint-disable @nx/enforce-module-boundaries */
import { Alert, Modal } from '@gscwd-apps/oneui';
import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import React, { useEffect } from 'react';
import { AppSelectionPds } from './AppSelectionPds';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import useSWR from 'swr';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import LoadingVisual from '../loading/LoadingVisual';

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
        selectedApplicantDetails.postingApplicantId
      );
      // console.log(swrPsbDetails.data);
      console.log(applicantList);
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
      size={`${windowWidth > 1024 ? 'full' : 'full'}`}
    >
      <Modal.Body>
        {swrIsLoading ? (
          <LoadingVisual />
        ) : (
          <div className="sm:p-2 md:p-2 lg:p-5">
            <div className="px-2 flex flex-col pb-5">
              <span className="text-2xl font-semibold">
                {selectedApplicantDetails.applicantName}
              </span>
              <span className="text-lg ">
                Average score:{' '}
                <span className="underline">
                  {selectedApplicantDetails.applicantAvgScore}
                </span>
              </span>
            </div>
            <table className="table-fixed w-full">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="px-2">PSB Member</th>
                  <th className="px-2">Name</th>
                  <th className="px-2">Score</th>
                  <th className="px-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {psbDetails &&
                  psbDetails.map((psb) => {
                    return (
                      <tr
                        key={psb.psbNo}
                        className="odd:bg-indigo-100 even:bg-slate-100 "
                      >
                        <td className="p-2">{psb.psbNo ?? '--'}</td>
                        <td className="p-2 text-lg">{psb.psbName ?? '--'}</td>
                        <td className="p-2 flex justify-center items-center">
                          {!isEmpty(psb.score) && parseInt(psb.score) > 0
                            ? psb.score
                            : '--'}
                        </td>
                        <td className="p-2 break-words">
                          {!isEmpty(psb.remarks) ? (
                            psb.remarks
                          ) : (
                            <span className="flex w-full justify-center items-center">
                              --
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
