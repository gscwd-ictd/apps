/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const CancelOvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen,

    setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen,
    setOvertimeDetails,
  } = useOvertimeStore((state) => ({
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen: state.completedOvertimeModalIsOpen,
    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen: state.setCompletedOvertimeModalIsOpen,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [remarks, setRemarks] = useState<string>('');

  const handleCancel = async () => {
    setPendingOvertimeModalIsOpen(false); //then close LEAVE modal
    setCompletedOvertimeModalIsOpen(false); //then close LEAVE modal

    // const data = {
    //   id: leaveIndividualDetail.leaveApplicationBasicInfo.id,
    //   cancelReason: remarks,
    // };
    // patchLeave();
    // const { error, result } = await patchPortal('/v1/leave/employee', data);
    // if (error) {
    //   patchLeaveFail(result);
    // } else {
    //   patchLeaveSuccess(result);
    //   closeModalAction();
    //   setTimeout(() => {
    //     setPendingLeaveModalIsOpen(false); //then close LEAVE modal
    //     setCompletedLeaveModalIsOpen(false); //then close LEAVE modal
    //   }, 200);
    //   setTimeout(() => {
    //     emptyResponseAndError();
    //   }, 3000);
    // }
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Cancel Overtime Application</span>
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
          <div className="flex flex-col w-full h-full px-2 gap-2 text-md ">
            {'Please indicate reason for cancelling application:'}
            <textarea
              required
              placeholder="Reason for decline"
              className={`w-full h-32 p-2 border resize-none`}
              onChange={(e) => setRemarks(e.target.value as unknown as string)}
              value={remarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <div className="max-w-auto flex">
              <Button variant={'primary'} disabled={!isEmpty(remarks) ? false : true} onClick={(e) => handleCancel()}>
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelOvertimeModal;
