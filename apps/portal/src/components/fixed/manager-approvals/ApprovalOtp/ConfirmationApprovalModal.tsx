/* eslint-disable @nx/enforce-module-boundaries */
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  tokenId: string; //like pass Slip Id, leave Id etc.
  remarks?: string; //reason for disapproval, cancellation
  actionOvertime?: OvertimeStatus; // approve or disapprove for overtime
  actionLeave?: LeaveStatus; // approve or disapprove for leave
  actionPassSlip?: PassSlipStatus; // approve or disapprove pass slip
  actionDtrCorrection?: DtrCorrectionStatus; // approve or disapprove time log correction
  confirmName: ManagerOtpApproval;
  employeeId?: string;
};

export const ConfirmationApprovalModal = ({
  modalState,
  setModalState,
  closeModalAction,
  actionOvertime,
  actionLeave,
  actionPassSlip,
  actionDtrCorrection,
  tokenId,
  remarks,
  confirmName,
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

    setOvertimeDetails,

    patchDtrCorrection,
    patchDtrCorrectionSuccess,
    patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen,
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

    setOvertimeDetails: state.setOvertimeDetails,

    patchDtrCorrection: state.patchDtrCorrection,
    patchDtrCorrectionSuccess: state.patchDtrCorrectionSuccess,
    patchDtrCorrectionFail: state.patchDtrCorrectionFail,
    setDtrCorrectionModalIsOpen: state.setDtrCorrectionModalIsOpen,
  }));

  const handleSubmit = () => {
    let data;
    if (confirmName === ManagerOtpApproval.LEAVE) {
      data = {
        id: tokenId,
        status: actionLeave,
        supervisorDisapprovalRemarks: remarks,
      };
      patchLeave();
    } else if (confirmName === ManagerOtpApproval.PASSSLIP) {
      data = {
        passSlipId: tokenId,
        status: actionPassSlip,
      };
      patchPassSlip();
    } else if (confirmName === ManagerOtpApproval.OVERTIME) {
      data = {
        managerId: employeeId,
        approvedBy: employeeId,
        remarks: remarks,
        status: actionOvertime,
        overtimeApplicationId: tokenId,
      };
      patchOvertime();
    } else if (confirmName === ManagerOtpApproval.DTRCORRECTION) {
      data = {
        id: tokenId,
        status: actionDtrCorrection,
      };
      patchDtrCorrection();
    }
    handlePatchResult(data);
  };

  const handlePatchResult = async (data) => {
    let patchUrl;
    if (confirmName === ManagerOtpApproval.LEAVE) {
      patchUrl = '/v1/leave/supervisor';
    } else if (confirmName === ManagerOtpApproval.PASSSLIP) {
      patchUrl = '/v1/pass-slip';
    } else if (confirmName === ManagerOtpApproval.OVERTIME) {
      patchUrl = '/v1/overtime/approval';
    } else if (confirmName === ManagerOtpApproval.DTRCORRECTION) {
      patchUrl = '/v1/dtr-correction';
    }

    const { error, result } = await patchPortal(patchUrl, data);
    if (error) {
      if (confirmName === ManagerOtpApproval.LEAVE) {
        patchLeaveFail(result);
      } else if (confirmName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipFail(result);
      } else if (confirmName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeFail(result);
      } else if (confirmName === ManagerOtpApproval.DTRCORRECTION) {
        patchDtrCorrectionFail(result);
      }
    } else {
      if (confirmName === ManagerOtpApproval.LEAVE) {
        patchLeaveSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingLeaveModalIsOpen(false); // close leave pending modal
          setApprovedLeaveModalIsOpen(false);
        }, 200);
      } else if (confirmName === ManagerOtpApproval.PASSSLIP) {
        patchPassSlipSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingPassSlipModalIsOpen(false); // close pass slip pending modal
          setApprovedPassSlipModalIsOpen(false);
        }, 200);
      } else if (confirmName === ManagerOtpApproval.OVERTIME) {
        patchOvertimeSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setPendingOvertimeModalIsOpen(false); // close ot pending modal
          setApprovedOvertimeModalIsOpen(false);
          setOvertimeDetails({} as OvertimeDetails);
        }, 200);
      } else if (confirmName === ManagerOtpApproval.DTRCORRECTION) {
        patchDtrCorrectionSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setDtrCorrectionModalIsOpen(false); // close ot pending modal
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
                {confirmName === ManagerOtpApproval.LEAVE
                  ? 'Leave Application'
                  : confirmName === ManagerOtpApproval.OVERTIME
                  ? 'Overtime Application'
                  : confirmName === ManagerOtpApproval.PASSSLIP
                  ? 'Pass Slip Application'
                  : confirmName === ManagerOtpApproval.DTRCORRECTION
                  ? 'Time Log Correction'
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
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left px-4">
            {`Are you sure you want to 
          
          ${
            confirmName === ManagerOtpApproval.PASSSLIP && actionPassSlip === PassSlipStatus.CANCELLED
              ? 'cancel'
              : confirmName === ManagerOtpApproval.PASSSLIP && actionPassSlip === PassSlipStatus.DISAPPROVED
              ? 'disapprove'
              : 'disapprove'
          }
          this application?`}
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
