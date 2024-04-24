/* This function is used to convert date formats to MM-DD-YYYY hh:mm A format  */
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

//takes value of date and converts it to MM-DD-YYYY
//date prop must be of similar format
export const DateTimeFormatter = (date: string | null | Date, dateFormat?: string) => {
  if (isEmpty(dateFormat)) {
    dateFormat = 'MM-DD-YYYY hh:mm A';
  }

  if (date) {
    const convertedDate = dayjs(date).format(dateFormat);
    return convertedDate;
  } else {
    const invalidDate = '-- -- ---- --:--:--';
    return invalidDate;
  }
};
