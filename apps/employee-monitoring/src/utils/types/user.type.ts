/* eslint-disable @nx/enforce-module-boundaries */
export type User = {
  employeeId: string;
  fullName: string;
};

export type UserRole = {
  moduleId: string;
  hasAccess: boolean;
  module: string;
  slug: string;
  url: string;
};

export type UserId = { userId: string };

export type PostRequestUserRoles = Pick<User, 'employeeId'> & {
  userRoles: Array<UserRole>;
};

export type PostReturnUserRoles = { userId: string } & Pick<
  UserRole,
  'moduleId' | 'hasAccess'
>;

export type PatchRequestUserRoles = { userRoles: Array<UserRole> };

export type PatchReturnUserRoles = { _id: string } & Pick<
  UserRole,
  'hasAccess' | 'moduleId'
>;
