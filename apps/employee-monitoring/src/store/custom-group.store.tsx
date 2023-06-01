import { devtools } from 'zustand/middleware';

import { create } from 'zustand';
import {
  CustomGroup,
  CustomGroupWithMembers,
  CustomGroupId,
} from '../utils/types/custom-group.type';

type ResponseCustomGroup = {
  postResponse: CustomGroup;
  updateResponse: CustomGroup;
  deleteResponse: CustomGroupId;
};

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
  customGroup: ResponseCustomGroup;
  customGroupWithMembers: CustomGroupWithMembers;
  loading: LoadingCustomGroup;
  error: ErrorCustomGroup;

  getCustomGroups: (loading: boolean) => void;
  getCustomGroupsSuccess: (
    loading: boolean,
    response: Array<CustomGroup>
  ) => void;
  getCustomGroupsFail: (loading: boolean, error: string) => void;

  postCustomGroup: () => void;
  postCustomGroupSuccess: (response: CustomGroup) => void;
  postCustomGroupFail: (error: string) => void;

  updateCustomGroup: () => void;
  updateCustomGroupSuccess: (response: CustomGroup) => void;
  updateCustomGroupFail: (error: string) => void;

  deleteCustomGroup: () => void;
  deleteCustomGroupSuccess: (response: CustomGroupId) => void;
  deleteCustomGroupFail: (error: string) => void;
};

export const useCustomGroupStore = create<CustomGroupState>()(
  devtools((set) => ({
    customGroups: [],
    customGroup: {
      postResponse: {} as CustomGroup,
      updateResponse: {} as CustomGroup,
      deleteResponse: {} as CustomGroup,
    },
    customGroupWithMembers: {} as CustomGroupWithMembers,
    loading: {
      loadingCustomGroups: false,
      loadingCustomGroup: false,
    },
    error: {
      errorCustomGroups: '',
      errorCustomGroup: '',
    },

    // actions to get list of custom groups
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

    // actions to add new custom group
    postCustomGroup: () =>
      set((state) => ({
        ...state,
        customGroup: {
          ...state.customGroup,
          postResponse: {} as CustomGroup,
        },
        loading: { ...state.loading, loadingCustomGroup: true },
        error: { ...state.error, errorCustomGroup: '' },
      })),
    postCustomGroupSuccess: (response: CustomGroup) =>
      set((state) => ({
        ...state,
        customGroup: { ...state.customGroup, postResponse: response },
        loading: { ...state.loading, loadingCustomGroup: false },
      })),
    postCustomGroupFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroup: false },
        error: { ...state.error, errorCustomGroup: error },
      })),

    // actions to edit custom group details
    updateCustomGroup: () =>
      set((state) => ({
        ...state,
        customGroup: {
          ...state.customGroup,
          updateResponse: {} as CustomGroup,
        },
        loading: { ...state.loading, loadingCustomGroup: true },
        error: { ...state.error, errorCustomGroup: '' },
      })),
    updateCustomGroupSuccess: (response: CustomGroup) =>
      set((state) => ({
        ...state,
        customGroup: { ...state.customGroup, updateResponse: response },
        loading: { ...state.loading, loadingCustomGroup: false },
      })),
    updateCustomGroupFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroup: false },
        error: { ...state.error, errorCustomGroup: error },
      })),

    // actions to delete a custom group
    deleteCustomGroup: () =>
      set((state) => ({
        ...state,
        customGroup: {
          ...state.customGroup,
          deleteResponse: {} as CustomGroupId,
        },
        loading: { ...state.loading, loadingCustomGroup: true },
        error: { ...state.error, errorCustomGroup: '' },
      })),
    deleteCustomGroupSuccess: (response: CustomGroupId) =>
      set((state) => ({
        ...state,
        customGroup: { ...state.customGroup, deleteResponse: response },
        loading: { ...state.loading, loadingCustomGroup: false },
      })),
    deleteCustomGroupFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroup: false },
        error: { ...state.error, errorCustomGroup: error },
      })),
  }))
);
