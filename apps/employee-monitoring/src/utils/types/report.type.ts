/* eslint-disable @nx/enforce-module-boundaries */
export type Report = {
  reportName: string;
  dateFrom?: string;
  dateTo?: string;
  monthYear?: string;
  employeeId?: string;
};

export type EmployeeSignatory = {
  name: string;
  positionTitle: string;
};
export type ReportSignatories = {
  preparedBy: EmployeeSignatory;
  reviewedBy: EmployeeSignatory;
  approvedBy: EmployeeSignatory;
};

// Report on Attendance = Roa
export type EmployeeAttendanceRoa = {
  companyId: string;
  name: string;
  numberOfTimesLate?: number;
  numberOfTimesUndertime?: number;
  totalMinutesLateUndertime?: string;
  conversion?: string;
  numberOfTimesHalfDay?: number;
  daysHalfDay?: string;
  datesLate?: string;
  noOfAttendance?: number;
};
export type ReportOnAttendance = {
  report: Array<EmployeeAttendanceRoa>;
  signatory: ReportSignatories;
};

// Report on Personal Business Pass Slip = RoPbPs
export type EmployeeRoPbPs = {
  employeeId: string;
  name: string;
  noOfTimes: string;
  dates: string;
  totalMinutes: string;
  conversion: string;
};
export type ReportOnPersonalBusinessPassSlip = {
  report: Array<EmployeeRoPbPs>;
  signatory: ReportSignatories;
};

// Detailed Report on Personal Business Pass Slip = DroPbPs
export type EmployeeDroPbPs = {
  employeeId: string;
  name: string;
  psDate: string;
  noOfMinConsumed: string;
  conversion: string;
  timeInTimeOut: string;
};
export type DetailedReportOnPbPassSlip = {
  report: Array<EmployeeDroPbPs>;
  signatory: ReportSignatories;
};

// Report on Official Business Pass Slip = RoObPs
export type EmployeeRoObPs = {
  employeeId: string;
  name: string;
  noOfTimes: string;
  dates: string;
  totalMinutes: string;
  conversion: string;
};
export type ReportOnOfficialBusinessPassSlip = {
  report: Array<EmployeeRoObPs>;
  signatory: ReportSignatories;
};

// Detailed Report on Official Business Pass Slip = DroObPs
export type EmployeeDroObPs = {
  employeeId: string;
  name: string;
  psDate: string;
  noOfMinConsumed: string;
  conversion: string;
  timeInTimeOut: string;
  reason: string;
};
export type DetailedReportOnObPassSlip = {
  report: Array<EmployeeDroObPs>;
  signatory: ReportSignatories;
};

// Report on Employee Forced Leave Credits = RoEFlc
export type EmployeeRoEFlc = {
  companyId: string;
  name: string;
  forcedLeaveBalance: number;
  vacationLeaveBalance: number;
};
export type ReportOnEmpForcedLeaveCredits = {
  report: Array<EmployeeRoEFlc>;
  signatory: ReportSignatories;
};

// Report on Employee Leave Credit Balance
export type EmployeeLcb = {
  companyId: string;
  name: string;
  sickLeaveBalance: number;
  vacationLeaveBalance: number;
  totalLeaveBalance: number;
};
export type ReportOnEmpLeaveCreditBalance = {
  report: Array<EmployeeLcb>;
  signatory: ReportSignatories;
};

// Report on Employee Leave Credit Balance with Money
export type EmployeeLcbWithMoney = {
  companyId: string;
  name: string;
  sickLeaveBalance: number;
  vacationLeaveBalance: number;
  totalLeaveBalance: number;
  monthlyRate: string;
  conversion: string;
};
export type ReportOnEmpLeaveCreditBalanceWMoney = {
  report: Array<EmployeeLcbWithMoney>;
  signatory: ReportSignatories;
};

// Report on Summary of Leave Without Pay
export type EmployeeLwp = {
  employeeId: string;
  employeeName: string;
  companyId: string;
  leaveDescription: string;
  noOfDays: number;
  dateFrom: string;
  dateTo: string;
};
export type ReportOnSummaryLeaveWithoutPay = {
  report: Array<EmployeeLwp>;
  signatory: ReportSignatories;
};

// Report on Summary of Sick Leave
export type EmployeeRoSl = {
  companyId: string;
  name: string;
  dates: string;
  sickLeaveBalance: number;
  reason: string;
};
export type ReportOnEmpSickLeaveCredits = {
  report: Array<EmployeeRoSl>;
  signatory: ReportSignatories;
};

// Report on Summary of Rehabilitation Leave
export type EmployeeRoRl = {
  companyId: string;
  name: string;
  leaveCount: string;
  leaveDates: string;
  dateOfFiling: string;
};
export type ReportOnEmpRehabLeaveCredits = {
  report: Array<EmployeeRoRl>;
  signatory: ReportSignatories;
};

// Report on Pass Slip Deductible to Pay
export type EmployeeReportOnPassSlipDeductibleToPay = {
  dateOfApplication: string;
  employeeId: string;
  fullName: string;
  numberOfHours: number;
  remarks: string;
  salaryDeductionComputation: string;
  timeInTimeOut: string;
}

export type ReportOnPassSlipDeductibleToPay = {
  report: {
    casual: Array<EmployeeReportOnPassSlipDeductibleToPay>;
    jo: Array<EmployeeReportOnPassSlipDeductibleToPay>;
    permanent: Array<EmployeeReportOnPassSlipDeductibleToPay>;
  }
  signatory: ReportSignatories;
};