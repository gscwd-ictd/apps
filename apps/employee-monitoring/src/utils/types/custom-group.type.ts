/* eslint-disable @nx/enforce-module-boundaries */
import {
  EmployeeAsOptionWithPosition,
  EmployeeAsOptionWithRestDaysN,
} from 'libs/utils/src/lib/types/employee.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

export type CustomGroup = {
  id: string;
  name: string;
  description: string;
};

export type CustomGroupId = Pick<CustomGroup, 'id'>;

export type CustomGroupWithMembers = { customGroupDetails: CustomGroup } & {
  members: Array<EmployeeAsOptionWithRestDaysN>;
};

export type MutatedCgwmSelectOption = SelectOption & {
  members: Array<EmployeeAsOptionWithPosition>;
};
