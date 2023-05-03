export type PsbMessageContent = {
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
