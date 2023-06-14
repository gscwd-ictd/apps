import { Schedule } from './schedule.type';

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

// export type EmployeeSchedule = {
//   id: string;
//   timeIn: string;
//   lunchOut: string;
//   lunchIn: string;
//   timeOut: string;
//   scheduleBase: string;
//   scheduleName: string;
//   scheduleType: string;
//   shift: string;
// };

export type EmployeeRestDay = {
  restDaysNames: string;
  restDaysNumbers: string;
};

export type EmployeeDtrWithSchedule = {
  day: string;
  companyId: string;
  dtr: EmployeeTimeLog; //dtr
  schedule: Schedule & EmployeeRestDay; // schedule with rest days
};
