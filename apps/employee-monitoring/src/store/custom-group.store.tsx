/* eslint-disable @nx/enforce-module-boundaries */
import { devtools } from 'zustand/middleware';

import { create } from 'zustand';
import {
  CustomGroup,
  CustomGroupWithMembers,
  CustomGroupId,
  CustomGroupMembers,
} from '../utils/types/custom-group.type';
import { EmployeeAsOptionWithPosition } from 'libs/utils/src/lib/types/employee.type';

type ResponseCustomGroup = {
  postResponse: CustomGroup;
  updateResponse: CustomGroup;
  deleteResponse: CustomGroupId;
};

type ResponseMember = {
  assignResponse: CustomGroupMembers;
  unassignResponse: CustomGroupMembers;
};

type LoadingCustomGroup = {
  loadingCustomGroups: boolean;
  loadingCustomGroup: boolean;
  loadingCustomGroupWithMembers: boolean;
  loadingMembers: boolean;
  loadingAssignedMembers: boolean;
  loadingUnassignedMembers: boolean;
};

type ErrorCustomGroup = {
  errorCustomGroups: string;
  errorCustomGroup: string;
  errorCustomGroupWithMembers: string;
  errorMembers: string;
  errorAssignedMembers: string;
  errorUnassignedMembers: string;
};

export type CustomGroupState = {
  customGroups: Array<CustomGroup>;
  customGroup: ResponseCustomGroup;
  customGroupWithMembers: CustomGroupWithMembers;

  toAssignMembers: Array<string>;
  toUnassignMembers: Array<string>;
  assignedMembers: Array<EmployeeAsOptionWithPosition>;
  unassignedMembers: Array<EmployeeAsOptionWithPosition>;
  members: ResponseMember;

  isRowsSelected: boolean;
  isOptionSelected: boolean;
  loading: LoadingCustomGroup;
  error: ErrorCustomGroup;

  getCustomGroups: () => void;
  getCustomGroupsSuccess: (response: Array<CustomGroup>) => void;
  getCustomGroupsFail: (error: string) => void;

  getCustomGroupWithMembers: () => void;
  getCustomGroupWithMembersSuccess: (response: CustomGroupWithMembers) => void;
  getCustomGroupWithMembersFail: (error: string) => void;

  postCustomGroup: () => void;
  postCustomGroupSuccess: (response: CustomGroup) => void;
  postCustomGroupFail: (error: string) => void;

  updateCustomGroup: () => void;
  updateCustomGroupSuccess: (response: CustomGroup) => void;
  updateCustomGroupFail: (error: string) => void;

  deleteCustomGroup: () => void;
  deleteCustomGroupSuccess: (response: CustomGroupId) => void;
  deleteCustomGroupFail: (error: string) => void;

  getAssignedMembers: () => void;
  getAssignedMembersSuccess: (
    response: Array<EmployeeAsOptionWithPosition>
  ) => void;
  getAssignedMembersFail: (error: string) => void;

  getUnassignedMembers: () => void;
  getUnassignedMembersSuccess: (
    response: Array<EmployeeAsOptionWithPosition>
  ) => void;
  getUnassignedMembersFail: (error: string) => void;

  assignMember: (employeeIds: Array<string>) => void;
  unassignMember: (employeeId: string) => void;

  postMembers: () => void;
  postMembersSuccess: (response: CustomGroupMembers) => void;
  postMembersFail: (error: string) => void;

  deleteMembers: () => void;
  deleteMembersSuccess: (response: CustomGroupMembers) => void;
  deleteMembersFail: (error: string) => void;

  setIsRowSelected: (value: boolean) => void;
  setIsOptionSelected: (value: boolean) => void;

  emptyResponse: () => void;

  selectedCustomGroupWithMembers: CustomGroupWithMembers;
  setSelectedCustomGroupWithMembers: (
    selectedCustomGroupWithMembers: CustomGroupWithMembers
  ) => void;
};

