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
    _id: '7bda7038-9a26-44a0-b649-475a6118eccc',
    email: 'ericsison003@gmail.com',
  },
  profile: {
    _id: '25b09405-4a7c-4762-a479-7521482fa3fa',
    companyId: null,
    firstName: 'Benito ',
    middleName: 'D',
    lastName: 'Sison',
    nameExt: 'Jr',
    sex: 'Male',
    birthDate: '1991-08-14',
    mobile: '09238045092',
    email: 'ericsison003@gmail.com',
    photoUrl: '/avatars/avatar4.png',
  },
  employmentDetails: {
    userId: '7bda7038-9a26-44a0-b649-475a6118eccc',
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
