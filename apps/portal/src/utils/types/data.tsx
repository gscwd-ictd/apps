import { Dispatch, SetStateAction } from 'react';
import { Competency } from '../../types/dr.type';

export interface Employee {
  email: string;
  userId: string;
  userRole: string;
  employmentDetails: {
    employeeId: string;
    companyId: string;
    positionTitle: string;
    assignment: {
      id: string;
      name: string;
    };
  };
  personalDetails: {
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    nameExt: string;
  };
}

export const COMPETENCY: Competency = {
  code: '',
  level: '',
  competencyDescription: '',
  keyActions: '',
  name: '',
  pcplId: '',
};

export type Otp = {
  token: string;
  value: number;
  isError: boolean;
};

export type OtpCode = {
  otp: Otp;
  setOtp: Dispatch<SetStateAction<Otp>>;
};
