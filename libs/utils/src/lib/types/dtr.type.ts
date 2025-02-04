import { Schedule } from './schedule.type';
import { HolidayTypes } from '../../../../utils/src/lib/enums/holiday-types.enum';
import { CANCELLED } from 'dns';
import { LeaveDateStatus } from '../enums/leave.enum';
import { DtrCorrectionStatus } from '../enums/dtr.enum';

// dtr / time log
export type EmployeeTimeLog = {
  id: string;
  companyId: string;
  dtrDate: string;
  timeIn: string;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;
  remarks: string;
};
export type EmployeeRestDay = {
  restDaysNames: string;
  restDaysNumbers: string;
};

//individual dtr per day of employee
export type EmployeeDtrWithSchedule = {
  day: string;
  companyId: string;
  date?: string;
  dtr: EmployeeTimeLog; //dtr
  dtrCorrection?: DtrCorrectionForEmployee;
  schedule: Schedule & EmployeeRestDay; // schedule with rest days
  holidayType: HolidayTypes | null; // recently added
  isHoliday: boolean;
  isRestDay: boolean;
  isOt?: boolean;
  hasPendingDtrCorrection: boolean;
  leaveDateStatus?: LeaveDateStatus; //for leave cancellation checker
};

export type EmployeeDtrWithSummary = {
  noOfTimesLate: number | null;
  totalMinutesLate: number | null;
  lateDates: Array<number>;
  noOfTimesUndertime: number | null;
  totalMinutesUndertime: number | null;
  undertimeDates: Array<number>;
  halfDayDates: Array<number>;
  noOfTimesHalfDay: number | null;
  noAttendance: Array<number>;
};

export type EmployeeDtrWithScheduleAndSummary = {
  summary: EmployeeDtrWithSummary;
  dtrDays: Array<EmployeeDtrWithSchedule>;
};

//for manager view
export type DtrCorrection = {
  companyId: string;
  employeeFullName: string;
  id: string;
  dtrId: string;
  dtrDate: string;
  dtrTimeIn: string;
  correctedTimeIn: string;
  dtrLunchOut: string;
  correctedLunchOut: string;
  dtrLunchIn: string;
  correctedLunchIn: string;
  dtrTimeOut: string;
  correctedTimeOut: string;
  status: DtrCorrectionStatus;
  remarks: string;
};

//for employee view - dtr page
export type DtrCorrectionForEmployee = {
  lunchIn: string;
  lunchOut: string;
  remarks: string;
  status: DtrCorrectionStatus;
  timeIn: string;
  timeOut: string;
};

export type DtrCorrectionApprovalPatch = {
  id: string;
  status: DtrCorrectionStatus;
};

// Time Log Update/Correction application form
export type DtrCorrectionForm = {
  dtrId: string | null;
  timeIn: string | null;
  timeOut: string | null;
  lunchIn: string | null;
  lunchOut: string | null;
  remarks: string;
  companyId: string;
  dtrDate: string;
};

// for adding remarks for selected dates in DTR
export type DtrRemarksToSelectedDates = {
  companyId: string;
  dtrDates: Array<string>;
  remarks: string;
};

// for updating dtr remarks
export type DtrRemarks = {
  dtrId: string;
  remarks: string;
};
