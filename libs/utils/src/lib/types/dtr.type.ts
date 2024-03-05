import { Schedule } from './schedule.type';
import { HolidayTypes } from '../../../../utils/src/lib/enums/holiday-types.enum';
import { CANCELLED } from 'dns';
import { LeaveDateStatus } from '../enums/leave.enum';
import { DtrCorrectionApproval } from '../enums/approval.enum';

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
  dtr: EmployeeTimeLog; //dtr
  schedule: Schedule & EmployeeRestDay; // schedule with rest days
  holidayType: HolidayTypes | null; // recently added
  isHoliday: boolean;
  isRestDay: boolean;
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
  status: DtrCorrectionApproval;
  remarks: string;
};

export type DtrCorrectionApprovalPatch = {
  id: string;
  status: DtrCorrectionApproval;
};

// Time Log Update/Correction application form
export type DtrCorrectionForm = {
  dtrId: string;
  timeIn: string;
  timeOut: string;
  lunchIn: string;
  lunchOut: string;
  remarks: string;
};
