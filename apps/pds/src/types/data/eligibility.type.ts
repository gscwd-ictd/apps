export type Eligibility = {
  _id?: string;
  name: string;
  rating: string;
  examDate: ExamDate;
  examDateFrom?: string;
  examDateTo?: string | null;
  examPlace: string;
  licenseNumber: string;
  validity: string | Date | null;
  employeeId?: string;
  isOneDayOfExam?: boolean;
  isEdited?: boolean;
};

type ExamDate = {
  from: string;
  to: string | null | undefined;
};

export type EligibilityState = {
  eligibility: Array<Eligibility>;
  setEligibility: (eligibility: Array<Eligibility>) => void;
  eligibilityOnEdit: boolean;
  setEligibilityOnEdit: (eligibilityOnEdit: boolean) => void;
};
