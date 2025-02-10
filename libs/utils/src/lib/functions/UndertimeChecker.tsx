/* This function is used to determine if an employee's time log is considered undertime or not */
import dayjs from 'dayjs';

export const UseUndertimeChecker = (timeOutLog: string, scheduledTimeOut: string) => {
  const now = dayjs().toDate().toDateString();
  const timeOut = dayjs(now + ' ' + timeOutLog);
  const schedule = dayjs(now + ' ' + scheduledTimeOut);
  // const timeOut = dayjs(now + ' ' + timeOutLog).format('hh:mm A');
  // const schedule = dayjs(now + ' ' + scheduledTimeOut).format('hh:mm A');

  if (timeOut.isBefore(schedule, 'm')) {
    return true;
  } else {
    return false;
  }
};
