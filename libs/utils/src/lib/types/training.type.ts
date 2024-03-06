import { NomineeStatus, NomineeType, TrainingStatus, TrainingTypes } from '../enums/training.enum';

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
  numberOfParticipants?: number; //for pdc secretariat/chairman/gm
  numberOfHours?: number; //for pdc secretariat/chairman/gm
  nominee?: Array<NominatedEmployees>; //for pdc secretariat/chairman/gm
  trainingId: string;
  courseTitle: string;
  location: string;
  trainingStart: string;
  trainingEnd: string;
  source: string;
  type: TrainingTypes;
  trainingPreparationStatus?: TrainingStatus; //for training selection
  status?: TrainingStatus; //for training selection
  remarks?: string;
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
  supervisor?: NomineeSupervisor; //used for pdc chairman/secretary/gm view
};

export type NomineeSupervisor = {
  name: string;
  supervisorId: string;
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

export type PdcSecretariatApproval = {
  pdcSecretary: string;
  trainingDetails: string;
  remarks?: string;
};

export type PdcChairmanApproval = {
  pdcChairman: string;
  trainingDetails: string;
  remarks?: string;
};

export type PdcGeneralManagerApproval = {
  generalManager: string;
  trainingDetails: string;
  remarks?: string;
};
