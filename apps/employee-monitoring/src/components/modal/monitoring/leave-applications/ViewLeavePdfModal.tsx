/* eslint-disable @nx/enforce-module-boundaries */
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import LeavePdf from '../../../pdf/LeavePdf';
import { LoadingSpinner, Modal, PageContentContext, ToastNotification } from '@gscwd-apps/oneui';
import { MonitoringLeave } from 'libs/utils/src/lib/types/leave-application.type';
import { isEmpty } from 'lodash';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';

type ViewLeavePdfModalProps = {
  rowData: MonitoringLeave;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};
const ViewLeavePdfModal: FunctionComponent<ViewLeavePdfModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // leave application store
  const {
    leaveIndividualDetail,
    GetLeaveIndividualDetail,
    GetLeaveIndividualDetailSuccess,
    GetLeaveIndividualDetailFail,
  } = useLeaveApplicationStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    GetLeaveIndividualDetail: state.getLeaveIndividualDetail,
    GetLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    GetLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
  }));

  // leave ledger store
  const { selectedLeaveLedger, setSelectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
  }));

  // fetch leave details
  const {
    data: swrLeaveDetails,
    isLoading: swrLeaveDetailsLoading,
    error: swrLeaveDetailsError,
  } = useSWR(
    modalState ? `/leave-application/details/${rowData.employee?.employeeId}/${rowData.id}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // fetch leave ledger
  const { data: swrLeaveLedger, error: swrLedgerError } = useSWR(
    modalState && !isEmpty(leaveIndividualDetail)
      ? `/leave/ledger/${rowData.employee.employeeId}/${leaveIndividualDetail.employeeDetails?.companyId}`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveDetailsLoading) {
      GetLeaveIndividualDetail(true);
    }
  }, [swrLeaveDetailsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveDetails)) {
      GetLeaveIndividualDetailSuccess(swrLeaveDetailsLoading, swrLeaveDetails.data);
    }

    if (!isEmpty(swrLeaveDetailsError)) {
      GetLeaveIndividualDetailFail(swrLeaveDetailsLoading, swrLeaveDetailsError.message);
    }
  }, [swrLeaveDetails, swrLeaveDetailsError]);

  // success of leave ledger
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      setSelectedLeaveLedger(swrLeaveLedger.data, rowData.id);
    }
  }, [swrLeaveLedger]);

  // useEffect(() => {
  //   console.log(leaveIndividualDetail);
  // }, [leaveIndividualDetail]);

  return (
    <>
      {/* Notifications */}
      {!isEmpty(swrLeaveDetailsError) ? (
        <ToastNotification toastType="error" notifMessage={swrLeaveDetailsError} />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} size={'xl'} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-black">
            <span className="px-5">Leave Application Form</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {swrLeaveDetailsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <>
              <LeavePdf
                rowData={rowData}
                // employeeDetails={leaveApplicationDetails}
                leaveDetails={leaveIndividualDetail}
                selectedLeaveLedger={selectedLeaveLedger}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded"
              onClick={closeModalAction}
              type="button"
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewLeavePdfModal;
