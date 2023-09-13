/* eslint-disable @nx/enforce-module-boundaries */
import { OvertimeStatus, OvertimeAccomplishmentStatus } from './../../../../../libs/utils/src/lib/enums/overtime.enum';
import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';

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

// employeeId and orgId
