/* eslint-disable @nx/enforce-module-boundaries */
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

export type passSlipAction = {
  passSlipId: string;
  status: PassSlipStatus;
  remarks?: string;
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
