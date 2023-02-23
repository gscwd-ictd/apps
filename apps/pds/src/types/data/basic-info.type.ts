import { Address } from './address.type';

export type BasicInfoType = {
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension: string;
  birthDate: string;
  sex: string;
  birthPlace: string;
  civilStatus: string;
  height: number;
  weight: number;
  bloodType: string;
  citizenship: string;
  citizenshipType: string;
  country: string;
  telephoneNumber: string;
  mobileNumber: string;
  email: string;
  gsisNumber: string;
  pagibigNumber: string;
  philhealthNumber: string;
  sssNumber: string;
  tinNumber: string;
  agencyNumber: string;
  permaHouseNumber: string | void | undefined;
  permaStreet: string | void | undefined;
  permaSubd: string | void | undefined;
  permaProv: string | void | undefined;
  permaProvCode: string | void | undefined;
  permaCity: string | void | undefined;
  permaCityCode: string | void | undefined;
  permaBrgy: string | void | undefined;
  permaBrgyCode: string | void | undefined;
  permaZipCode: string | void | undefined;
  resHouseNumber: string | void | undefined;
  resStreet: string | void | undefined;
  resSubd: string | void | undefined;
  resProv: string | void | undefined;
  resProvCode: string | void | undefined;
  resCity: string | void | undefined;
  resCityCode: string | void | undefined;
  resBrgy: string | void | undefined;
  resBrgyCode: string | void | undefined;
  resZipCode: string | void | undefined;
  checkboxSameAddr: boolean;
};

export type BasicInfo = {
  personalInfo: PersonalInfo;
  address: {
    residentialAddress: Address;
    permanentAddress: Address;
  };
  governmentIssuedIds: GovernmentIssuedIds;
};

//Personal Info
export type PersonalInfo = {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  birthDate: string | null;
  birthPlace: string;
  sex: string;
  civilStatus: string;
  height: number;
  weight: number;
  bloodType: string;
  mobileNumber: string;
  telephoneNumber: string;
  citizenship: string;
  citizenshipType: string;
  country: string;
  employeeId?: string;
};

export type GovernmentIssuedIds = {
  gsisNumber: string;
  pagibigNumber: string;
  philhealthNumber: string;
  sssNumber: string;
  tinNumber: string;
  agencyNumber: string;
  employeeId?: string;
};

export type BasicInfoForm = PersonalInfo & GovernmentIssuedIds;
