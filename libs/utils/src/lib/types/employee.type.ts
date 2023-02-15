export type Assignment = {
  _id: string;
  name: string;
};

export type EmploymentDetails = {
  employeeId: string;
  companyId: string | null;
  positionTitle: string;
  assignment: Assignment;
};

export type PersonalDetails = {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
};

export type EmployeeProfile = {
  employmentDetails: EmploymentDetails;
  personalDetails: PersonalDetails;
};
