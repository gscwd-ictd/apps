/* eslint-disable @nx/enforce-module-boundaries */
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
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
  nameExtension: string;
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

export type OrgStructure = {
  departmentName: string;
  divisionName: string;
  officeName: string;
};

export type OfficerOfTheDay = {
  id: string;
  name: string;
};

export type EmploymentDetails = {
  salaryGrade: string;
  salaryGradeAmount: number;
  scheduleBase: ScheduleBases;
  userId: string;
  companyId: string | null;
  assignment: Assignment;
  orgStruct: OrgStructure;
  userRole: string;
  isHRMPSB?: boolean;
  isPdcChairman?: boolean;
  isPdcSecretariat?: boolean;
  overtimeImmediateSupervisorId: string;
  officerOfTheDay: Array<OfficerOfTheDay>;
  employeeFullName?: string;
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

export const employeeCeliaDananDummy: EmployeeDetails = {
  user: {
    _id: '010a0911-5b3d-11ed-a08b-000c29f95a80',
    email: 'mariaceliadandan@gscwd.com',
  },
  profile: {
    birthDate: '1971-01-27',
    companyId: '2001-002',

    email: 'mariaceliadandan@gscwd.com',
    firstName: 'Maria Celia',
    lastName: 'Dandan',
    middleName: 'N',
    mobileNumber: '09770912663',
    nameExtension: '',
    photoUrl: 'http://172.20.110.45:4500/DANDAN.jpg',
    sex: 'Female',
    _id: '5e156167-5b4d-11ed-a08b-000c29f95a80',
  },
  employmentDetails: {
    salaryGrade: '24-1',
    salaryGradeAmount: 88410,
    scheduleBase: ScheduleBases.OFFICE,
    userId: '010a0911-5b3d-11ed-a08b-000c29f95a80',
    companyId: '2001-002',
    assignment: {
      id: '923f93eb-f048-11ec-8d31-c4bde5a04065',
      name: 'Engineering and Construction Department',
      positionId: '925c64e4-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'OIC-Department Manager',
    },
    orgStruct: {
      departmentName: 'Engineering and Construction Department',
      divisionName: null,
      officeName: 'Office of the Assistant General Manager for Operations and Technical Services',
    },
    userRole: 'oic_department_manager',
    isHRMPSB: false,
    isPdcChairman: false,
    isPdcSecretariat: false,
    overtimeImmediateSupervisorId: '',
    officerOfTheDay: [],
  },
};

export const employeeTurijaDummy: EmployeeDetails = {
  user: {
    _id: '010a0e53-5b3d-11ed-a08b-000c29f95a80',
    email: 'cornelioturija@gscwd.com',
  },
  profile: {
    _id: '5e156770-5b4d-11ed-a08b-000c29f95a80',
    companyId: '1998-002',
    firstName: 'Cornelio',
    middleName: 'Toledo',
    lastName: 'Turija',
    nameExtension: 'Jr.',
    sex: 'Male',
    birthDate: '1966-07-11',
    mobileNumber: '09988633053',
    email: 'cornelioturija@gscwd.com',
    photoUrl: 'http://172.20.110.60:4500/TURIJA.jpg',
  },
  employmentDetails: {
    userId: '010a0e53-5b3d-11ed-a08b-000c29f95a80',
    companyId: '1998-002',
    isPdcChairman: false,
    isPdcSecretariat: false,
    // employeeFullName: "Cornelio T. Turija, CE",
    // photoUrl: "http://172.20.110.60:4500/TURIJA.jpg",
    salaryGradeAmount: 116040,
    salaryGrade: '26-1',
    isHRMPSB: true,
    assignment: {
      id: '926d29b4-f048-11ec-8d31-c4bde5a04065',
      name: 'Pipeline and Appurtenances Maintenance Department',
      positionId: '928769a7-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'Department Manager A',
    },
    orgStruct: {
      officeName: 'Office of the Assistant General Manager for Operations and Technical Services',
      divisionName: null,
      departmentName: 'Pipeline and Appurtenances Maintenance Department',
    },
    scheduleBase: ScheduleBases.OFFICE,
    userRole: 'department_manager',
    officerOfTheDay: [],
    overtimeImmediateSupervisorId: null,
  },
};

export const employeeGabalesDummy: EmployeeDetails = {
  user: {
    _id: '010a02be-5b3d-11ed-a08b-000c29f95a80',
    email: 'michaelgabales@gscwd.com',
  },
  profile: {
    _id: '5e1563a2-5b4d-11ed-a08b-000c29f95a80',
    companyId: '2010-003',
    firstName: 'Michael',
    middleName: 'Galindo',
    lastName: 'Gabales',
    nameExtension: 'N/A',
    sex: 'Male',
    birthDate: '1979-10-10',
    mobileNumber: '09998807590',
    email: 'michaelgabales@gscwd.com',
    photoUrl: 'http://172.20.110.60:4500/GABALES.jpg',
  },
  employmentDetails: {
    userId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
    companyId: '2010-003',
    isPdcChairman: false,
    isPdcSecretariat: false,
    salaryGradeAmount: 90078,
    salaryGrade: '24-1',
    isHRMPSB: true,
    assignment: {
      id: '91ddae79-f048-11ec-8d31-c4bde5a04065',
      name: 'Information and Communication Technology Department',
      positionId: '9235802e-f048-11ec-8d31-c4bde5a04065',
      positionTitle: 'OIC-Department Manager',
    },
    orgStruct: {
      officeName: 'Office of the Assistant General Manager for Administration',
      divisionName: null,
      departmentName: 'Information and Communication Technology Department',
    },
    scheduleBase: ScheduleBases.OFFICE,
    userRole: 'oic_department_manager',
    officerOfTheDay: [],
    overtimeImmediateSupervisorId: null,
  },
};
