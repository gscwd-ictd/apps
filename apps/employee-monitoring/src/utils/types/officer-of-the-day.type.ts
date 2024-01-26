export type OfficerOfTheDay = {
  _id: string;
  name: string;
  assignment: string;
  dateFrom: string;
  dateTo: string;
};

export type FormPostOfficerOfTheDay = Omit<OfficerOfTheDay, '_id'> & { app: string };

export type OfficerOfTheDayId = Pick<OfficerOfTheDay, '_id'>;