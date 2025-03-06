/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from 'apps/portal/src/store/leave.store';
import LeavePdf from './LeavePdf';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { HiX } from 'react-icons/hi';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { isEmpty } from 'lodash';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  title: string;
  vlEntry: LeaveLedgerEntry;
  slEntry: LeaveLedgerEntry;
};

export const LeavePdfModal = ({ modalState, setModalState, closeModalAction, title, vlEntry, slEntry }: ModalProps) => {
  const { leaveIndividualDetail } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
  }));

  const { selectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    selectedLeaveLedger: state.selectedLeaveLedger,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>{title}</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {!isEmpty(employeeDetails) && !isEmpty(leaveIndividualDetail) ? (
            <div className="text-center">
              <PDFDownloadLink
                document={
                  <LeavePdf
                    employeeDetails={employeeDetails}
                    leaveDetails={leaveIndividualDetail}
                    selectedLeaveLedger={selectedLeaveLedger}
                    vlEntry={vlEntry}
                    slEntry={slEntry}
                  />
                }
                fileName={`${employeeDetails?.employmentDetails?.employeeFullName} Leave Form.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {leaveIndividualDetail && employeeDetails && selectedLeaveLedger && vlEntry && slEntry
                  ? 'Download PDF'
                  : 'Loading...'}
                {/* {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')} */}
              </PDFDownloadLink>

              <PDFViewer width={'100%'} height={2800} showToolbar className="hidden md:block ">
                <LeavePdf
                  employeeDetails={employeeDetails}
                  leaveDetails={leaveIndividualDetail}
                  selectedLeaveLedger={selectedLeaveLedger}
                  vlEntry={vlEntry}
                  slEntry={slEntry}
                />
              </PDFViewer>
            </div>
          ) : (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button variant={'default'} size={'md'} loading={false} onClick={closeModalAction}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
