import { Modal } from '@gscwd-apps/oneui';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import LeaveLedgerPdf from './LeaveLedgerPdf';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';

type LeaveLedgerPdfModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  employeeData: EmployeeDetails;
};

const LeaveLedgerPdfModal: FunctionComponent<LeaveLedgerPdfModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  employeeData,
}) => {
  const { leaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
  }));

  //VALUES OF leaveLedger is taken from the swr fetch found in table/LeaveLedgerTable.tsx
  //No need to fetch again since it was initially fetched by LeaveLedgerTable.tsx

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size={'full'}>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">Leave Ledger Printable Document</span>
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
