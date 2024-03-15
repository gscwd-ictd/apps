/* This function is used to determine if an employee's time log is considered undertime or not */
import dayjs from 'dayjs';

export const UseLateLunchInChecker = (timeOutLog: string, scheduledTimeOut: string) => {
  const now = dayjs().toDate().toDateString();
  const lunchIn = dayjs(now + ' ' + timeOutLog).format('H:mm');
  const scheduledLunchIn = dayjs(now + ' ' + scheduledTimeOut)
    .add(29, 'minute')
    .format('H:mm'); // add 29 minutes to schedule lunch in (usually 12:31PM)

  if (lunchIn > scheduledLunchIn) {
    return true;
  } else {
    return false;
  }
};
