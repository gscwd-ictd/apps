/* eslint-disable @nx/enforce-module-boundaries */
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

export type passSlipAction = {
  passSlipId: string;
  status: PassSlipStatus;
};

export type leaveAction = {
  id: string;
  status: LeaveStatus;
  supervisorDisapprovalRemarks?: string; //for supervisor disapproval
  hrdmDisapprovalRemarks?: string; //for hrdm disapproval
};

export type overtimeAction = {
  id: string;
  status: OvertimeStatus;
  remarks?: string;
};

export type PendingApprovalsCount = {
  pendingPassSlipsCount: number | null;
  pendingLeavesCount: number | null;
  pendingOvertimesCount: number | null;
  pendingTrainingNominationCount: number | null;
  pendingDtrCorrectionsApprovals: number | null;
  forHrdmApprovalLeaves: number | null;
  pendingOvertimeApprovals: number | null;
  pendingPdcSecretariatApprovalCount: number | null;
  pendingPdcChairmanApprovalCount: number | null;
  pendingGmApprovalCount: number | null;
  prfsForApprovalCount: number | null;
  pendingApplicantEndorsementsCount: number | null;
  pendingAppointingAuthoritySelection: number | null;
};
