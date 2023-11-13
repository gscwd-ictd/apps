import { TrainingTypeId } from './training-type.type';

export type RecommendedEmployee = {
  employeeId: string;
  name: string;
};

export type Training = {
  id: string;
  location: string;
  courseTitle: string;
  trainingStart: string;
  trainingEnd: string;
  preparationStatus: string;
  numberOfSlots: number;
  recommended: Array<RecommendedEmployee>;
};

// edit/viewing type
export type TrainingWithTrainingId = Omit<Training, 'seminarTrainingType'> & TrainingTypeId;

export type TrainingId = Pick<Training, 'id'>;
