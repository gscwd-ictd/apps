/* This function is used to convert date formats to MM-DD-YYYY hh:mm A format  */
import dayjs from 'dayjs';

//takes value of date and converts it to MM-DD-YYYY
//date prop must be of similar format
export const DateTimeFormatter = (date: string | null | Date) => {
  if (date) {
    const convertedDate = dayjs(date).format('MM-DD-YYYY hh:mm A');
    return convertedDate;
  } else {
    // const convertedDate = dayjs(now).format('MM-DD-YYYY');
    const invalidDate = '-- -- ---- --:--:--';
    return invalidDate;
  }
};
