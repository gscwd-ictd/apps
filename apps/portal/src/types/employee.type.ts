import { Roles } from '../utils/constants/user-roles';

export type User = {
  _id: string;
  email: string;
};

export type Profile = User & {
  companyId: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
  sex: string;
  birthDate: string | Date | null;
  mobile: string;

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

export type EmployeeDetailsPrf = {
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

export const employeeDummy: EmployeeDetails = {
  user: {
    _id: 'a4b8902c-ab61-4008-8945-80e66d891f37',
    email: 'ericsison003@gmail.com',
  },
  profile: {
    _id: 'a4b8902c-ab61-4008-8945-80e66d891f37',
    companyId: null,
    firstName: 'Rannie May',
    middleName: 'D',
    lastName: 'Sy',
    nameExt: 'Jr',
    sex: 'Male',
    birthDate: '1991-08-14',
    mobile: '09238045092',
    email: 'ericsison003@gmail.com',
    photoUrl: '/avatars/avatar4.png',
  },
  employmentDetails: {
    userId: 'a4b8902c-ab61-4008-8945-80e66d891f37',
    companyId: null,
    assignment: {
      id: '928bb2b7-f048-11ec-8d31-c4bde5a04065',
      name: 'Mainline Expansion, Rehabitation and Civil Works Division',
      positionId: '929448ca-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'Senior Engineer A',
    },
    userRole: 'division_manager',
  },
};
