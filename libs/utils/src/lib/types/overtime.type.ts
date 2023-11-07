/* eslint-disable @nx/enforce-module-boundaries */
import { OvertimeAccomplishmentStatus, OvertimeStatus } from '../enums/overtime.enum';
import { EmployeeOvertimeDetails } from './employee.type';

export type Overtime = {
  id: string;
  plannedDate: string;
  immediateSupervisorName: string;
  employees: Array<EmployeeOvertimeDetails>;
  estimatedHours: number;
  purpose: string;
  status: OvertimeStatus;
};

export type OvertimeImmediateSupervisor = {
  id: string;
  immediateSupervisorName: string;
  positionTitle: string;
  assignment: string;
  avatarUrl: string;
};

export type OvertimeApplication = {
  overtimeApplication: {
    overtimeSupervisorId: string;
    plannedDate: string;
    estimatedHours: number;
    purpose: string;
  };
  employees: Array<string>;
};

export type PostImmediateSupervisor = {
  orgId: string;
  employeeId: string;
};

export type DeleteImmediateSupervisor = {
  employeeId: string;
};

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
  isAccomplishmentSubmitted: boolean;
  accomplishmentStatus: OvertimeAccomplishmentStatus;
};

export type OvertimeAccomplishment = {
  id: string;
  ivmsTimeIn: string;
  ivmsTimeOut: string;
  encodedTimeIn: string | null;
  encodedTimeOut: string | null;
  accomplishments: Array<string> | null;
  remarks: string | null;
  status: OvertimeAccomplishmentStatus;
  computedIvmsHours: number;
  computedEncodedHours: number;
  didFaceScan: boolean;
  overtimeApplicationId: string;
  plannedDate: string;
  employeeId: string;
  purpose: string;
  followEstimatedHrs: boolean;
  employeeSignature: string;
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
