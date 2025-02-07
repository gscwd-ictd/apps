/* This function is used to determine if an  employee's time log is considered late or not */
import dayjs from 'dayjs';

export const UseLateChecker = (timeInLog: string, scheduledTimeIn: string) => {
  const now = dayjs().toDate().toDateString();
  const timeIn = dayjs(now + ' ' + timeInLog);
  const schedule = dayjs(now + ' ' + scheduledTimeIn);
  if (timeIn.isBefore(schedule, 'm') || timeIn.isSame(schedule, 'm')) {
    return false;
  } else {
    return true;
  }
};
