/* This function is used to convert date formats to MM-DD-YYYY format  */
import dayjs from 'dayjs';

//takes value of date and converts it to MM-DD-YYYY
//date prop must be of similar format
export const DateFormatter = (date: string | null | Date, dateFormat: string) => {
  if (date) {
    const convertedDate = dayjs(date).format(dateFormat);
    return convertedDate;
  } else {
    // const convertedDate = dayjs(now).format('MM-DD-YYYY');
    const invalidDate = '-- -- ----';
    return invalidDate;
  }
};
