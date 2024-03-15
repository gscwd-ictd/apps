/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useLeaveStore } from 'apps/portal/src/store/leave.store';
import { LeaveCancellationSubmission } from 'libs/utils/src/lib/types/leave-application.type';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  url: string; // for cancellation route
  data: LeaveCancellationSubmission; //for leave cancellation data
  title: string;
};

export const ConfirmationLeaveCancellationModal = ({
  modalState,
  setModalState,
  closeModalAction,
  url,
  data,
  title,
}: ConfirmationModalProps) => {
  const {
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,
    setCancelLeaveModalIsOpen,
    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    emptyResponseAndError,
  } = useLeaveStore((state) => ({
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,
    setCancelLeaveModalIsOpen: state.setCancelLeaveModalIsOpen,
    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const handleSubmit = async () => {
    patchLeave();
    const { error, result } = await patchPortal(url, data);
    if (error) {
      patchLeaveFail(result);
    } else {
      patchLeaveSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setCancelLeaveModalIsOpen(false);
      }, 200);
      setTimeout(() => {
        setPendingLeaveModalIsOpen(false); //then close LEAVE modal
        setCompletedLeaveModalIsOpen(false); //then close LEAVE modal
      }, 300);
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>{title}</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
            {`Are you sure you want to cancel these leave dates? Cancellation of leave dates can only be done once.`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleSubmit()}>
                Yes
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
