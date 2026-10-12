export enum WorkSuspensionType {
  WHOLE_DAY = 'WHOLE_DAY',
  TIME_OF_DAY = 'TIME_OF_DAY',
  LEGACY = 'LEGACY',
}

export type WorkSuspension = {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  suspensionDate: string;
  suspensionType: WorkSuspensionType;
  /** HH:mm:ss, TIME_OF_DAY only */
  suspensionStartTime: string | null;
  /** LEGACY rows only */
  suspensionHours: number | null;
  isArchived: boolean;
  memoNo: string | null;
  remarks: string | null;
};

export type FormWorkSuspension = {
  name: string;
  suspensionDate: string;
  suspensionType: WorkSuspensionType.WHOLE_DAY | WorkSuspensionType.TIME_OF_DAY;
  suspensionStartTime: string;
  memoNo: string;
  remarks: string;
};

export type WorkSuspensionPreviewRow = {
  scheduleId: string;
  scheduleName: string;
  timeIn: string;
  timeOut: string;
  shift: string | null;
  suspendedMinutes: number;
  fraction: number;
  ndSuspendedMinutes: number;
};
