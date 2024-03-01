export type OfficerOfTheDay = {
  id: string;
  employeeName: string;
  orgName: string;
  dateFrom: string;
  dateTo: string;
};

export type FormPostOfficerOfTheDay = Omit<OfficerOfTheDay, 'id'> & { app: string };

export type OfficerOfTheDayId = Pick<OfficerOfTheDay, 'id'>;