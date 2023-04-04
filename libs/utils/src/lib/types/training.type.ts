export type Training = {
  id?: string;
  name: string;
  dateTo: string | Date | null;
  dateFrom: string | Date | null;
  hours: number;
  location: string;
  inOffice: boolean;
  learningServiceProvider: string;
  type: string;
  assignedEmployees?: Array<string>;
};

export type TrainingId = Pick<Training, 'id'>;
