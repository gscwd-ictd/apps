export type VacancyDetails = {
  error?: string;
  annualSalary: string;
  education: string;
  eligibility: string;
  experience: string;
  itemNumber: string;
  numberOfPositions: string;
  occupationName: string;
  placeOfAssignment: string;
  positionId: string;
  positionTitle: string;
  postingDate: string;
  postingDeadline: string;
  postingStatus: string;
  prfId: string;
  prfNo: string;
  salaryGrade: string;
  training: string;
  vppId: string;
};

export type JobOpeningDetails = {
  error?: string;
  jobDescription: {
    positionId: string;
    itemNumber: string;
    positionTitle: string;
    assignedTo: {
      division: string;
      office: string;
      department: string;
    };
    salaryGrade: number;
    stepIncrement: number;
    actualSalary: number;
    natureOfAppointment: string;
    summary: string;
    description: string;
    reportsTo: string;
  };
  qualificationStandards: {
    education: string;
    training: string;
    eligibility: string;
    experience: string;
  };
  competencies: {
    positionId: string;
    positionName: string;
    salaryGrade: string;
    core: Array<JobCompetencies>;
    functional: Array<JobCompetencies>;
    crossCutting: Array<JobCompetencies>;
    managerial: Array<JobCompetencies>;
  };
};

export type JobCompetencies = {
  level: string;
  pcplId: string;
  code: string;
  name: string;
  description: string;
  keyActions: string;
};
