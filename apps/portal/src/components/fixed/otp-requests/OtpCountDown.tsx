import { differenceInSeconds, format, parse } from 'date-fns';

export function getCountDown(
  id: string,
  countingDown: boolean,
  otpName: string
) {
  const targetDate: any = localStorage.getItem(`${otpName}OtpEndTime_${id}`);
  if (countingDown === true) {
    const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const difference = differenceInSeconds(
      parse(targetDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
      parse(now, 'yyyy-MM-dd HH:mm:ss', new Date())
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
      id: id,
    };
  }
}
