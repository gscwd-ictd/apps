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

export type UserRoleForPatch = {
  _id: string;
  hasAccess: boolean;
  module: string;
  slug: string;
  url: string;
};

export type UserId = { userId: string };

export type PostUserRole = Omit<UserRole, 'url'>;

export type PostRequestUserRoles = Pick<User, 'employeeId'> & {
  userRoles: Array<PostUserRole>;
};

export type PostReturnUserRoles = { userId: string } & Pick<UserRole, 'moduleId' | 'hasAccess'>;

export type PatchUserRole = { _id: string } & Omit<UserRole, 'moduleId' | 'url'>;

export type PatchRequestUserRoles = Pick<User, 'employeeId'> & { userRoles: Array<PatchUserRole> };

export type PatchReturnUserRoles = { _id: string } & Pick<UserRole, 'hasAccess'>;
