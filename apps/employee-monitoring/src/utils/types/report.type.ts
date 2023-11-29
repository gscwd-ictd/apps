/* eslint-disable @nx/enforce-module-boundaries */
export type Report = {
  reportName: string;
  dateFrom: string;
  dateTo: string;
};

export type EmployeeSignatory = {
  id: string;
  name: string;
  positionTitle: string;
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
export type SignatoryRoa = {
  preparedBy: EmployeeSignatory;
  reviewedBy: EmployeeSignatory;
  approvedBy: EmployeeSignatory;
};
export type ReportOnAttendance = {
  report: Array<EmployeeAttendanceRoa>;
  signatory: SignatoryRoa;
};
