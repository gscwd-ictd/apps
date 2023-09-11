import { TrainingTypeId } from './training-type.type';

export type Training = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  location: string;
  courseTitle: string;
  trainingStart: string;
  trainingEnd: string;
  numberOfHours: number;
  courseContent: string;
  deadlineForSubmission: string;
  invitationUrl: string;
  numberOfParticipants: 12;
  postTrainingRequirements: string;
  status: string;
};

// edit/viewing type
export type TrainingWithTrainingId = Omit<Training, 'seminarTrainingType'> & TrainingTypeId;

export type TrainingId = Pick<Training, 'id'>;

// export type Training = {
//   id?: string;
//   name: string;
//   dateTo: string | Date | null;
//   dateFrom: string | Date | null;
//   hours: number;
//   location: string;
//   inOffice: boolean;
//   learningServiceProvider: string;
//   seminarTrainingType: TrainingType;
//   assignedEmployees?: Array<string>;
// };
