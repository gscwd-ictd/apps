import { ScheduleBases } from '../enums/schedule.enum';
import { UserRole } from '../enums/user-roles.enum';

export type Assignment = {
  _id: string;
  name: string;
};

export type EmploymentDetails = {
  employeeId: string;
  companyId: string | null;
  positionTitle: string;
  assignment: Assignment;
  natureOfAppointment: string;
};

export type EmployeeWithDetails = {
  userId: string;
  photoUrl: string;
  companyId: string;
  fullName: string;
  isHRMPSB: number;
  assignment: {
    id: string;
    name: string;
    positionId: string;
    positionTitle: string;
  };
  userRole: UserRole;
};

export type PersonalDetails = {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
};

export type EmployeeProfile = {
  employmentDetails: EmploymentDetails;
  personalDetails: PersonalDetails;
};

export type EmployeeId = Pick<EmploymentDetails, 'employeeId'>;

export type EmployeeAsOption = Pick<EmploymentDetails, 'employeeId'> & Pick<PersonalDetails, 'fullName'>;

export type EmployeeAsOptionWithPosition = Pick<EmploymentDetails, 'employeeId' | 'companyId' | 'positionTitle'> &
  Pick<PersonalDetails, 'fullName'> & { assignment: string };

// The as EmployeeAsOptionWithPosition but with restDays
// export type EmployeeAsOptionWithRestDays = Pick<EmploymentDetails, 'employeeId' | 'companyId' | 'positionTitle'> &
//   Pick<PersonalDetails, 'fullName'> & {
//     restDays: Array<number>;
//     assignment: string;
//   };

export type EmployeeAsOptionWithRestDays = EmployeeAsOptionWithPosition & {
  restDays: Array<number>;
};

export type EmployeeOvertimeDetails = Pick<EmploymentDetails, 'employeeId' | 'companyId'> &
  Pick<PersonalDetails, 'fullName'> & { scheduleBase: ScheduleBases | null; assignment: string };
