import { TrainingTypeId } from './training-type.type';

export type RecommendedEmployee = {
  employeeId: string;
  name: string;
};

export type Training = {
  distributionId: string;
  numberOfSlots: number;
  trainingId: string;
  courseTitle: string;
  location: string;
  trainingStart: string;
  trainingEnd: string;
  source: string;
  type: string;
  trainingPreparationStatus: string;
  status: string;
};

// edit/viewing type
export type TrainingWithTrainingId = Omit<Training, 'seminarTrainingType'> & TrainingTypeId;

export type TrainingId = Pick<Training, 'trainingId'>;
