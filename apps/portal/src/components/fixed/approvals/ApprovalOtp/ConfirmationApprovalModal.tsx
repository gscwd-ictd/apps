/* eslint-disable @nx/enforce-module-boundaries */
import { leaveAction, passSlipAction } from '../../../../types/approvals.type';
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  tokenId: string; //like pass Slip Id, leave Id etc.
  remarks?: string; //reason for disapproval, cancellation
  actionOvertime?: OvertimeStatus; // approve or disapprove for overtime
  actionLeave?: LeaveStatus; // approve or disapprove for leave
  actionPassSlip?: PassSlipStatus; // approve or disapprove pass slip
  otpName: ManagerOtpApproval;
  employeeId?: string;
};

export const ConfirmationApprovalModal = ({
  modalState,
  setModalState,
  closeModalAction,
  actionOvertime,
  actionLeave,
  actionPassSlip,
  tokenId,
  remarks,
  otpName,
  employeeId,
}: ConfirmationModalProps) => {
  const {
    patchOvertime,
    patchOvertimeSuccess,
    patchOvertimeFail,
    setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen,
    loadingOvertimeResponse,

    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    loadingLeaveResponse,

    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
    setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen,
    loadingPassSlipResponse,
  } = useApprovalStore((state) => ({
    patchOvertime: state.patchOvertime,
    patchOvertimeSuccess: state.patchOvertimeSuccess,
    patchOvertimeFail: state.patchOvertimeFail,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen: state.setApprovedOvertimeModalIsOpen,
    loadingOvertimeResponse: state.loading.loadingOvertimeResponse,

    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    loadingLeaveResponse: state.loading.loadingLeaveResponse,

    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen: state.setApprovedPassSlipModalIsOpen,
    loadingPassSlipResponse: state.loading.loadingPassSlipResponse,
  }));

  const handleSubmit = () => {
    let data;
    if (otpName === ManagerOtpApproval.LEAVE) {
      data = {
        id: tokenId,
        status: actionLeave,
        supervisorDisapprovalRemarks: remarks,
      };
      patchLeave();
    } else if (otpName === ManagerOtpApproval.PASSSLIP) {
      data = {
        passSlipId: tokenId,
        status: actionPassSlip,
      };
      patchPassSlip();
    } else if (otpName === ManagerOtpApproval.OVERTIME) {
      data = {
        managerId: employeeId,
        remarks: remarks,
        status: actionOvertime,
        overtimeApplicationId: tokenId,
      };
      patchOvertime();
    }
    handlePatchResult(data);
  };

  const handlePatchResult = async (data: leaveAction) => {
    let otpPatchUrl;

    if (otpName === ManagerOtpApproval.LEAVE) {
      otpPatchUrl = '/v1/leave/supervisor';
    } else if (otpName === ManagerOtpApproval.PASSSLIP) {
      otpPatchUrl = '/v1/pass-slip';
    } else if (otpName === ManagerOtpApproval.OVERTIME) {
      otpPatchUrl = '/v1/overtime/approval';
    }

    const { error, result } = await patchPortal(otpPatchUrl, data);
    if (error) {
      if (otpName === ManagerOtpApproval.LEAVE) {
        patchLeaveFail(result);
      } else if (otpName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipFail(result);
      } else if (otpName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeFail(result);
      }
    } else {
      if (otpName === ManagerOtpApproval.LEAVE) {
        patchLeaveSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingLeaveModalIsOpen(false); // close leave pending modal
          setApprovedLeaveModalIsOpen(false);
        }, 200);
      } else if (otpName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingPassSlipModalIsOpen(false); // close leave pending modal
          setApprovedPassSlipModalIsOpen(false);
        }, 200);
      } else if (otpName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingOvertimeModalIsOpen(false); // close leave pending modal
          setApprovedOvertimeModalIsOpen(false);
        }, 200);
      }
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>
                {otpName === ManagerOtpApproval.LEAVE
                  ? 'Leave Application'
                  : otpName === ManagerOtpApproval.OVERTIME
                  ? 'Overtime Application'
                  : otpName === ManagerOtpApproval.PASSSLIP
                  ? 'Pass Slip Application'
                  : 'Application'}
              </span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loadingLeaveResponse || loadingPassSlipResponse || loadingOvertimeResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage={'Processing'}
              dismissible={false}
            />
          ) : null}
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left pl-5">
            {`Are you sure you want to 
          
          ${
            otpName === ManagerOtpApproval.PASSSLIP && actionPassSlip === PassSlipStatus.CANCELLED
              ? 'cancel'
              : otpName === ManagerOtpApproval.PASSSLIP && actionPassSlip === PassSlipStatus.DISAPPROVED
              ? 'disapprove'
              : 'disapprove'
          }
          this application?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
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
