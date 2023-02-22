export type User = {
  _id: string;
  email: string;
};

export type Profile = User & {
  companyId: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  sex: string;
  birthDate: string;
  mobile: string;
  email: string;
  photoUrl: string;
};

export type Assignment = {
  id: string;
  name: string;
  positionId: string;
  positionTitle: string;
};

export type EmploymentDetails = {
  userId: string;
  companyId: string | null;
  assignment: Assignment;
  userRole: string;
};

export type EmployeeDetails = {
  user: User;
  profile: Profile;
  employmentDetails: EmploymentDetails;
};
