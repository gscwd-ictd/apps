import dayjs from 'dayjs';

export const convertToTime = (time: string) => {
  return dayjs('1/1/1 ' + time).format('h:mm A');
};
