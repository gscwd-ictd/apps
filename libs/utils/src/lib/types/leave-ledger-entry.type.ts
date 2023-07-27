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
  action: string;
};
