import dayjs from 'dayjs';

export const UseTwelveHourFormat = (time: string) => {
  const now = dayjs().toDate().toDateString();

  return dayjs(now + ' ' + time).format('hh:mm A');
};
