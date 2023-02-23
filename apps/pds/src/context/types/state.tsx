import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import EducationInfo from '../../schema/EducationInfo'
import Eligibility from '../../schema/Eligibility'
import Organizations from '../../schema/Organizations'
import Recognitions from '../../schema/Recognitions'
import Skills from '../../schema/Skills'
import { Address } from '../../types/data/address.type'
import { PersonalInfo, GovernmentIssuedIds, BasicInfo } from '../../types/data/basic-info.type'
import { Child, Parent, Spouse } from '../../types/data/family.type'
import { LearningDevelopment } from '../../types/data/lnd.type'
import { OfficeRelation, GuiltyCharged, Convicted, SeparatedService, CandidateResigned, Immigrant, IndigenousPwdSoloParent, GovernmentIssuedId } from '../../types/data/supporting-info.type'
import { VoluntaryWork } from '../../types/data/vol-work.type'
import { WorkExperience } from '../../types/data/work.type'
import {


  WorkExpSheet,
} from './types'

// export type TabsState = {
//   tab: number
//   setTab: Dispatch<SetStateAction<number>>
//   personalInfo: CompleteName
//   setPersonalInfo: Dispatch<SetStateAction<CompleteName>>
// }


export type Employee = {
  employeeId: string
  lastName: string
  middleName: string
  firstName: string
  fullName: string
  email: string
  nameExt: string
  assignment: string
  companyId?: string
  positionTitle: string
}

// export type EmployeeData = {
//   employmentDetails: EmploymentDetails
//   personalDetails: PersonalDetails
// }

// export type Assignment = {
//   id: string
//   name: string
// }

// export type EmploymentDetails = {
//   assignment: Assignment
//   companyId: string
//   employeeId: string
//   positionTitle: string
// }

// export type PersonalDetails = {
//   firstName: string
//   fullName: string
//   lastName: string
//   middleName: string
//   nameExt: string
//   birthDate: string
//   sex: string
// }

// export type PersonalInfoState = {
//   personalInfo: PersonalInfo
//   setPersonalInfo: Dispatch<SetStateAction<PersonalInfo>>
//   employee: EmployeeData
// }

// export type GovernmentIDState = {
//   governmentIssuedIds: GovernmentIssuedIds
//   setGovernmentIssuedIds: Dispatch<SetStateAction<GovernmentIssuedIds>>
//   employee: EmployeeData
// }

// export type ResidentialAddressState = {
//   residentialAddress: Address
//   setResidentialAddress: Dispatch<SetStateAction<Address>>
//   employee: EmployeeData
// }

// export type PermanentAddressState = {
//   permanentAddress: Address
//   setPermanentAddress: Dispatch<SetStateAction<Address>>
//   employee: EmployeeData
// }

// export type SpouseState = {
//   spouse: Spouse
//   setSpouse: Dispatch<SetStateAction<Spouse>>
//   employee: EmployeeData
// }

// export type ParentsState = {
//   parents: Parent
//   setParents: Dispatch<SetStateAction<Parent>>
//   employee: EmployeeData
// }

// export type OffspringState = {
//   offspring: Array<Child>
//   setOffspring: Dispatch<SetStateAction<Array<Child>>>
//   employee: EmployeeData
// }

// export type ElementaryState = {
//   elementary: EducationInfo
//   setElementary: Dispatch<SetStateAction<EducationInfo>>
//   employee: EmployeeData
// }

// export type SecondaryState = {
//   secondary: EducationInfo
//   setSecondary: Dispatch<SetStateAction<EducationInfo>>
//   employee: EmployeeData
// }

// export type CollegeState = {
//   college: Array<EducationInfo>
//   setCollege: Dispatch<SetStateAction<Array<EducationInfo>>>
//   employee: EmployeeData
// }

// export type VocationalState = {
//   vocational: Array<EducationInfo>
//   setVocational: Dispatch<SetStateAction<Array<EducationInfo>>>
//   employee: EmployeeData
// }

// export type GraduateState = {
//   graduate: Array<EducationInfo>
//   setGraduate: Dispatch<SetStateAction<Array<EducationInfo>>>
//   employee: EmployeeData
// }

// export type EligibilityState = {
//   eligibility: Array<Eligibility>
//   setEligibility: Dispatch<SetStateAction<Array<Eligibility>>>
//   employee: EmployeeData
// }

// export type WorkExpState = {
//   workExperience: Array<WorkExperience>
//   setWorkExperience: Dispatch<SetStateAction<Array<WorkExperience>>>
//   employee: EmployeeData
// }

