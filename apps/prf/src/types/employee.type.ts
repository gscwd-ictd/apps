import { Roles } from '../utils/constants/user-roles';

export type EmployeeSignupDetails = {
  email: string;
  userId: string;
  userRole: string;
  details: {
    companyId: string | null;
    firstName: string;
    middleName: string;
    lastName: string;
    nameExt: string;
  };
};

export type EmployeeDetails = {
  userId: string;
  companyId: string;
  userRole: Roles;
  assignment: {
    id: string;
    name: string;
    positionId: string;
    positionTitle: string;
  };
};

export type EmployeeProfile = {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
  sex: string;
  birthDate: Date;
  mobileNumber: string;
  email: string;
  photoUrl: string;
};
