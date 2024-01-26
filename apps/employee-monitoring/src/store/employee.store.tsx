/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EmployeeOption } from '../../../../libs/utils/src/lib/types/employee.type';

export type EmployeesState = {
  employeeOptions: Array<EmployeeOption>;
  setEmployeeOptions: (employeeOptions: Array<EmployeeOption>) => void;

  errorEmployeeOptions: string;
  setErrorEmployeeOptions: (errorEmployeeOptions: string) => void;
};

export const useEmployeeStore = create<EmployeesState>()(
  devtools((set) => ({
    employeeOptions: [],
    setEmployeeOptions: (employeeOptions) => set({ employeeOptions }),

    errorEmployeeOptions: '',
    setErrorEmployeeOptions: (errorEmployeeOptions) => set({ errorEmployeeOptions }),
  }))
);
