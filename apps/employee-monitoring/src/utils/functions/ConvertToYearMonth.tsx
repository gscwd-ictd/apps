import dayjs from 'dayjs';

function ConvertToYearMonth(date: string | null) {
  if (date !== null) return dayjs(date).format('YYYY-MM');
  else return '-';
}

export default ConvertToYearMonth;
