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
  specialLeaveBenefit: number;
  specialLeaveBenefitBalance: number;
  actionType: ActionType;
  leaveDates: string;
};
