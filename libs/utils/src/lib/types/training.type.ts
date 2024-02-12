import {
  NomineeStatus,
  NomineeType,
  TrainingPreparationStatus,
  TrainingStatus,
  TrainingTypes,
} from '../enums/training.enum';

export type TrainingType = {
  id: string;
  name: string;
};

export type TrainingTypeId = Pick<TrainingType, 'id'>;

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
  type: TrainingTypes;
  trainingPreparationStatus: TrainingPreparationStatus;
  status: TrainingStatus;
};

// edit/viewing type
export type TrainingWithTrainingId = Omit<Training, 'seminarTrainingType'> & TrainingTypeId;

export type TrainingId = Pick<Training, 'trainingId'>;

export type TrainingNominee = {
  employeeId: string;
  nomineeType: NomineeType;
};

//for POST request, submission of training nomination
export type TrainingNominationData = {
  trainingDistribution: string;
  employees: Array<TrainingNominee>;
};

export type NominatedEmployees = {
  employeeId: string;
  name: string;
  nomineeType: NomineeType;
  status: NomineeStatus;
  remarks: string;
};

export type TrainingByEmployeeId = {
  nomineeId: string;
  name: string; //training name
  location: string;
  trainingStart: string;
  trainingEnd: string;
};