export const useCustomGroupStore = create<CustomGroupState>()(
  devtools((set) => ({
    customGroups: [],
    customGroup: {
      postResponse: {} as CustomGroup,
      updateResponse: {} as CustomGroup,
      deleteResponse: {} as CustomGroupId,
    },
    customGroupWithMembers: {} as CustomGroupWithMembers,

    assignedMembers: [],
    unassignedMembers: [],
    toAssignMembers: [],
    toUnassignMembers: [],
    members: {
      assignResponse: {} as CustomGroupMembers,
      unassignResponse: {} as CustomGroupMembers,
    },

    isRowsSelected: true,
    isOptionSelected: true,
    loading: {
      loadingCustomGroups: false,
      loadingCustomGroup: false,
      loadingCustomGroupWithMembers: false,
      loadingMembers: false,
      loadingAssignedMembers: false,
      loadingUnassignedMembers: false,
    },
    error: {
      errorCustomGroups: '',
      errorCustomGroup: '',
      errorCustomGroupWithMembers: '',
      errorMembers: '',
      errorAssignedMembers: '',
      errorUnassignedMembers: '',
    },

    // actions to get list of custom groups
    getCustomGroups: () =>
      set((state) => ({
        ...state,
        customGroups: [],
        loading: { ...state.loading, loadingCustomGroups: true },
        error: { ...state.error, errorCustomGroups: '' },
      })),
    getCustomGroupsSuccess: (response: Array<CustomGroup>) =>
      set((state) => ({
        ...state,
        customGroups: response,
        loading: { ...state.loading, loadingCustomGroups: false },
      })),
    getCustomGroupsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroups: false },
        error: { ...state.error, errorCustomGroups: error },
      })),

    // actions to get details of a single custom groups
    getCustomGroupWithMembers: () =>
      set((state) => ({
        ...state,
        customGroupWithMembers: {} as CustomGroupWithMembers,
        loading: { ...state.loading, loadingCustomGroupWithMembers: true },
        error: { ...state.error, errorCustomGroupWithMembers: '' },
      })),
    getCustomGroupWithMembersSuccess: (response: CustomGroupWithMembers) =>
      set((state) => ({
        ...state,
        customGroupWithMembers: response,
        loading: { ...state.loading, loadingCustomGroupWithMembers: false },
      })),
    getCustomGroupWithMembersFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingCustomGroupWithMembers: false },
        error: { ...state.error, errorCustomGroupWithMembers: error },
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

    // actions to get assigned members of a group
    getAssignedMembers: () =>
      set((state) => ({
        ...state,
        assignedMembers: [],
        loading: { ...state.loading, loadingAssignedMembers: true },
        error: { ...state.error, errorAssignedMembers: '' },
      })),
    getAssignedMembersSuccess: (
      response: Array<EmployeeAsOptionWithPosition>
    ) =>
      set((state) => ({
        ...state,
        assignedMembers: response,
        loading: { ...state.loading, loadingAssignedMembers: false },
      })),
    getAssignedMembersFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingAssignedMembers: false },
        error: { ...state.error, errorAssignedMembers: error },
      })),

    // actions to get unassigned members of a group
    getUnassignedMembers: () =>
      set((state) => ({
        ...state,
        unassignedMembers: [],
        loading: { ...state.loading, loadingUnassignedMembers: true },
        error: { ...state.error, errorUnassignedMembers: '' },
      })),
    getUnassignedMembersSuccess: (
      response: Array<EmployeeAsOptionWithPosition>
    ) =>
      set((state) => ({
        ...state,
        unassignedMembers: response,
        loading: { ...state.loading, loadingUnassignedMembers: false },
      })),
    getUnassignedMembersFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingUnassignedMembers: false },
        error: { ...state.error, errorUnassignedMembers: error },
      })),

    // actions for member adding/removal on table
    assignMember: (employeeIds: Array<string>) =>
      set((state) => ({
        ...state,
        toAssignMembers: employeeIds,
      })),
    unassignMember: (employeeId: string) =>
      set((state) => ({
        ...state,
        toUnassignMembers: [...state.toUnassignMembers, employeeId],
      })),

    // actions to add members to a group
    postMembers: () =>
      set((state) => ({
        ...state,
        members: {
          ...state.members,
          assignResponse: {} as CustomGroupMembers,
        },
        loading: { ...state.loading, loadingMembers: true },
        error: { ...state.error, errorMembers: '' },
      })),
    postMembersSuccess: (response: CustomGroupMembers) =>
      set((state) => ({
        ...state,
        members: {
          ...state.members,
          assignResponse: response,
        },
        loading: { ...state.loading, loadingMembers: false },
      })),
    postMembersFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingMembers: false },
        error: { ...state.error, errorMembers: error },
      })),

    // actions to delete members of a group
    deleteMembers: () =>
      set((state) => ({
        ...state,
        members: {
          ...state.members,
          unassignResponse: {} as CustomGroupMembers,
        },
        loading: { ...state.loading, loadingMembers: true },
        error: { ...state.error, errorMembers: '' },
      })),
    deleteMembersSuccess: (response: CustomGroupMembers) =>
      set((state) => ({
        ...state,
        members: {
          ...state.members,
          unassignResponse: response,
        },
        loading: { ...state.loading, loadingMembers: false },
      })),
    deleteMembersFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingMembers: false },
        error: { ...state.error, errorMembers: error },
      })),

    // Check if there are options selected for assigning
    setIsOptionSelected: (value: boolean) =>
      set((state) => ({
        ...state,
        isOptionSelected: value,
      })),
    // Check if there are rows selected for unassigning
    setIsRowSelected: (value: boolean) =>
      set((state) => ({
        ...state,
        isRowsSelected: value,
      })),

    // reset custom groups responses
    emptyResponse: () =>
      set((state) => ({
        ...state,
        customGroup: {
          ...state.customGroup,
          postResponse: {} as CustomGroup,
          updateResponse: {} as CustomGroup,
          deleteResponse: {} as CustomGroupId,
        },
        error: {
          ...state.error,
          errorCustomGroups: '',
          errorCustomGroup: '',
        },
      })),

    // local selected custom group
    selectedCustomGroupWithMembers: {} as CustomGroupWithMembers,

    // set local selected custom group
    setSelectedCustomGroupWithMembers: (
      selectedCustomGroupWithMembers: CustomGroupWithMembers
    ) => set((state) => ({ ...state, selectedCustomGroupWithMembers })),
  }))
);
