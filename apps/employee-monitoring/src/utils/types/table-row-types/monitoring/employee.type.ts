/* eslint-disable @nx/enforce-module-boundaries */
import {
  EmploymentDetails,
  PersonalDetails,
} from 'libs/utils/src/lib/types/employee.type';

export type EmployeeRowData = Pick<
  EmploymentDetails,
  'assignment' | 'positionTitle' | 'companyId' | 'natureOfAppointment'
> &
  Pick<PersonalDetails, 'fullName'> & { id: string };
