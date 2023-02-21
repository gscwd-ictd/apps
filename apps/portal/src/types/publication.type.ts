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
  postingStatus: string;
  hasSelected?: number;
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
