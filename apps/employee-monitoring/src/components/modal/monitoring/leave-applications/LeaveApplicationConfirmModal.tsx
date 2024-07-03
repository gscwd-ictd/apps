/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import {
  LeaveConfirmAction,
  useLeaveApplicationStore,
} from 'apps/employee-monitoring/src/store/leave-application.store';
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';

type LeaveApplicationConfirmModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: 'approve' | 'disapprove';
};

const LeaveApplicationConfirmModal: FunctionComponent<LeaveApplicationConfirmModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  action,
}) => {
  const { setLeaveConfirmAction } = useLeaveApplicationStore((state) => ({
    setLeaveConfirmAction: state.setLeaveConfirmAction,
  }));

  // submit
  const onSubmit = (confirmAction: LeaveConfirmAction) => {
    setLeaveConfirmAction(confirmAction);
    closeModalAction();
  };

  useEffect(() => {
    if (modalState) {
      setLeaveConfirmAction(null);
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="xs" steady>
        <Modal.Header>
          <div className="px-5 text-2xl font-medium text-gray-700">Confirmation</div>
        </Modal.Header>
        <Modal.Body>
          <div className="px-5 text-gray-800">Do you want to {action} this leave application?</div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-sm w-[6rem] text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => onSubmit(LeaveConfirmAction.NO)}
            >
              No
            </button>

            <button
              className="text-sm bg-blue-500 w-[6rem] text-gray-100 rounded hover:bg-blue-400 disabled:cursor-not-allowed"
              type="button"
              onClick={() => onSubmit(LeaveConfirmAction.YES)}
            >
              Yes
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveApplicationConfirmModal;
