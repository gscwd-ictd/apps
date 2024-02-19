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
  id?: string; //for pdc secretariat/chairman //training ID
  distributionId: string;
  numberOfSlots: number;
  numberOfParticipants?: number; //for pdc secretariat/chairman
  trainingId: string;
  courseTitle: string;
  location: string;
  trainingStart: string;
  trainingEnd: string;
  source: string;
  type: TrainingTypes;
  trainingPreparationStatus?: TrainingPreparationStatus; //for training selection
  status?: TrainingStatus; //for training selection
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
  status: NomineeStatus; //pending,accepted,declined
  remarks: string;
};

export type TrainingByEmployeeId = {
  nomineeId: string;
  name: string; //training name
  location: string;
  trainingStart: string;
  trainingEnd: string;
  nomineeStatus: NomineeStatus; //pending,accepted,declined
  remarks: string;
};
