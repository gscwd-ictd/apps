/* eslint-disable @nx/enforce-module-boundaries */
import { WorkSuspension } from '../utils/types/work-suspension.type';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type WorkSuspensionState = {
  getWorkSuspensions: Array<WorkSuspension>;
  setGetWorkSuspensions: (getWorkSuspensions: Array<WorkSuspension>) => void;

  postWorkSuspension: WorkSuspension;
  setPostWorkSuspension: (postWorkSuspension: WorkSuspension) => void;

  errorWorkSuspensions: string;
  setErrorWorkSuspensions: (errorWorkSuspensions: string) => void;

  errorWorkSuspension: string;
  setErrorWorkSuspension: (errorWorkSuspension: string) => void;

  emptyResponse: () => void;
};

export const useWorkSuspensionStore = create<WorkSuspensionState>()(
  devtools((set) => ({
    getWorkSuspensions: [],
    setGetWorkSuspensions: (getWorkSuspensions) => set({ getWorkSuspensions }),

    postWorkSuspension: {} as WorkSuspension,
    setPostWorkSuspension: (postWorkSuspension) => set({ postWorkSuspension }),

    errorWorkSuspensions: '',
    setErrorWorkSuspensions: (errorWorkSuspensions) => set({ errorWorkSuspensions }),

    errorWorkSuspension: '',
    setErrorWorkSuspension: (errorWorkSuspension) => set({ errorWorkSuspension }),

    emptyResponse: () =>
      set({
        postWorkSuspension: {} as WorkSuspension,

        errorWorkSuspensions: '',
        errorWorkSuspension: '',
      }),
  }))
);
