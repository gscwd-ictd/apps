import dayjs from 'dayjs';

export type DtrWorkSuspension = {
  id: string;
  name: string;
  type: 'WHOLE_DAY' | 'TIME_OF_DAY';
  /** HH:mm:ss, TIME_OF_DAY only */
  startTime: string | null;
} | null;

type LogWithSuspension = {
  workSuspension?: DtrWorkSuspension;
  schedule: { timeIn: string | null; timeOut: string | null; shift?: string | null };
};

const toMinutes = (time: string | null | undefined) => {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** Whole duty is suspended (no late / early highlight at all). */
export const isFullySuspended = (log: LogWithSuspension) => {
  const ws = log.workSuspension;
  if (!ws) return false;
  const timeIn = toMinutes(log.schedule.timeIn);
  const timeOut = toMinutes(log.schedule.timeOut);
  if (timeIn === null || timeOut === null) return false;
  const overnight = timeOut <= timeIn;
  if (ws.type === 'WHOLE_DAY') return !overnight;
  const start = toMinutes(ws.startTime);
  return start !== null && start <= timeIn && !overnight;
};

/**
 * Time out to compare the actual time out against for the "early" highlight: the suspension start
 * when the suspension runs to the end of a day-shift duty, otherwise the scheduled time out.
 */
export const effectiveTimeOut = (log: LogWithSuspension): string | null => {
  const ws = log.workSuspension;
  const schedTimeOut = log.schedule.timeOut;
  if (!ws || ws.type !== 'TIME_OF_DAY' || !ws.startTime) return schedTimeOut;
  const timeIn = toMinutes(log.schedule.timeIn);
  const timeOut = toMinutes(schedTimeOut);
  const start = toMinutes(ws.startTime);
  if (timeIn === null || timeOut === null || start === null) return schedTimeOut;
  if (timeOut <= timeIn) return schedTimeOut; // night shift: suspension is at the start of duty
  return start > timeIn && start < timeOut ? ws.startTime : schedTimeOut;
};

/** Short label for the remarks column, e.g. "Work Suspension (from 03:00 PM)". */
export const workSuspensionLabel = (log: LogWithSuspension) => {
  const ws = log.workSuspension;
  if (!ws) return null;
  if (ws.type === 'WHOLE_DAY') return 'Work Suspension (whole day)';
  return `Work Suspension (from ${dayjs(`2000-01-01 ${ws.startTime}`).format('hh:mm A')})`;
};
