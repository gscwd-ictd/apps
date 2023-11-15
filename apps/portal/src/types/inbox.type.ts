/* eslint-disable @nx/enforce-module-boundaries */
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

export type PsbMessageContent = {
  details: {
    assignment: string;
    numberOfPositions: number;
    positionId: string;
    positionTitle: string;
    schedule: string;
    venue: string;
    vppId: string;
    message: string;
    acknowledgedSchedule: boolean;
    declinedSchedule: boolean;
    declineReason: string;
  };
  psbMembers: Array<PsbMembers>;
};

export type PsbMembers = {
  psbNo: number;
  fullName: string;
  employeePosition: string;
  assignment: string;
  acknowledgedSchedule: number;
};

export type OvertimeMessageContent = {
  plannedDate: string;
  purpose: string;
  status: OvertimeStatus;
  estimatedHours: number;
  employeeDetails: Array<OvertimeMembers>;
};

export type OvertimeMembers = {
  employeeId: string;
  employeeFullName: string;
  avatarUrl: string;
};
