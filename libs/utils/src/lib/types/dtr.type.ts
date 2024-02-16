import { Schedule } from './schedule.type';
import { HolidayTypes } from '../../../../utils/src/lib/enums/holiday-types.enum';

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
