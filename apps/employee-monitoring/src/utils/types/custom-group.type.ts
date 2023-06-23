/* eslint-disable @nx/enforce-module-boundaries */
import {
  EmployeeAsOptionWithPosition,
  EmployeeAsOptionWithRestDays,
} from 'libs/utils/src/lib/types/employee.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

export type CustomGroup = {
  id: string;
  name: string;
  description: string;
};

export type CustomGroupId = Pick<CustomGroup, 'id'>;

export type CustomGroupWithMembers = { customGroupDetails: CustomGroup } & {
  members: Array<EmployeeAsOptionWithRestDays>;
};

export type MutatedCgwmSelectOption = SelectOption & {
  members: Array<EmployeeAsOptionWithPosition>;
};

// Member assignment/unassignment body
export type CustomGroupMembers = {
  customGroupId: string;
  employeeIds: Array<string>;
};
