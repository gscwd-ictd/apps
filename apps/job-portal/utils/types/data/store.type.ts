import e from 'cors'
import { Address } from './address.type'
import { PersonalInfo, GovernmentIssuedIds } from './basic-info.type'
import { EducationInfo } from './education.type'
import { Spouse, Parent, Child } from './family.type'

export type PersonalInfoState = {
  personalInfo: PersonalInfo
  setPersonalInfo: (personalInfo: PersonalInfo) => void
}

export type GovernmentIDState = {
  governmentIssuedIds: GovernmentIssuedIds
  setGovernmentIssuedIds: (GovernmentIssuedIds: GovernmentIssuedIds) => void
}

export type ResidentialAddressState = {
  residentialAddress: Address
  setResidentialAddress: (residentialAddress: Address) => void
}

export type PermanentAddressState = {
  permanentAddress: Address
  setPermanentAddress: (permanentAddress: Address) => void
}

export type SpouseState = {
  spouse: Spouse
  setSpouse: (spouse: Spouse) => void
}

export type ParentsState = {
  parents: Parent
  setParents: (parents: Parent) => void
}

export type ChildrenState = {
  children: Array<Child>
  setChildren: (children: Array<Child>) => void
}

export type ElementaryState = {
  elementary: EducationInfo
  setElementary: (elementary: EducationInfo) => void
}

export type SecondaryState = {
  secondary: EducationInfo
  setSecondary: (secondary: EducationInfo) => void
}

export type CollegeState = {
  college: Array<EducationInfo>
  setCollege: (college: Array<EducationInfo>) => void
}

export type VocationalState = {
  vocational: Array<EducationInfo>
  setVocational: (vocational: Array<EducationInfo>) => void
}

export type GraduateState = {
  graduate: Array<EducationInfo>
  setGraduate: (graduate: Array<EducationInfo>) => void
}

export type BasicInfoState = PersonalInfoState & GovernmentIDState & ResidentialAddressState & PermanentAddressState
export type EducationState = ElementaryState & SecondaryState & CollegeState & VocationalState & GraduateState
export type FamilyState = SpouseState & ParentsState & ChildrenState
