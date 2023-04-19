export type Publication = {
  vppId: string;
  postingDate: string | null;
  postingDeadline: Date | null;
  positionId: string;
  positionTitle: string;
  itemNumber: string;
  numberOfPositions: string | undefined;
  salaryGradeLevel: number | undefined;
  salaryGrade: string;
  annualSalary: string;
  education: string;
  training: string;
  eligibility: string;
  experience: string;
  placeOfAssignment: string;
  occupationName: string;
  prfNo: string;
  prfId: string;
  withExam: number;
  postingStatus: PublicationPostingStatus;
  hasSelected?: number;
  requestingEntitySelectionDate?: Date;
};

export type PublicationDetails = {
  allPsbSubmitted: string;
  dateOfPanelInterview: string;
  interviewDone: string;
  numberOfApplicants: string;
  numberOfInterviewedApplicants: string;
  numberOfQualifiedApplicants: string;
  salaryGrade?: number;
};

export enum PublicationPostingStatus {
  FOR_CSC_APPROVAL = 'For CSC approval',
  OPEN_FOR_APPLICATION = 'Open for application',
  CLOSED_FOR_APPLICATION = 'Closed for application',
  REQUESTING_ENTITY_SELECTION = 'Requesting entity selection',
  REQUESTING_ENTITY_SELECTION_DONE = 'Requesting entity selection done',
  SCHEDULED_FOR_EXAMINATION = 'Scheduled for examination',
  EXAMINATION_DONE = 'Examination done',
  SCHEDULED_FOR_INTERVIEW = 'Scheduled for interview',
  INTERVIEW_ONGOING = 'Interview ongoing',
  INTERVIEW_DONE = 'Interview done',
  SELECTION_DONE = 'Selection done',
  APPOINTING_AUTHORITY_SELECTION = 'Appointing authority selection',
  APPOINTING_AUTHORITY_SELECTION_DONE = 'Appointing authority selection done',
  HIRING_PROCESS_DONE = 'Hiring process done',
  FOR_PRINTING = 'For printing',
}
