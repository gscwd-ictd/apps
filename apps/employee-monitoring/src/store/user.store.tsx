/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  User,
  UserRole,
  UserId,
  PostReturnUserRoles,
  PatchReturnUserRoles,
  UserRoleForPatch,
} from '../utils/types/user.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { Module } from '../utils/types/module.type';

export type UsersState = {
  getEmsUsers: Array<User>;
  setGetEmsUsers: (getEmsUsers: Array<User>) => void;

  errorEmsUsers: string;
  setErrorEmsUsers: (errorEmsUsers: string) => void;

  getNonEmsUsers: Array<SelectOption>;
  setGetNonEmsUsers: (getNonEmsUsers: Array<SelectOption>) => void;

  errorNonEmsUsers: string;
  setErrorNonEmsUsers: (errorNonEmsUsers: string) => void;

  getUserRoles: Array<UserRole>;
  setGetUserRoles: (getUserRoles: Array<UserRole>) => void;

  getUserRolesForPatch: Array<UserRoleForPatch>;
  setGetUserRolesForPatch: (getUserRoles: Array<UserRoleForPatch>) => void;

  errorGetUserRoles: string;
  setErrorGetUserRoles: (errorGetUserRoles: string) => void;

  postUser: PostReturnUserRoles;
  setPostUser: (postUser: PostReturnUserRoles) => void;

  updateUser: PatchReturnUserRoles;
  setUpdateUser: (updateUser: PatchReturnUserRoles) => void;

  deleteUser: UserId;
  setDeleteUser: (deleteUser: UserId) => void;

  errorUser: string;
  setErrorUser: (errorUser: string) => void;

  emptyResponse: () => void;
};

export const useUsersStore = create<UsersState>()(
  devtools((set) => ({
    getEmsUsers: [],
    setGetEmsUsers: (getEmsUsers) => set({ getEmsUsers }),

    errorEmsUsers: '',
    setErrorEmsUsers: (errorEmsUsers) => set({ errorEmsUsers }),

    getNonEmsUsers: [],
    setGetNonEmsUsers: (getNonEmsUsers) => set({ getNonEmsUsers }),

    errorNonEmsUsers: '',
    setErrorNonEmsUsers: (errorNonEmsUsers) => set({ errorNonEmsUsers }),

    getUserRoles: [],
    setGetUserRoles: (getUserRoles) => set({ getUserRoles }),

    getUserRolesForPatch: [],
    setGetUserRolesForPatch: (getUserRolesForPatch) => set({ getUserRolesForPatch }),

    errorGetUserRoles: '',
    setErrorGetUserRoles: (errorGetUserRoles) => set({ errorGetUserRoles }),

    postUser: {} as PostReturnUserRoles,
    setPostUser: (postUser) => set({ postUser }),

    updateUser: {} as PatchReturnUserRoles,
    setUpdateUser: (updateUser) => set({ updateUser }),

    deleteUser: {} as UserId,
    setDeleteUser: (deleteUser) => set({ deleteUser }),

    errorUser: '',
    setErrorUser: (errorUser) => set({ errorUser }),

    emptyResponse: () =>
      set({
        postUser: {} as PostReturnUserRoles,
        updateUser: {} as PatchReturnUserRoles,
        deleteUser: {} as UserId,

        errorEmsUsers: '',
        errorNonEmsUsers: '',
        errorUser: '',
      }),
  }))
);
