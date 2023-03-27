import dayjs from 'dayjs';

function UseConvertDayToTime(time: string | null) {
  if (time !== null) return dayjs('1/1/1 ' + time).format('h:mm A');
  else return '-';
}

export default UseConvertDayToTime;
