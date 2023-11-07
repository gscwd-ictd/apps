import { ActionType } from '../enums/leave-ledger.type';
import { LeaveAdjustmentType } from 'apps/employee-monitoring/src/utils/enum/leave-adjustment-types.enum';

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

export type LeaveAdjustmentForm = {
  category: LeaveAdjustmentType | '';
  leaveBenefitsId: string;
  value: number;
  employeeId: string;
  remarks: string | null;
};

export type LeaveAdjustmentResponse = {
  leaveCreditEarningId: {
    creditDate: string;
    creditValue: number;
    leaveBenefitsId: string;
    employeeId: string;
    remarks: string;
    id: string;
  };
  id: string;
};
