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
      division: {
        id: string;
        name: string;
      };
      office: {
        id: string;
        name: string;
      };
      department: {
        id: string;
        name: string;
      };
    };
    salary: {
      id: string;
      stepIncrement: number;
      amount: number;
      salaryGrade: number;
    };

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
    // crossCutting: Array<JobCompetencies>; //! removed due to crosscutting and functional are merged
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
