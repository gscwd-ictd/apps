import { OvertimeStatus } from '../enums/overtime.enum';

//for supervisor overtime application
export type OvertimeForm = {
  overtimeSupervisorId: string;
  plannedDate: string;
  estimatedHours: number;
  purpose: string;
  employees: Array<string>;
};

//for viewing of overtime details
export type OvertimeDetails = {
  id: string;
  plannedDate: string;
  estimatedHours: string;
  purpose: string;
  status: OvertimeStatus;
  immediateSupervisorName: string;
  employees: Array<EmployeeOvertimeDetail>;
};

export type EmployeeOvertimeDetail = {
  employeeId: string;
  companyId: string;
  fullName: string;
  scheduleBase: string;
  avatarUrl: string;
  assignment: string;
};
