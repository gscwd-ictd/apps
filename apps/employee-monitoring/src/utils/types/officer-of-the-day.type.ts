export type OfficerOfTheDay = {
  _id: string;
  name: string;
  assignment: string;
  dateFrom: string;
  dateTo: string;
};

export type OfficerOfTheDayId = Pick<OfficerOfTheDay, '_id'>;
