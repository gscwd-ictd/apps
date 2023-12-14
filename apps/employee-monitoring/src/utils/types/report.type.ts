import { number, string } from 'yup';

/* eslint-disable @nx/enforce-module-boundaries */
export type Report = {
  reportName: string;
  dateFrom?: string;
  dateTo?: string;
  monthYear?: string;
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
