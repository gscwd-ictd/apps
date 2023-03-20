export type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export type HolidayId = Pick<Holiday, 'id'>;
