import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import LeaveLedgerPdf from './LeaveLedgerPdf';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

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
          {!isEmpty(employeeData) && !isEmpty(leaveLedger) ? (
            <div className="text-center">
              {/* <PDFDownloadLink
                document={<LeaveLedgerPdf employeeData={employeeData} leaveLedger={leaveLedger} />}
                fileName={`${employeeData.employmentDetails.employeeFullName} Leave Ledger.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink> */}

              <PDFViewer width={'100%'} height={1400} showToolbar className="hidden md:block ">
                <LeaveLedgerPdf employeeData={employeeData} leaveLedger={leaveLedger} />
              </PDFViewer>
            </div>
          ) : (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
            </div>
          )}
          <div></div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveLedgerPdfModal;
