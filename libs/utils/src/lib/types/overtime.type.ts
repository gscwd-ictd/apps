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
  supervisorName: string;
};

//for viewing of overtime details
export type OvertimeDetails = {
  id: string;
  plannedDate: string;
  dateApproved: string;
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
  overtimeAccomplishmentId: string;
};

export type OvertimeAccomplishment = {
  id: string;
  ivmsTimeIn: string;
  ivmsTimeOut: string;
  estimatedHours: number;
  encodedTimeIn: string | null;
  encodedTimeOut: string | null;
  accomplishments: Array<string> | null;
  remarks: string | null;
  status: OvertimeAccomplishmentStatus;
  computedIvmsHours: number;
  computedEncodedHours: number;
  didFaceScan: boolean;
  overtimeApplicationId: string;
  dateOfOTApproval: string;
  plannedDate: string;
  employeeId: string;
  purpose: string;
  followEstimatedHrs: boolean;
  employeeSignature: string;
  supervisorName: string;
  entriesForTheDay: Array<string>;
};

//for pdf
export type OvertimeAccomplishmentReport = {
  date: string;
  accomplishments: string;
  employeeName: string;
  assignment: string;
  employeeSignature: string;
  supervisorName: string;
  supervisorSignature: string;
  supervisorPosition: string;
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
  employeeId?: string;
  employeeIds?: Array<string>;
  overtimeApplicationId: string;
  remarks?: string;
  status: OvertimeAccomplishmentStatus;
  actualHrs: number;
};

//for pdf
export type OvertimeAuthorization = {
  requestedDate: string;
  purpose: string;
  plannedDate: string;
  estimatedHours: number;
  status: OvertimeStatus;
  managerApprovalDate: string;
  employees: Array<OvertimAuthorizationEmployee>;
  signatories: {
    employeeName: string;
    employeeSignature: string;
    supervisorName: string;
    supervisorSignature: string;
  };
};

export type OvertimAuthorizationEmployee = {
  overtimeEmployeeId: string;
  companyId: string;
  employeeId: string;
  name: string;
  assignment: string;
  position: string;
};

//for pdf
export type OvertimeSummary = {
  assignedTo: string;
  periodCovered: string;
  summary: Array<OvertimeSummaryEmployee>;
  signatories: {
    preparedBy: Signatory;
    notedBy: Signatory;
    approvedBy: Signatory;
  };
  overallTotalRegularOTAmount: number;
  overallTotalOffOTAmount: number;
  overallSubstituteDutyOTAmount: number;
  overallNightDifferentialAmount: number;
  overallTotalOTAmount: number;
};

export type Signatory = {
  name: string;
  signature: string;
  position: string;
};

export type OvertimeSummaryEmployee = {
  employeeFullName: string;
  userId: string;
  positionId: string;
  overtimes: Array<OvertimeDayDetails>;
  monthlyRate: number;
  hourlyRate: number;
  totalRegularOTHoursRendered: number; // B
  totalOffOTHoursRendered: number; //total holiday/day off ot hours (c)
  regularOTAmount: number; //amount a x b x 1.25
  offOTAmount: number; //amount A x C x 1.5
  substituteDutyOTHours: number;
  substituteAmount: number;
  nightDifferentialHrs: number;
  nightDifferentialAmount: number;
  totalOvertimeAmount: number; //total overtime amount
  totalOTHoursRendered: number; //total no. ot hours
};

export type OvertimeDayDetails = {
  day: number;
  hoursRendered: number | null;
};
