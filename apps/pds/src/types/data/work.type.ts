export type WorkExperience = {
  _id?: string;
  positionTitle: string;
  companyName: string;
  monthlySalary: number | null;
  appointmentStatus: string;
  isGovernmentService: boolean;
  salaryGrade: string | null;
  from: string;
  to: string | null;
  isEdited?: boolean;
  employeeId?: string;
  isPresentWork?: boolean;
};

export type WorkExpState = {
  workExperience: Array<WorkExperience>;
  setWorkExperience: (workExperience: Array<WorkExperience>) => void;
  workExperienceOnEdit: boolean;
  setWorkExperienceOnEdit: (workExperienceOnEdit: boolean) => void;
};
