/* eslint-disable @nx/enforce-module-boundaries */
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
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
