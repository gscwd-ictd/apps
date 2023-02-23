import { HolidayTypes } from '../enum/holiday-types.enum';

export type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};
