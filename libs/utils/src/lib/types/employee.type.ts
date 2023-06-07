export type Assignment = {
  _id: string;
  name: string;
};

export type EmploymentDetails = {
  employeeId: string;
  companyId: string | null;
  positionTitle: string;
  assignment: Assignment;
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

export type EmployeeAsOption = Pick<EmploymentDetails, 'employeeId'> &
  Pick<PersonalDetails, 'fullName'>;

export type EmployeeAsOptionWithPosition = Pick<
  EmploymentDetails,
  'employeeId' | 'positionTitle'
> &
  Pick<PersonalDetails, 'fullName'>;

export type EmployeeAsOptionWithRestDays = Pick<
  EmploymentDetails,
  'employeeId' | 'positionTitle'
> &
  Pick<PersonalDetails, 'fullName'> & { restDays: Array<string> };

export type EmployeeAsOptionWithRestDaysN = Pick<
  EmploymentDetails,
  'employeeId' | 'positionTitle' | 'companyId'
> &
  Pick<PersonalDetails, 'fullName'> & {
    restDays: Array<number>;
    assignment: string;
  };
