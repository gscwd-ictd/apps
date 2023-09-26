/* This function is used to convert a time log from "08:04:57" format to hh:mm A format ex. (8:04 AM) */
import dayjs from 'dayjs';

export const UseTwelveHourFormat = (time: string | null) => {
  const now = dayjs().toDate().toDateString();
  const noTime = '--:-- --';
  if (time) {
    return dayjs(now + ' ' + time).format('hh:mm A');
  } else {
    return noTime;
  }
};
