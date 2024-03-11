/* eslint-disable @nx/enforce-module-boundaries */
import { Assignment, Employee, OfficerOfTheDay, OfficerOfTheDayId } from '../utils/types/officer-of-the-day.type';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OfficerOfTheDayState = {
  getOfficersOfTheDay: Array<OfficerOfTheDay>;
  setGetOfficersOfTheDay: (getOfficersOfTheDay: Array<OfficerOfTheDay>) => void;

  getEmployees: Array<Employee>;
  setGetEmployees: (getEmployees: Array<Employee>) => void;

  getAssignments: Array<Assignment>;
  setGetAssignments: (getAssignments: Array<Assignment>) => void;

  postOfficerOfTheDay: OfficerOfTheDay;
  setPostOfficerOfTheDay: (postOfficerOfTheDay: OfficerOfTheDay) => void;

  deleteOfficerOfTheDay: OfficerOfTheDayId;
  setDeleteOfficerOfTheDay: (deleteOfficerOfTheDay: OfficerOfTheDayId) => void;

  errorOfficersOfTheDay: string;
  setErrorOfficersOfTheDay: (errorOfficersOfTheDay: string) => void;

  errorOfficerOfTheDay: string;
  setErrorOfficerOfTheDay: (errorOfficerOfTheDay: string) => void;

  errorEmployees: string;
  setErrorEmployees: (errorEmployees: string) => void;

  errorAssignments: string;
  setErrorAssignments: (errorAssignments: string) => void;

  emptyResponse: () => void;
};

export const useOfficerOfTheDayStore = create<OfficerOfTheDayState>()(
  devtools((set) => ({
    getOfficersOfTheDay: [],
    setGetOfficersOfTheDay: (getOfficersOfTheDay) => set({ getOfficersOfTheDay }),

    getEmployees: [],
    setGetEmployees: (getEmployees) => set({ getEmployees }),

    getAssignments: [],
    setGetAssignments: (getAssignments) => set({ getAssignments }),

    postOfficerOfTheDay: {} as OfficerOfTheDay,
    setPostOfficerOfTheDay: (postOfficerOfTheDay) => set({ postOfficerOfTheDay }),

    deleteOfficerOfTheDay: {} as OfficerOfTheDayId,
    setDeleteOfficerOfTheDay: (deleteOfficerOfTheDay) => set({ deleteOfficerOfTheDay }),

    errorOfficersOfTheDay: '',
    setErrorOfficersOfTheDay: (errorOfficersOfTheDay) => set({ errorOfficersOfTheDay }),

    errorOfficerOfTheDay: '',
    setErrorOfficerOfTheDay: (errorOfficerOfTheDay) => set({ errorOfficerOfTheDay }),

    errorEmployees: '',
    setErrorEmployees: (errorEmployees) => set({ errorEmployees }),

    errorAssignments: '',
    setErrorAssignments: (errorAssignments) => set({ errorAssignments }),

    emptyResponse: () =>
      set({
        postOfficerOfTheDay: {} as OfficerOfTheDay,
        deleteOfficerOfTheDay: {} as OfficerOfTheDayId,

        errorOfficersOfTheDay: '',
        errorOfficerOfTheDay: '',
      }),
  }))
);