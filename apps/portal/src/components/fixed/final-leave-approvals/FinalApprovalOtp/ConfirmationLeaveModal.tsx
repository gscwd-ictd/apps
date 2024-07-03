/* eslint-disable @nx/enforce-module-boundaries */
import { leaveAction, passSlipAction } from '../../../../types/approvals.type';
import { patchPortal, patchPortalUrl } from '../../../../utils/helpers/portal-axios-helper';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: LeaveStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
  remarks: string; //reason for disapproval, cancellation
};

export const ConfirmationLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  remarks,
}: ConfirmationModalProps) => {
  const {
    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    loadingLeaveResponse,
  } = useFinalLeaveApprovalStore((state) => ({
    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen, // for disapproving leave
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen, // for cancelling approved leave
    loadingLeaveResponse: state.loading.loadingLeaveResponse,
  }));

  const handleSubmit = () => {
    let finalRemarks;
    if (action == LeaveStatus.APPROVED) {
      finalRemarks = null;
    } else {
      finalRemarks = remarks;
    }

    if (tokenId) {
      const data = {
        id: tokenId,
        status: action,
        hrdmDisapprovalRemarks: finalRemarks,
      };
      patchLeave();
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  };

  const handlePatchResult = async (data: leaveAction) => {
    const { error, result } = await patchPortalUrl('/leave-application', data);
    if (error) {
      patchLeaveFail(result);
    } else {
      patchLeaveSuccess(result);
      closeModalAction(); // close confirmation of decline modal
      setTimeout(() => {
        setPendingLeaveModalIsOpen(false); // close leave pending modal
        setApprovedLeaveModalIsOpen(false);
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>{'Leave Application'}</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loadingLeaveResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage={'Processing'}
              dismissible={false}
            />
          ) : null}
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left px-4">
            <label>
              Are you sure you want to{' '}
              {action === LeaveStatus.APPROVED ? (
                'approve'
              ) : action === LeaveStatus.DISAPPROVED_BY_HRDM ? (
                <label className="text-red-600">disapprove</label>
              ) : action === LeaveStatus.CANCELLED ? (
                <label className="text-red-600">cancel</label>
              ) : (
                'N/A'
              )}{' '}
              this Leave Application?
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
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
