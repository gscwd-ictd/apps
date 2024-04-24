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
