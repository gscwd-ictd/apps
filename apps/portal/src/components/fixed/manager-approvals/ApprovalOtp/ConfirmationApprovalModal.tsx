/* eslint-disable @nx/enforce-module-boundaries */
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { ManagerConfirmationApproval } from 'libs/utils/src/lib/enums/approval.enum';
import {
  EmployeeOvertimeDetail,
  OvertimeAccomplishmentApprovalPatch,
  OvertimeDetails,
} from 'libs/utils/src/lib/types/overtime.type';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { useEffect, useState } from 'react';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  tokenId: string; //like pass Slip Id, leave Id etc.
  remarks?: string; //reason for disapproval, cancellation

  dataToSubmitOvertimeAccomplishment?: OvertimeAccomplishmentApprovalPatch;
  dataToSubmitPassSlipDispute?: passSlipAction;
  dataToSubmitApproveAllAccomplishment?: OvertimeAccomplishmentApprovalPatch;
  employeeListForApproveAllAccomplishment?: Array<EmployeeOvertimeDetail>;

  actionOvertime?: OvertimeStatus; // approve or disapprove for overtime
  actionLeave?: LeaveStatus; // approve or disapprove for leave
  actionPassSlip?: PassSlipStatus; // approve or disapprove pass slip
  actionDtrCorrection?: DtrCorrectionStatus; // approve or disapprove time log correction
  confirmName: ManagerConfirmationApproval;
  employeeId?: string;
};

