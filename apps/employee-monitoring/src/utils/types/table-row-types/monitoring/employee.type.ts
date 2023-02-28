import {
  EmploymentDetails,
  PersonalDetails,
} from 'libs/utils/src/lib/types/employee.type';

// export type EmployeeRowData = Pick<
//   EmploymentDetails,
//   'assignment' | 'positionTitle'
// > &
//   Pick<PersonalDetails, 'fullName'>;

export type EmployeeRowData = {
  id?: string;
  fullName: string;
  assignment: { id: string; name: string };
  positionTitle: string;
};
