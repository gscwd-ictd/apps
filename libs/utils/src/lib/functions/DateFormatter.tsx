/* This function is used to convert date formats to MM-DD-YYYY format  */
import dayjs from 'dayjs';

//takes value of date and converts it to MM-DD-YYYY
//date prop must be of similar format
export const DateFormatter = (date: string | null) => {
  const now = dayjs().toDate().toDateString();
  if (date) {
    const convertedDate = dayjs(date).format('MM-DD-YYYY');
    return convertedDate;
  } else {
    // const convertedDate = dayjs(now).format('MM-DD-YYYY');
    const invalidDate = '-- -- ----';
    return invalidDate;
  }
};