export const ConfirmationApprovalModal = ({
  modalState,
  setModalState,
  closeModalAction,
  dataToSubmitOvertimeAccomplishment,
  dataToSubmitPassSlipDispute,
  dataToSubmitApproveAllAccomplishment,
  employeeListForApproveAllAccomplishment,

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

    patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess,

    setDisputedPassSlipModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen,
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

    patchOvertimeAccomplishment: state.patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentFail: state.patchOvertimeAccomplishmentFail,
    patchOvertimeAccomplishmentSuccess: state.patchOvertimeAccomplishmentSuccess,

    setDisputedPassSlipModalIsOpen: state.setDisputedPassSlipModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen: state.setOvertimeAccomplishmentModalIsOpen,
  }));

  const handleSubmit = () => {
    let data;
    if (confirmName === ManagerConfirmationApproval.LEAVE) {
      data = {
        id: tokenId,
        status: actionLeave,
        supervisorDisapprovalRemarks: remarks,
      };
      patchLeave();
    } else if (confirmName === ManagerConfirmationApproval.PASSSLIP) {
      data = {
        passSlipId: tokenId,
        status: actionPassSlip,
      };
      patchPassSlip();
    } else if (confirmName === ManagerConfirmationApproval.OVERTIME) {
      data = {
        managerId: employeeId,
        approvedBy: employeeId,
        remarks: remarks,
        status: actionOvertime,
        overtimeApplicationId: tokenId,
      };
      patchOvertime();
    } else if (confirmName === ManagerConfirmationApproval.DTRCORRECTION) {
      data = {
        id: tokenId,
        status: actionDtrCorrection,
      };
      patchDtrCorrection();
    } else if (confirmName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
      data = dataToSubmitOvertimeAccomplishment;
      patchOvertimeAccomplishment();
    } else if (confirmName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
      data = dataToSubmitApproveAllAccomplishment;
      patchOvertimeAccomplishment();
    } else if (confirmName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
      if (dataToSubmitPassSlipDispute?.status === PassSlipStatus.APPROVED) {
        //mutate payload for dispute purposes
        data = {
          passSlipId: dataToSubmitPassSlipDispute?.passSlipId,
          isDisputeApproved: true,
        };
      } else {
        data = {
          passSlipId: dataToSubmitPassSlipDispute?.passSlipId,
          isDisputeApproved: false,
        };
      }
      patchPassSlip();
    }

    handlePatchResult(data);
  };

  const handlePatchResult = async (data) => {
    let patchUrl;
    if (confirmName === ManagerConfirmationApproval.LEAVE) {
      patchUrl = '/v1/leave/supervisor';
    } else if (confirmName === ManagerConfirmationApproval.PASSSLIP) {
      patchUrl = '/v1/pass-slip';
    } else if (confirmName === ManagerConfirmationApproval.OVERTIME) {
      patchUrl = '/v1/overtime/approval';
    } else if (confirmName === ManagerConfirmationApproval.DTRCORRECTION) {
      patchUrl = '/v1/dtr-correction';
    } else if (confirmName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
      patchUrl = '/v1/overtime/accomplishments/approval';
    } else if (confirmName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
      patchUrl = '/v1/overtime/accomplishments/approval/all';
    } else if (confirmName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
      patchUrl = '/v1/pass-slip';
    }

    const { error, result } = await patchPortal(patchUrl, data);
    if (error) {
      if (confirmName === ManagerConfirmationApproval.LEAVE) {
        patchLeaveFail(result);
      } else if (confirmName === ManagerConfirmationApproval.PASSSLIP) {
        patchPassSlipFail(result);
      } else if (confirmName === ManagerConfirmationApproval.OVERTIME) {
        patchOvertimeFail(result);
      } else if (confirmName === ManagerConfirmationApproval.DTRCORRECTION) {
        patchDtrCorrectionFail(result);
      } else if (confirmName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
        patchOvertimeAccomplishmentFail(result);
      } else if (confirmName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
        patchOvertimeAccomplishmentFail(result);
      } else if (confirmName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
        patchPassSlipFail(result);
      }
    } else {
      if (confirmName === ManagerConfirmationApproval.LEAVE) {
        patchLeaveSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingLeaveModalIsOpen(false); // close leave pending modal
          setApprovedLeaveModalIsOpen(false);
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.PASSSLIP) {
        patchPassSlipSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingPassSlipModalIsOpen(false); // close pass slip pending modal
          setApprovedPassSlipModalIsOpen(false);
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.OVERTIME) {
        patchOvertimeSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingOvertimeModalIsOpen(false); // close ot pending modal
          setApprovedOvertimeModalIsOpen(false);
          setOvertimeDetails({} as OvertimeDetails);
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.DTRCORRECTION) {
        patchDtrCorrectionSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setDtrCorrectionModalIsOpen(false); // close ot pending modal
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT) {
        patchOvertimeAccomplishmentSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingOvertimeModalIsOpen(false); // close ot pending modal
          setApprovedOvertimeModalIsOpen(false);
          setOvertimeAccomplishmentModalIsOpen(false); //then close Accomplishment modal
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT) {
        patchOvertimeAccomplishmentSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingOvertimeModalIsOpen(false); // close ot pending modal
          setApprovedOvertimeModalIsOpen(false);
          setOvertimeAccomplishmentModalIsOpen(false); //then close Accomplishment modal
        }, 200);
      } else if (confirmName === ManagerConfirmationApproval.PASSSLIP_DISPUTE) {
        patchPassSlipSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setDisputedPassSlipModalIsOpen(false);
          setPendingPassSlipModalIsOpen(false);
          setApprovedPassSlipModalIsOpen(false);
        }, 200);
      }
    }
  };
  const [isBeyondActualHours, setIsBeyondActualHours] = useState<boolean>(false);
  const [finalPendingEmployees, setFinalPendingEmployees] = useState<Array<EmployeeOvertimeDetail>>();

  useEffect(() => {
    const tempFinalPendingEmployees = employeeListForApproveAllAccomplishment?.filter(
      (employee) =>
        employee.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING &&
        employee.isAccomplishmentSubmitted == true
    );

    const tempEmployees = employeeListForApproveAllAccomplishment?.filter(
      (employee) =>
        employee.encodedHours < dataToSubmitApproveAllAccomplishment?.actualHrs &&
        employee.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING &&
        employee.isAccomplishmentSubmitted == true
    );
    if (tempEmployees?.length >= 1 && dataToSubmitApproveAllAccomplishment) {
      setIsBeyondActualHours(true);
    } else {
      setIsBeyondActualHours(false);
    }
    setFinalPendingEmployees(tempFinalPendingEmployees);
  }, [modalState]);
  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>
                {confirmName === ManagerConfirmationApproval.LEAVE
                  ? 'Leave Application'
                  : confirmName === ManagerConfirmationApproval.OVERTIME
                  ? 'Overtime Application'
                  : confirmName === ManagerConfirmationApproval.PASSSLIP
                  ? 'Pass Slip Application'
                  : confirmName === ManagerConfirmationApproval.DTRCORRECTION
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
            {/* PASS SLIP APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.PASSSLIP ? (
              <label>
                Are you sure you want to{' '}
                {actionPassSlip === PassSlipStatus.APPROVED ? (
                  'approve'
                ) : actionPassSlip === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ? (
                  'approve (with Awaiting Medical Certificate Status)'
                ) : actionPassSlip === PassSlipStatus.DISAPPROVED ? (
                  <label className="text-red-600">disapprove</label>
                ) : actionPassSlip === PassSlipStatus.CANCELLED ? (
                  <label className="text-red-600">cancel</label>
                ) : (
                  'N/A'
                )}{' '}
                this Pass Slip Application?
              </label>
            ) : null}

            {/* OVERTIME APPLICATION APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.OVERTIME ? (
              <label>
                Are you sure you want to{' '}
                {actionOvertime === OvertimeStatus.APPROVED ? (
                  'approve'
                ) : actionOvertime === OvertimeStatus.DISAPPROVED ? (
                  <label className="text-red-600">disapprove</label>
                ) : actionOvertime === OvertimeStatus.CANCELLED ? (
                  <label className="text-red-600">cancel</label>
                ) : (
                  'N/A'
                )}{' '}
                this Overtime Application?
              </label>
            ) : null}

            {/* LEAVE APPLICATION APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.LEAVE ? (
              <label>
                Are you sure you want to{' '}
                {actionLeave === LeaveStatus.FOR_HRDM_APPROVAL ? (
                  'approve'
                ) : actionLeave === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ? (
                  <label className="text-red-600">disapprove</label>
                ) : (
                  'N/A'
                )}{' '}
                this Leave Application?
              </label>
            ) : null}

            {/* DTR CORRECTION APPLICATION APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.DTRCORRECTION ? (
              <label>
                Are you sure you want to{' '}
                {actionDtrCorrection === DtrCorrectionStatus.APPROVED ? (
                  'approve'
                ) : (
                  <label className="text-red-600">disapprove</label>
                )}{' '}
                this DTR Correction Application?
              </label>
            ) : null}

            {/* ALL OT ACCOMPLISHMENT APPLICATION APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT &&
            dataToSubmitApproveAllAccomplishment ? (
              <>
                <div className="bg-slate-100 py-2 rounded">
                  {finalPendingEmployees?.map((employee: EmployeeOvertimeDetail, index: number) => {
                    return (
                      <div
                        key={employee.companyId}
                        className={`${index != 0 ? 'border-t border-slate-200' : ''} ${
                          employee.accomplishmentStatus === OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER
                            ? 'opacity-40'
                            : employee.encodedHours < dataToSubmitApproveAllAccomplishment.actualHrs &&
                              employee.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING &&
                              employee.isAccomplishmentSubmitted == true
                            ? 'bg-red-300'
                            : ''
                        } px-2 py-2 md:px-4 flex flex-row justify-between items-center gap-4 `}
                      >
                        <div className="w-full flex justify-between items-start  gap-2 md:gap-4 text-sm md:text-md">
                          <label className={`w-full`}>{employee.fullName}</label>

                          {employee.encodedHours ? (
                            <div className="flex flex-col">
                              <label className={`w-full`}>{employee.encodedHours} Hours</label>
                              <label className={`w-full`}>Rendered</label>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <label className={`w-full`}>0 Hours</label>
                              <label className={`w-full`}>Rendered</label>
                            </div>
                          )}

                          {employee.encodedHours < dataToSubmitApproveAllAccomplishment.actualHrs ? (
                            <label className={`w-full`}>
                              Approved {dataToSubmitApproveAllAccomplishment.actualHrs} Hour(s) is more than Rendered
                              Hours
                            </label>
                          ) : (
                            <label className={`w-full`}>
                              Approved {dataToSubmitApproveAllAccomplishment.actualHrs} Hour(s) is less than or equal
                              Rendered Hours
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isBeyondActualHours && dataToSubmitApproveAllAccomplishment ? (
                  <label className="text-sm text-red-600">
                    There are currently employees whose rendered hours are less than the approved hours that was set.
                    Please approve them individually to avoid incorrect Overtime hours.
                  </label>
                ) : (
                  <label>
                    Are you sure you want to{' '}
                    {dataToSubmitApproveAllAccomplishment.status == OvertimeAccomplishmentStatus.APPROVED ? (
                      'approve'
                    ) : (
                      <label className="text-red-600">disapprove</label>
                    )}{' '}
                    <label className="bg-yellow-300 px-1">
                      {dataToSubmitApproveAllAccomplishment.actualHrs} hours(s)
                    </label>{' '}
                    to all the pending Accomplishment Reports for this Overtime?
                  </label>
                )}
              </>
            ) : null}

            {/* OT ACCOMPLISHMENT APPLICATION APPROVAL MESSAGE */}
            {confirmName === ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT &&
            dataToSubmitOvertimeAccomplishment ? (
              <label>
                Are you sure you want to{' '}
                {dataToSubmitOvertimeAccomplishment.status == OvertimeAccomplishmentStatus.APPROVED ? (
                  <>
                    approve{' '}
                    <label className="bg-yellow-300 px-1">
                      {dataToSubmitOvertimeAccomplishment.actualHrs} hours(s)
                    </label>{' '}
                    to this Accomplishment Report?
                  </>
                ) : (
                  <>
                    <label className="text-red-600">disapprove</label> this Accomplishment Report?
                  </>
                )}
              </label>
            ) : null}

            {confirmName === ManagerConfirmationApproval.PASSSLIP_DISPUTE && dataToSubmitPassSlipDispute ? (
              <label>
                Are you sure you want to{' '}
                {dataToSubmitPassSlipDispute.status == PassSlipStatus.APPROVED ? (
                  'approve'
                ) : (
                  <label className="text-red-600">disapprove</label>
                )}{' '}
                this Pass Slip Dispute?
              </label>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto flex gap-4">
              {isBeyondActualHours && dataToSubmitApproveAllAccomplishment ? (
                <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()}>
                  Close
                </Button>
              ) : (
                <>
                  <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleSubmit()}>
                    Yes
                  </Button>
                  <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                    No
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
