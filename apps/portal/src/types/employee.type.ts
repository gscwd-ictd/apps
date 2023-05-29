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
  isHRMPSB?: boolean;
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
    _id: '86de1dd4-de28-4930-bc82-b767e1f1ff62',
    email: 'ericsison003@gmail.com',
  },
  profile: {
    _id: '86de1dd4-de28-4930-bc82-b767e1f1ff62',
    companyId: null,
    firstName: 'Ferdz Dummy',
    middleName: 'Dionaldo',
    lastName: 'Ferrer',
    nameExt: 'Jr',
    sex: 'Male',
    birthDate: '1991-08-14',
    mobile: '09235197604',
    email: 'ericsison003@gmail.com',
    photoUrl: '/profile.jpg',
  },
  employmentDetails: {
    userId: '86de1dd4-de28-4930-bc82-b767e1f1ff62',
    companyId: '2020-008',
    assignment: {
      id: '928bb2b7-f048-11ec-8d31-c4bde5a04065',
      name: 'Mainline Expansion, Rehabitation and Civil Works Division',
      positionId: '929448ca-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'Senior Engineer A',
    },
    userRole: 'general_manager',
  },
};