export type WorkExpSheetState = {
  workExpList: Array<WorkExperience>
  setWorkExpList: Dispatch<SetStateAction<Array<WorkExperience>>>
  workExpSheet: Array<WorkExpSheet>
  setWorkExpSheet: Dispatch<SetStateAction<Array<WorkExpSheet>>>
}

// export type VolWorkState = {
//   voluntaryWork: Array<VoluntaryWork>
//   setVoluntaryWork: Dispatch<SetStateAction<Array<VoluntaryWork>>>
//   employee: EmployeeData
// }

// export type LNDState = {
//   learningDevelopment: Array<LearningDevelopment>
//   setLearningDevelopment: Dispatch<SetStateAction<Array<LearningDevelopment>>>
//   employee: EmployeeData
// }

// export type RecogsState = {
//   recognitions: Array<Recognitions>
//   setRecognitions: Dispatch<SetStateAction<Array<Recognitions>>>
//   employee: EmployeeData
// }

// export type SkillsState = {
//   skills: Array<Skills>
//   setSkills: Dispatch<SetStateAction<Array<Skills>>>
//   employee: EmployeeData
// }

// export type OrgsState = {
//   organizations: Array<Organizations>
//   setOrganizations: Dispatch<SetStateAction<Array<Organizations>>>
//   employee: EmployeeData
// }

// export type SupportingDetailsState = {
//   supportingDetails: Array<SupportingDetails>
//   setSupportingDetails: Dispatch<SetStateAction<Array<SupportingDetails>>>
// }

// export type ReferencesState = {
//   references: Array<References>
//   setReferences: Dispatch<SetStateAction<Array<References>>>
//   employee: EmployeeData
// }

// export type GovtIDState = {
//   governmentIssuedId: GovernmentIssuedId
//   setGovernmentIssuedId: Dispatch<SetStateAction<GovernmentIssuedId>>
//   employee: EmployeeData
// }

// export type QuestionsState = {
//   supportingDetails?: SupportingDetails
//   officeRelation: OfficeRelation
//   guiltyCharged: GuiltyCharged
//   convicted: Convicted
//   separatedService: SeparatedService
//   candidateResigned: CandidateResigned
//   immigrant: Immigrant
//   indigenousPwdSoloParent: IndigenousPwdSoloParent
//   setOfficeRelation: Dispatch<SetStateAction<OfficeRelation>>
//   setGuiltyCharged: Dispatch<SetStateAction<GuiltyCharged>>
//   setConvicted: Dispatch<SetStateAction<Convicted>>
//   setSeparatedService: Dispatch<SetStateAction<SeparatedService>>
//   setCandidateResigned: Dispatch<SetStateAction<CandidateResigned>>
//   setImmigrant: Dispatch<SetStateAction<Immigrant>>
//   setIndigenousPwdSoloParent: Dispatch<SetStateAction<IndigenousPwdSoloParent>>
//   employee: EmployeeData
// }

export type PDSFormInputs = {
  lastName: string
  firstName: string
  middleName: string
  nameExtension: string
  birthDate: string
  sex: string
  birthPlace: string
  civilStatus: string
  height: number
  weight: number
  bloodType: string
  citizenship: string
  citizenshipType: string
  country: string
  telephoneNumber: string
  mobileNumber: string
  email: string
  gsisNumber: string
  pagibigNumber: string
  philhealthNumber: string
  sssNumber: string
  tinNumber: string
  agencyNumber: string
  resHouseNumber: string
  resZipCode: string
  elemSchoolName: string
  elemDegree: string
  elemFrom: number
  elemTo: number
  elemUnits: string
  elemYearGraduated: number
  elemAwards: string
  secSchoolName: string
  secDegree: string
  secFrom: number
  secTo: number
  secUnits: string
  secYearGraduated: number
  secAwards: string
  // references: Array<References>
  govtId: string
  govtIdNo: string
  issueDate: string
  issuePlace: string
}

export type TabState = {
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
  handlePrevTab: Function
  handleNextTab: Function
  // nodeRef: MutableRefObject<any>
}

export type ErrorState = {
  resAddrError: boolean
  setResAddrError: Dispatch<SetStateAction<boolean>>
  permaAddrError: boolean
  setPermaAddrError: Dispatch<SetStateAction<boolean>>
  resAddrRef: MutableRefObject<any>
  permaAddrRef: MutableRefObject<any>
  shake: boolean
  setShake: Dispatch<SetStateAction<boolean>>
}


export type RefErrorState = {
  refError: boolean
  setRefError: Dispatch<SetStateAction<boolean>>
}
