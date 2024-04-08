/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useLeaveStore } from 'apps/portal/src/store/leave.store';
import { LeaveCancellationSubmission } from 'libs/utils/src/lib/types/leave-application.type';
import LeavePdf from './LeavePdf';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { HiX } from 'react-icons/hi';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  title: string;
};

export const LeavePdfModal = ({ modalState, setModalState, closeModalAction, title }: ConfirmationModalProps) => {
  const { leaveIndividualDetail } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
  }));

  const { leaveLedger, selectedLeaveLedger, setSelectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

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
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
            <LeavePdf
              employeeDetails={employeeDetails}
              leaveDetails={leaveIndividualDetail}
              selectedLeaveLedger={selectedLeaveLedger}
            />
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
