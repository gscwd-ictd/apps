import create from 'zustand';
import { EmployeeDetails, EmployeeProfile } from '../types/employee.type';
import { User } from '../types/user.type';

export type EmployeeState = {
  employee: any;
  profile: any;
  setEmployee: (employee: any) => void;
  setProfile: (profile: any) => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: {} as any,
  profile: {} as any,
  setEmployee: (employee: any) => {
    set((state) => ({ ...state, employee }));
  },
  setProfile: (profile: any) => {
    set((state) => ({ ...state, profile }));
  },
}));
