/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { EmployeeDetails } from '../types/employee.type';
import { devtools } from 'zustand/middleware';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { number } from 'yup';

export type EmployeeState = {
  employeeSalaryGrade: number;
  setEmployeeSalaryGrade: (employeeSalaryGrade: number) => void;
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
    nameExtension: '',
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
    scheduleBase: ScheduleBases.OFFICE,
    orgStruct: {
      departmentName: '',
      divisionName: '',
      officeName: '',
    },
    officerOfTheDay: [],
  },
};

export const useEmployeeStore = create<EmployeeState>()(
  devtools((set) => ({
    employeeSalaryGrade: 0,
    setEmployeeSalaryGrade: (employeeSalaryGrade: number) => {
      set((state) => ({ ...state, employeeSalaryGrade }));
    },

    employeeDetails: EMPLOYEE_DATA,
    setEmployeeDetails: (employeeDetails: EmployeeDetails) => {
      set((state) => ({ ...state, employeeDetails }));
    },
  }))
);
