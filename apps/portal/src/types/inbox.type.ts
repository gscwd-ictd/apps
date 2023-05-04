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
