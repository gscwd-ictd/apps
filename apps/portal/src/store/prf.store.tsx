import create from 'zustand';
import { EmployeeDetails, Profile } from '../types/employee.type';
import { User } from '../types/user.type';

export type PrfState = {
  isModalOpen: boolean;
  user: User;
  employee: EmployeeDetails;
  profile: Profile;
  setIsModalOpen: (state: boolean) => void;
  setUser: (user: User) => void;
  setEmployee: (employee: EmployeeDetails) => void;
  setProfile: (profile: Profile) => void;
};

export const usePrfStore = create<PrfState>((set) => ({
  isModalOpen: false,
  user: {} as User,
  employee: {} as EmployeeDetails,
  profile: {} as Profile,
  setIsModalOpen: (isModalOpen: boolean) => {
    set((state) => ({ ...state, isModalOpen }));
  },
  setUser: (user: User) => {
    set((state) => ({ ...state, user }));
  },
  setEmployee: (employee: EmployeeDetails) => {
    set((state) => ({ ...state, employee }));
  },
  setProfile: (profile: Profile) => {
    set((state) => ({ ...state, profile }));
  },
}));
