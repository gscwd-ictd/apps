/* eslint-disable @nx/enforce-module-boundaries */
import { OfficerOfTheDay, OfficerOfTheDayId } from '../utils/types/officer-of-the-day.type';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type OfficerOfTheDayState = {
  getOfficersOfTheDay: Array<OfficerOfTheDay>;
  setGetOfficersOfTheDay: (getOfficersOfTheDay: Array<OfficerOfTheDay>) => void;

  errorOfficersOfTheDay: string;
  setErrorOfficersOfTheDay: (errorOfficersOfTheDay: string) => void;

  postOfficerOfTheDay: OfficerOfTheDay;
  setPostOfficerOfTheDay: (postOfficerOfTheDay: OfficerOfTheDay) => void;

  deleteOfficerOfTheDay: OfficerOfTheDayId;
  setDeleteOfficerOfTheDay: (deleteOfficerOfTheDay: OfficerOfTheDayId) => void;

  errorOfficerOfTheDay: string;
  setErrorOfficerOfTheDay: (errorOfficerOfTheDay: string) => void;

  emptyResponse: () => void;
};

export const useOfficerOfTheDayStore = create<OfficerOfTheDayState>()(
  devtools((set) => ({
    getOfficersOfTheDay: [],
    setGetOfficersOfTheDay: (getOfficersOfTheDay) => set({ getOfficersOfTheDay }),

    errorOfficersOfTheDay: '',
    setErrorOfficersOfTheDay: (errorOfficersOfTheDay) => set({ errorOfficersOfTheDay }),

    postOfficerOfTheDay: {} as OfficerOfTheDay,
    setPostOfficerOfTheDay: (postOfficerOfTheDay) => set({ postOfficerOfTheDay }),

    deleteOfficerOfTheDay: {} as OfficerOfTheDayId,
    setDeleteOfficerOfTheDay: (deleteOfficerOfTheDay) => set({ deleteOfficerOfTheDay }),

    errorOfficerOfTheDay: '',
    setErrorOfficerOfTheDay: (errorOfficerOfTheDay) => set({ errorOfficerOfTheDay }),

    emptyResponse: () =>
      set({
        postOfficerOfTheDay: {} as OfficerOfTheDay,
        deleteOfficerOfTheDay: {} as OfficerOfTheDayId,

        errorOfficersOfTheDay: '',
        errorOfficerOfTheDay: '',
      }),
  }))
);