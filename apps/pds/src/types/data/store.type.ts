import e from 'cors';
import { Address } from './address.type';
import { PersonalInfo, GovernmentIssuedIds } from './basic-info.type';
import { EducationInfo } from './education.type';
import { Spouse, Parent, Child } from './family.type';

export type PersonalInfoState = {
  personalInfo: PersonalInfo;
  setPersonalInfo: (personalInfo: PersonalInfo) => void;
  personalInfoOnEdit?: boolean;
  setPersonalInfoOnEdit?: (personalInfoOnEdit: boolean) => void;
};

export type GovernmentIDState = {
  governmentIssuedIds: GovernmentIssuedIds;
  setGovernmentIssuedIds: (GovernmentIssuedIds: GovernmentIssuedIds) => void;
  governmentIssuedIdsOnEdit?: boolean;
  setGovernmentIssuedIdsOnEdit?: (governmentIssuedIdsOnEdit: boolean) => void;
};

export type ResidentialAddressState = {
  residentialAddress: Address;
  setResidentialAddress: (residentialAddress: Address) => void;
  residentialAddressOnEdit: boolean;
  setResidentialAddressOnEdit: (residentialAddressOnEdit: boolean) => void;
};

export type PermanentAddressState = {
  permanentAddress: Address;
  setPermanentAddress: (permanentAddress: Address) => void;
  permanentAddressOnEdit: boolean;
  setPermanentAddressOnEdit: (permanentAddressOnEdit: boolean) => void;
};

export type SpouseState = {
  spouse: Spouse;
  setSpouse: (spouse: Spouse) => void;
  spouseOnEdit: boolean;
  setSpouseOnEdit: (spouseOnEdit: boolean) => void;
};

export type ParentsState = {
  parents: Parent;
  setParents: (parents: Parent) => void;
  fatherOnEdit: boolean;
  setFatherOnEdit: (fatherOnEdit: boolean) => void;
  motherOnEdit: boolean;
  setMotherOnEdit: (motherOnEdit: boolean) => void;
};

export type ChildrenState = {
  children: Array<Child>;
  setChildren: (children: Array<Child>) => void;
  childrenOnEdit: boolean;
  setChildrenOnEdit: (childrenOnEdit: boolean) => void;
};

export type ElementaryState = {
  elementary: EducationInfo;
  setElementary: (elementary: EducationInfo) => void;
  elementaryOnEdit: boolean;
  setElementaryOnEdit: (elementaryOnEdit: boolean) => void;
};

export type SecondaryState = {
  secondary: EducationInfo;
  setSecondary: (secondary: EducationInfo) => void;
  secondaryOnEdit: boolean;
  setSecondaryOnEdit: (secondaryOnEdit: boolean) => void;
};

export type CollegeState = {
  college: Array<EducationInfo>;
  setCollege: (college: Array<EducationInfo>) => void;
  collegeOnEdit: boolean;
  setCollegeOnEdit: (collegeOnEdit: boolean) => void;
};

export type VocationalState = {
  vocational: Array<EducationInfo>;
  setVocational: (vocational: Array<EducationInfo>) => void;
  vocationalOnEdit: boolean;
  setVocationalOnEdit: (vocationalOnEdit: boolean) => void;
};

export type GraduateState = {
  graduate: Array<EducationInfo>;
  setGraduate: (graduate: Array<EducationInfo>) => void;
  graduateOnEdit: boolean;
  setGraduateOnEdit: (graduateOnEdit: boolean) => void;
};

export type BasicInfoState = PersonalInfoState & GovernmentIDState & ResidentialAddressState & PermanentAddressState;
export type EducationState = ElementaryState & SecondaryState & CollegeState & VocationalState & GraduateState;
export type FamilyState = SpouseState & ParentsState & ChildrenState;
