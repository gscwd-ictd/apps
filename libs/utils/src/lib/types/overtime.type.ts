import { OvertimeAccomplishmentStatus, OvertimeStatus } from '../enums/overtime.enum';

//for supervisor overtime application
export type OvertimeForm = {
  overtimeImmediateSupervisorId: string;
  plannedDate: string;
  estimatedHours: number;
  purpose: string;
  employees: Array<string>;
};

//for supervisor get overtime application list
export type OvertimeList = {
  forApproval: Array<OvertimeDetails>;
  completed: Array<OvertimeDetails>;
};

//for viewing of overtime details
export type OvertimeDetails = {
  id: string;
  plannedDate: string;
  estimatedHours: string;
  purpose: string;
  status: OvertimeStatus;
  immediateSupervisorName: string;
  remarks?: string;
  employees: Array<EmployeeOvertimeDetail>;
};

export type EmployeeOvertimeDetail = {
  employeeId: string;
  companyId: string;
  fullName: string;
  scheduleBase?: string;
  positionTitle?: string;
  avatarUrl: string;
  assignment: string;
};

export type OvertimeAccomplishment = {
  id: string;
  ivmsTimeIn: string;
  ivmsTimeOut: string;
  encodedTimeIn: string | null;
  encodedTimeOut: string | null;
  accomplishments: string | null;
  remarks: string | null;
  status: string;
  computedIvmsHours: number;
  didFaceScan: boolean;
  overtimeApplicationId: string;
  plannedDate: string;
  employeeId: string;
  purpose: string;
};

//approving/disapproving of overtime application by manager
export type OvertimeApprovalPatch = {
  managerId: string;
  remarks: string;
  status: OvertimeStatus;
  overtimeApplicationId?: string;
};

//updating of employee's own accomplishment report
export type OvertimeAccomplishmentPatch = {
  employeeId: string;
  overtimeApplicationId: string;
  accomplishments: string;
  encodedTimeIn?: string;
  encodedTimeOut?: string;
};

//updating of employee's accomplishment report by manager (approve/disapprove)
export type OvertimeAccomplishmentApprovalPatch = {
  employeeId: string;
  overtimeApplicationId: string;
  remarks: string;
  status: OvertimeAccomplishmentStatus;
  followEstimatedHrs: boolean;
};
