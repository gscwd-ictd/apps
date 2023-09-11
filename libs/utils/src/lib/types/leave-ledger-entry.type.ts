import { ActionType } from '../enums/leave-ledger.type';

export type LeaveLedgerEntry = {
  employeeId: string;
  period: string;
  particulars: string;
  forcedLeave: number;
  forcedLeaveBalance: number;
  vacationLeave: number;
  vacationLeaveBalance: number;
  sickLeave: number;
  sickLeaveBalance: number;
  specialPrivilegeLeave: number;
  specialPrivilegeLeaveBalance: number;
  specialLeaveBenefit: number;
  specialLeaveBenefitBalance: number;
  actionType: ActionType;
  leaveDates: Array<string>;
  remarks: string;
  leaveApplicationId?: string;
};
