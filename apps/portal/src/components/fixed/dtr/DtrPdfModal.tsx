/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/portal/src/store/dtr.store';
import DtrPdf from './DtrPdf';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { HiX } from 'react-icons/hi';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  title: string;
};

export const DtrPdfModal = ({ modalState, setModalState, closeModalAction, title }: ModalProps) => {
  const { employeeDtr, dtrIsLoading, dtrModalIsOpen, dtrPdfModalIsOpen, setDtrPdfModalIsOpen, setDtrModalIsOpen } =
    useDtrStore((state) => ({
      employeeDtr: state.employeeDtr,
      dtrIsLoading: state.loading.loadingDtr,
      dtrModalIsOpen: state.dtrModalIsOpen,
      dtrPdfModalIsOpen: state.dtrModalIsOpen,
      setDtrPdfModalIsOpen: state.setDtrPdfModalIsOpen,
      setDtrModalIsOpen: state.setDtrModalIsOpen,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header withCloseBtn>
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
          <>
            <DtrPdf employeeDtr={employeeDtr} employeeData={employeeDetails} />
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <Button variant={'default'} size={'md'} loading={false} onClick={(e) => setDtrPdfModalIsOpen(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
