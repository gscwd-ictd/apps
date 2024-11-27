import {
  NomineeStatus,
  NomineeType,
  TrainingNominationStatus,
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
  numberOfParticipants?: number; //for pdc secretariat/chairman/gm
  numberOfHours?: number; //for pdc secretariat/chairman/gm
  nominees?: Array<NominatedEmployees>; //for pdc secretariat/chairman/gm
  trainingId: string; //for pdc secretariat/chairman //training ID
  courseTitle: string;
  location: string;
  trainingStart: string;
  trainingEnd: string;
  source: string;
  type: TrainingTypes;
  trainingPreparationStatus?: TrainingStatus; //for training selection
  status?: TrainingStatus; //for training selection
  remarks?: string;
  nominationStatus: TrainingNominationStatus;
};

//from L&D route
export type TrainingDetails = {
  actualNumberOfParticipants: number;
  courseContent: Array<{ title: string }>;
  courseTitle: string;
  createdAt: string;
  deadlineForSubmission: string | null;
  deletedAt: string | null;
  id: string;
  location: string;
  lspSource: string; //speaker
  numberOfHours: number;
  numberOfParticipants: number;
  preparedBy: {
    employeeId: string;
    name: string;
    positionTitle: string;
    signature: string;
  };
  source: {
    id: string;
    name: string; // host event organizer (either office or external organization)
  };
  status: TrainingStatus;
  trainingDesign: {
    courseTitle: string;
    id: string;
  };
  trainingEnd: string;
  trainingStart: string;
  trainingLspDetails: Array<{
    email: string;
    id: string;
    name: string;
    source: string;
    type: string;
  }>;
  trainingRequirements: Array<{
    document: string;
  }>;
  trainingTags: Array<{
    id: string;
    name: string;
  }>;
  type: TrainingTypes;
  updatedAt: string;
};

export type TrainingRequirement = {
  document: string;
  isSelected?: boolean;
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
  assignment: string;
  companyId: string;
  employeeId: string;
  isReplacedBy?: boolean;
  name: string;
  nomineeType: NomineeType;
  status: NomineeStatus; //pending,accepted,declined
  remarks: string;
  supervisor?: NomineeSupervisor; //used for pdc chairman/secretary/gm view
};

export type NomineeSupervisor = {
  distributionId: string;
  name: string;
  supervisorId: string;
};

export type TrainingByEmployeeId = {
  batchEnd: string;
  batchNumber: string;
  batchStart: string;
  nomineeId: string;
  name: string; //training name
  location: string;
  trainingStart: string;
  trainingEnd: string;
  nomineeStatus: NomineeStatus; //pending,accepted,declined
  trainingStatus: TrainingStatus;
  remarks: string;
  supervisorName: string;
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

export type BucketFile = {
  id: string;
  name: string;
  href: string;
  fileLink: string;
  sizeOriginal: string;
  mimeType: string;
};
