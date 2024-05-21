/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiPrinter, HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveLedgerTable } from '../table/LeaveLedgerTable';
import LeaveLedgerPdfModal from './LeaveLedgerPdfModal';
import { useLeaveLedgerPageStore } from 'apps/portal/src/store/leave-ledger-page.store';

type LeaveLedgerModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeaveLedgerModal = ({ modalState, setModalState, closeModalAction }: LeaveLedgerModalProps) => {
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { leaveLedgerPdfModalIsOpen, setLeaveLedgerPdfModalIsOpen } = useLeaveLedgerPageStore((state) => ({
    leaveLedgerPdfModalIsOpen: state.leaveLedgerPdfModalIsOpen,
    setLeaveLedgerPdfModalIsOpen: state.setLeaveLedgerPdfModalIsOpen,
  }));

  // cancel action for Leave Application Modal
  const closeLeaveLedgerPdfModal = async () => {
    setLeaveLedgerPdfModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <LeaveLedgerPdfModal
        modalState={leaveLedgerPdfModalIsOpen}
        setModalState={setLeaveLedgerPdfModalIsOpen}
        employeeData={employeeDetails}
        closeModalAction={closeLeaveLedgerPdfModal}
      />

      <Modal size={`${windowWidth > 1024 ? 'xl' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Leave Ledger</span>
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
          <div className="flex flex-col px-4">
            <div className="flex items-end justify-end pb-2">
              <Button onClick={(e) => setLeaveLedgerPdfModalIsOpen(true)} className="hidden lg:block" size={`md`}>
                <div className="flex items-center w-full gap-2">
                  <HiPrinter /> Print Ledger
                </div>
              </Button>
            </div>
            <LeaveLedgerTable employeeData={employeeDetails} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveLedgerModal;
