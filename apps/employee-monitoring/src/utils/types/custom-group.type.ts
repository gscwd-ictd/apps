/* eslint-disable @nx/enforce-module-boundaries */
import { EmployeeAsOptionWithPosition } from 'libs/utils/src/lib/types/employee.type';

export type CustomGroup = {
  id: string;
  name: string;
  description: string;
};

export type CustomGroupId = Pick<CustomGroup, 'id'>;

export type CustomGroupWithMembers = CustomGroup & {
  members: Array<EmployeeAsOptionWithPosition>;
};
