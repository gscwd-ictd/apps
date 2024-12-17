/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import JustificationLetterPdf from './JustificationLetterPdf';
import { EmployeeLeaveDetails } from 'libs/utils/src/lib/types/leave-application.type';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  leaveDetails: EmployeeLeaveDetails;
};

export const JustificationLetterPdfModal = ({
  modalState,
  setModalState,
  closeModalAction,
  leaveDetails,
}: ConfirmationModalProps) => {
  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Justification Letter</span>
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
          <div className="text-center">
            {/* <PDFDownloadLink
                document={<JustificationLetterPdf leaveDetails={leaveIndividualDetail} />}
                fileName={`${employeeDetails.employmentDetails.employeeFullName} Justification Letter.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink> */}

            <PDFViewer width={'100%'} height={2800} showToolbar className="hidden md:block ">
              <JustificationLetterPdf leaveDetails={leaveDetails} />
            </PDFViewer>
          </div>
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
