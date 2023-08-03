/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

type LeaveApplicationConfirmModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const LeaveApplicationConfirmModal: FunctionComponent<
  LeaveApplicationConfirmModalProps
> = ({ modalState, closeModalAction, setModalState }) => {
  const {
    leave,
    patchLeaveApplication,
    patchLeaveApplicationFail,
    patchLeaveApplicationSuccess,
  } = useLeaveApplicationStore((state) => ({
    leave: state.leaveDataForSubmission,
    patchLeaveApplication: state.patchLeaveApplication,
    patchLeaveApplicationSuccess: state.patchLeaveApplicationSuccess,
    patchLeaveApplicationFail: state.patchLeaveApplicationFail,
  }));

  // on submit
  const onSubmit = async () => {
    const { action, ...rest } = leave;

    // call the function to start loading
    patchLeaveApplication();

    // call the patch function
    await handlePatchLeaveApplication(rest);
  };

  // function for patching the leave application
  const handlePatchLeaveApplication = async (
    leaveData: Partial<typeof leave>
  ) => {
    const { error, result } = await patchEmpMonitoring('leave/hrmo', {
      ...leaveData,
      status:
        leave.action === 'approve'
          ? LeaveStatus.FOR_SUPERVISOR_APPROVAL
          : LeaveStatus.DISAPPROVED_BY_HRMO,
    });

    if (!error) {
      // patch leave application success
      patchLeaveApplicationSuccess(result);
    } else if (error) {
      // patch leave application fail
      patchLeaveApplicationFail(result);
    }
    closeModalAction();
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="xs" steady>
        <Modal.Header>
          <div className="px-5 text-2xl font-medium text-gray-700">
            Confirmation
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="px-5 text-gray-800">
            Do you want to {leave.action} this leave application?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-sm w-[6rem] text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={closeModalAction}
            >
              Cancel
            </button>

            <button
              className="text-sm bg-blue-500 w-[6rem] text-gray-100 rounded hover:bg-blue-400 disabled:cursor-not-allowed"
              type="button"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveApplicationConfirmModal;
