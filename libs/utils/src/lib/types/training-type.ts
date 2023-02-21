export type Training = {
  id?: string;
  name: string;
  dateTo: string;
  dateFrom: string;
  hours: number;
  location: string;
  inOffice: boolean;
  learningServiceProvider: string;
  type: string;
  assignedEmployees?: Array<string>;
};

export type TrainingType = {
  id?: string;
  name: string;
};
