import { Address, PermaAddress } from '../types/data/address.type';
import {
  BasicInfo,
  GovernmentIssuedIds,
  PersonalInfo,
} from '../types/data/basic-info.type';
import { EducationInfo } from '../types/data/education.type';
import { Child, Parent, Spouse } from '../types/data/family.type';
import {
  CandidateResigned,
  Convicted,
  GovernmentIssuedId,
  GuiltyCharged,
  Immigrant,
  IndigenousPwdSoloParent,
  OfficeRelation,
  Reference,
  SeparatedService,
  SupportingDetails,
} from '../types/data/supporting-info.type';

//BASIC INFO
export const BASIC_INFO: BasicInfo = {
  personalInfo: {
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: '',
    birthDate: '',
    birthPlace: '',
    sex: '',
    civilStatus: '',
    height: 0,
    weight: 0,
    bloodType: '',
    mobileNumber: '',
    telephoneNumber: '',
    citizenship: 'Filipino',
    citizenshipType: '',
    country: 'Philippines',
  },
  address: {
    residentialAddress: {
      houseNumber: '',
      street: '',
      subdivision: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: '',
      cityCode: '',
      provCode: '',
    },
    permanentAddress: {
      houseNumber: '',
      street: '',
      subdivision: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: '',
      cityCode: '',
      provCode: '',
    },
  },

  governmentIssuedIds: {
    gsisNumber: '',
    pagibigNumber: '',
    philhealthNumber: '',
    sssNumber: '',
    tinNumber: '',
    agencyNumber: '',
  },
};

//PERSONAL_INFO
export const PERSONAL_INFO: PersonalInfo = {
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  nameExtension: '',
  birthDate: '',
  birthPlace: '',
  sex: '',
  civilStatus: '',
  height: 0,
  weight: 0,
  bloodType: '',
  mobileNumber: '',
  telephoneNumber: '',
  citizenship: 'Filipino',
  citizenshipType: '',
  country: 'Philippines',
};

//GOVERNMENT_ID
export const GOVERNMENT_ID: GovernmentIssuedIds = {
  gsisNumber: '',
  pagibigNumber: '',
  philhealthNumber: '',
  sssNumber: '',
  tinNumber: '',
  agencyNumber: '',
};

//ADDRESS
export const ADDRESS: Address = {
  houseNumber: '',
  street: '',
  subdivision: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: '',
  cityCode: '',
  provCode: '',
  brgyCode: '',
};

export const PERMA_ADDRESS: PermaAddress = {
  houseNumber: '',
  street: '',
  subdivision: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: '',
  cityCode: '',
  provCode: '',
  brgyCode: '',
  checkboxAddress: false,
};

//SPOUSE_INFO
export const SPOUSE_INFO: Spouse = {
  firstName: '',
  middleName: '',
  lastName: '',
  employer: '',
  telephoneNumber: '',
  nameExtension: '',
  businessAddress: '',
  occupation: '',
};

// export const FATHER_INFO: Father = {
//   fatherFirstName: '',
//   fatherMiddleName: '',
//   fatherLastName: '',
//   fatherNameExtension: '',
// }

// export const MOTHER_INFO: Mother = {
//   motherFirstName: '',
//   motherMiddleName: '',
//   motherLastName: '',
//   motherMaidenName: '',
// }

export const PARENTS_INFO: Parent = {
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  fatherNameExtension: '',
  motherFirstName: '',
  motherMiddleName: '',
  motherLastName: '',
  // motherMaidenName: '',
};

export const CHILDREN_INFO: Child = {
  childName: '',
  birthDate: '',
};

export const ELEMENTARY: EducationInfo = {
  schoolName: '',
  degree: '',
  units: '',
  from: 0,
  to: 0,
  yearGraduated: 0,
  awards: '',
};

export const SECONDARY: EducationInfo = {
  schoolName: '',
  degree: '',
  units: '',
  from: 0,
  to: 0,
  yearGraduated: 0,
  awards: '',
};

export const COLLEGE: EducationInfo = {
  schoolName: '',
  degree: '',
  units: '',
  from: 0,
  to: 0,
  yearGraduated: 0,
  awards: '',
};

// export const PDS_INFO: PDSInfo = {
//   basicInfo: BASIC_INFO,
//   family: FAMILY,
// }

export const OFFICE_REL: OfficeRelation = {
  withinThirdDegree: false,
  withinFourthDegree: false,
  details: '',
};

export const GUILTY_CHARGED: GuiltyCharged = {
  isGuilty: false,
  guiltyDetails: '',
  isCharged: false,
  chargedDateFiled: '',
  chargedCaseStatus: '',
};

export const CONVICTED: Convicted = {
  isConvicted: false,
  details: '',
};

export const SEP_SERV: SeparatedService = {
  isSeparated: false,
  details: '',
};

export const CAND_RES: CandidateResigned = {
  isCandidate: false,
  candidateDetails: '',
  isResigned: false,
  resignedDetails: '',
};

export const IMMIGRANT: Immigrant = {
  isImmigrant: false,
  details: '',
};

export const IND_PWD_SOLO: IndigenousPwdSoloParent = {
  isIndigenousMember: false,
  indigenousMemberDetails: '',
  isPwd: false,
  pwdIdNumber: '',
  isSoloParent: false,
  soloParentIdNumber: '',
};

export const SUPPORTING_DETAILS: SupportingDetails = {
  officeRelation: OFFICE_REL,
  guiltyCharged: GUILTY_CHARGED,
  convicted: CONVICTED,
  separatedService: SEP_SERV,
  candidateResigned: CAND_RES,
  immigrant: IMMIGRANT,
  indigenousPwdSoloParent: IND_PWD_SOLO,
};

export const REFERENCES: Reference = {
  name: '',
  address: '',
  telephoneNumber: '',
};

export const GOVT_ISSUED_ID: GovernmentIssuedId = {
  issuedId: '',
  idNumber: '',
  issueDate: '',
  issuePlace: '',
};
