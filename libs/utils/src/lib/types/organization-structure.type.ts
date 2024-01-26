/* eslint-disable @nx/enforce-module-boundaries */

export type Office = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type Department = {
  id: string;
  officeId: string;
  code: string;
  name: string;
  description: string;
};

export type Division = {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  description: string;
};

export type OrganizationOption = {
  label: string;
  value: string | number;
};
