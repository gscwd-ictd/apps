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

export type OvertimeAccomplishment = {
  id: string;
  ivmsTimeIn: string;
  ivmsTimeOut: string;
  encodedTimeIn: string;
  encodedTimeOut: string;
  accomplishments: string;
  followEstimatedHrs: boolean;
  remarks: string;
  status: OvertimeAccomplishmentStatus;
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
