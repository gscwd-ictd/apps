import { create } from 'zustand';
import { EmployeeDetails } from '../types/employee.type';
import { devtools } from 'zustand/middleware';

export type EmployeeState = {
  employeeDetails: EmployeeDetails;
  setEmployeeDetails: (employeeDetails: EmployeeDetails) => void;
};

export const EMPLOYEE_DATA: EmployeeDetails = {
  user: {
    _id: '',
    email: '',
  },
  profile: {
    _id: '',
    companyId: null,
    firstName: '',
    middleName: '',
    lastName: '',
    nameExt: '',
    sex: '',
    birthDate: '',
    mobileNumber: '',
    email: '',
    photoUrl: '',
  },
  employmentDetails: {
    salaryGrade: '',
    salaryGradeAmount: 0,
    userId: '',
    companyId: null,
    assignment: {
      id: '',
      name: '',
      positionId: '',
      positionTitle: '',
    },
    userRole: '',
    overtimeImmediateSupervisorId: '',
  },
};

export const useEmployeeStore = create<EmployeeState>()(
  devtools((set) => ({
    employeeDetails: EMPLOYEE_DATA,
    setEmployeeDetails: (employeeDetails: EmployeeDetails) => {
      set((state) => ({ ...state, employeeDetails }));
    },
  }))
);

export const mockEmployeeDetails = {
  user: {
    createdAt: '2022-10-11T08:39:42.982Z',
    updatedAt: '2022-10-11T01:46:20.895Z',
    _id: '7bda7038-9a26-44a0-b649-475a6118eccc',
    email: 'ericsison003@gmail.com',
  },
  profile: {
    createdAt: '2022-10-11T09:20:38.843Z',
    updatedAt: '2022-10-11T01:47:16.732Z',
    _id: '25b09405-4a7c-4762-a479-7521482fa3fa',
    companyId: null,
    firstName: 'Benito ',
    middleName: 'D',
    lastName: 'Sison',
    nameExt: 'Jr',
    sex: 'Male',
    birthDate: '1991-08-14',
    mobileNumber: '09238045092',
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
    userRole: 'rank_and_file',
  },
};
