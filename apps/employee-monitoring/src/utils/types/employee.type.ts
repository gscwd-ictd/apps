export type Profile = {
  companyId: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
  sex: string;
  birthDate: string | Date | null;
  mobileNumber: string;
  photoUrl: string;
};

export type Assignment = {
  id: string;
  name: string;
  positionId: string;
  positionTitle: string;
};

export type EmploymentDetails = {
  salaryGrade: string;
  salaryGradeAmount: number;
  userId: string;
  companyId: string | null;
  assignment: Assignment;
  userRole: string;
  isHRMPSB?: boolean;
  isPdcChairman?: boolean;
  isPdcSecretariat?: boolean;
  overtimeImmediateSupervisorId: string;
};

export type EmployeeDetails = {
  profile: Profile;
  employmentDetails: EmploymentDetails;
};
