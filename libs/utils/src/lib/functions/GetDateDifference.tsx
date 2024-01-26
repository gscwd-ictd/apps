import { differenceInSeconds, parse } from 'date-fns';

export function GetDateDifference(dateFrom: string, dateTo: string) {
  const difference = differenceInSeconds(
    parse(dateTo, 'yyyy-MM-dd HH:mm:ss', new Date()),
    parse(dateFrom, 'yyyy-MM-dd HH:mm:ss', new Date())
  );
  //COMPUTE DAYS
  const d = Math.floor(difference / (1 * 60 * 60 * 24));
  //COMPUTE HOURS
  const h = Math.floor((difference % (1 * 60 * 60 * 24)) / (1 * 60 * 60));
  //COMPUTE MINUTES
  const m = Math.floor((difference % (1 * 60 * 60)) / (1 * 60));
  //COMPUTE SECONDS
  const s = Math.floor((difference % (1 * 60)) / 1);

  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: s,
  };
}
