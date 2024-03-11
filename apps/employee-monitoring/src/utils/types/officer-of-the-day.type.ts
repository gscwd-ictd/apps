export type OfficerOfTheDay = {
  id: string;
  employeeId: string;
  employeeName: string;
  orgId: string;
  orgName: string;
  dateFrom: string;
  dateTo: string;
};

export type Employee = {
  label: string;
  value: string;
};

export type Assignment = {
  label: string;
  value: string;
};

export type FormPostOfficerOfTheDay = Omit<OfficerOfTheDay, 'id' | 'employeeName' | 'orgName'> & { app: string };

export type OfficerOfTheDayId = Pick<OfficerOfTheDay, 'id'>;