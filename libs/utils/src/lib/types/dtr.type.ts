import { Schedule } from './schedule.type';
import { HolidayTypes } from '../../../../utils/src/lib/enums/holiday-types.enum';

// dtr
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

export type EmployeeDtrWithSchedule = {
  day: string;
  companyId: string;
  dtr: EmployeeTimeLog; //dtr
  schedule: Schedule & EmployeeRestDay; // schedule with rest days
  holidayType: HolidayTypes | null; // recently added
};
