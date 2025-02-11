import { Modal } from '@gscwd-apps/oneui';
import { FunctionComponent, useEffect, useState } from 'react';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import LeaveLedgerPdf from '../../../pdf/LeaveLedgerPdf';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import { isEmpty } from 'lodash';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type LeaveLedgerPdfModalProps = {
  printModalIsOpen: boolean;
  toggle: () => void;
  employeeData: EmployeeWithDetails;
};

const LeaveLedgerPdfModal: FunctionComponent<LeaveLedgerPdfModalProps> = ({
  printModalIsOpen,
  toggle,
  employeeData,
}) => {
  const {
    data: swrLeaveLedger,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(`leave/ledger/${employeeData.userId}/${employeeData.companyId}`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const { getLeaveLedgerFail, getLeaveLedgerSuccess, leaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  // if a result is returned
  useEffect(() => {
    // success
    if (!isEmpty(swrLeaveLedger)) {
      // check if leave ledger is empty
      if (!isEmpty(swrLeaveLedger.data)) {
        // mutate leave dates from string to array of string
        const tempLeaveLedger = swrLeaveLedger.data.map((leaveLedger: LeaveLedgerEntry) => {
          const newLeaveDates = !isEmpty(leaveLedger.leaveDates) ? leaveLedger.leaveDates.toString().split(', ') : null;
          leaveLedger.leaveDates = newLeaveDates;
          return leaveLedger;
        });

        getLeaveLedgerSuccess(tempLeaveLedger);
      }
    }

    // error
    if (!isEmpty(swrError)) getLeaveLedgerFail(swrError.message);
  }, [swrLeaveLedger, swrError]);

  return (
    <>
      <Modal open={printModalIsOpen} setOpen={toggle} size={'full'} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">Leave Ledger Printable Document</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggle}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <LeaveLedgerPdf employeeData={employeeData} leaveLedger={leaveLedger} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveLedgerPdfModal;
