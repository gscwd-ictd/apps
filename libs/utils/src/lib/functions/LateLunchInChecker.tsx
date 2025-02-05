/* This function is used to determine if an employee's time log is considered undertime or not */
import dayjs from 'dayjs';

export const UseLateLunchInChecker = (lunchInLog: string, scheduledLunchInLog: string) => {
  const now = dayjs().toDate().toDateString();
  const lunchIn = dayjs(now + ' ' + lunchInLog);
  const scheduledLunchIn = dayjs(now + ' ' + scheduledLunchInLog).add(29, 'minute'); // add 29 minutes to schedule lunch in (usually 12:31PM)
  // if (lunchIn > scheduledLunchIn)
  if (lunchIn.isAfter(scheduledLunchIn)) {
    return true;
  } else {
    return false;
  }
};
