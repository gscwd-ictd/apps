import { TrainingType, TrainingTypeId } from './training-type.type';

export type Training = {
  id?: string;
  name: string;
  dateTo: string | Date | null;
  dateFrom: string | Date | null;
  hours: number;
  location: string;
  inOffice: boolean;
  learningServiceProvider: string;
  seminarTrainingType: TrainingType;
  assignedEmployees?: Array<string>;
};

// edit/viewing type
export type TrainingWithTrainingId = Omit<Training, 'seminarTrainingType'> &
  TrainingTypeId;

export type TrainingId = Pick<Training, 'id'>;
