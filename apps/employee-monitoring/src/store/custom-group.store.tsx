import { devtools } from 'zustand/middleware';

import { create } from 'zustand';
import {
  CustomGroup,
  CustomGroupWithMembers,
} from '../utils/types/custom-group.type';

type LoadingCustomGroup = {
  loadingCustomGroups: boolean;
  loadingCustomGroup: boolean;
};

type ErrorCustomGroup = {
  errorCustomGroups: string;
  errorCustomGroup: string;
};

export type CustomGroupState = {
  customGroups: Array<CustomGroup>;
  customGroupWithMembers: CustomGroupWithMembers;
  loading: LoadingCustomGroup;
  error: ErrorCustomGroup;

  getCustomGroups: (loading: boolean) => void;
  getCustomGroupsSuccess: (
    loading: boolean,
    response: Array<CustomGroup>
  ) => void;
  getCustomGroupsFail: (loading: boolean, error: string) => void;
};

export const useCustomGroupStore = create<CustomGroupState>()(
  devtools((set) => ({
    customGroups: [],
    customGroupWithMembers: {} as CustomGroupWithMembers,
    loading: {
      loadingCustomGroups: false,
      loadingCustomGroup: false,
    },
    error: {
      errorCustomGroups: '',
      errorCustomGroup: '',
    },

    getCustomGroups: (loading: boolean) =>
      set((state) => ({
        ...state,
        customGroups: [],
        loading: { ...state.loading, loadingCustomGroups: loading },
        error: { ...state.error, errorCustomGroups: '' },
      })),
    getCustomGroupsSuccess: (loading: boolean, response: Array<CustomGroup>) =>
      set((state) => ({
        ...state,
        customGroups: response,
        loading: { ...state.loading, loadingCustomGroups: loading },
      })),
    getCustomGroupsFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroups: loading },
        error: { ...state.error, errorCustomGroups: error },
      })),
  }))
);
