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
    _id: '62fef63c-b26f-11ed-a79b-000c29f95a80',
    email: 'ericsison003@gmail.com',
  },
  profile: {
    _id: '1c0787b0-093e-4362-85ff-c372c0dde496',
    companyId: null,
    firstName: 'Ferdz Dummy',
    middleName: 'Dionaldo',
    lastName: 'Ferrer',
    nameExt: 'Jr',
    sex: 'Male',
    birthDate: '1991-08-14',
    mobileNumber: '09235197604',
    email: 'ericsison003@gmail.com',
    photoUrl: '/profile.jpg',
  },
  employmentDetails: {
    userId: '62fef63c-b26f-11ed-a79b-000c29f95a80',
    companyId: '2020-007',
    assignment: {
      id: '91ddf4e0-f048-11ec-8d31-c4bde5a04065',
      name: 'Systems Development and Application Division',
      positionId: '91f25a60-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'Management Information System Researcher',
    },
    userRole: 'general_manager',
  },
};
