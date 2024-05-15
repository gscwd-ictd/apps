export type Position = {
  designation?: string;
  itemNumber?: string;
  hasDuties?: number;
  positionId: string;
  positionTitle: string;
  remarks?: string;
  state?: boolean;
  sequenceNo?: number;
  hasOngoingPrf?: 0 | 1;
  hasEmployee?: number;
  employeeName?: string | null;
};
