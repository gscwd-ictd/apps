export type EmployeeTimeLog = {
  id: string;
  companyId: string;
  dtrDate: string;

  timeIn: string;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type EmployeeSchedule = {
  id: string;
  timeIn: string;
  lunchOut: string;
  lunchIn: string;
  timeOut: string;

  scheduleBase: string;
  scheduleName: string;
  scheduleType: string;
  shift: string;
};

export type EmployeeRestDay = {
  restDaysNames: string;
  restDaysNumbers: string;
};

export type EmployeeDtrWithSchedule = {
  dtr: EmployeeTimeLog;
  schedule: EmployeeSchedule & EmployeeRestDay;
};
