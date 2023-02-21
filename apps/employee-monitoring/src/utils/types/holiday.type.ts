import { HolidayTypes } from '../enum/holiday-types.enum';

export type Holiday = {
  _id: string;
  event: string;
  eventDate: string;
  holidayTypes: HolidayTypes;
};
