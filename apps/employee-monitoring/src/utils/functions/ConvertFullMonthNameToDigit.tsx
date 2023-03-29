import dayjs from 'dayjs';

function ConvertFullMonthNameToDigit(date: string | null) {
  if (date !== null) return dayjs(date).format('YYYY-MM-DD');
  else return '-';
}

export default ConvertFullMonthNameToDigit;
