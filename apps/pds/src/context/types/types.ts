// export type BasicInfoType = {
//   lastName: string
//   firstName: string
//   middleName: string
//   nameExtension: string
//   birthDate: string
//   sex: string
//   birthPlace: string
//   civilStatus: string
//   height: number
//   weight: number
//   bloodType: string
//   citizenship: string
//   citizenshipType: string
//   country: string
//   telephoneNumber: string
//   mobileNumber: string
//   email: string
//   gsisNumber: string
//   pagibigNumber: string
//   philhealthNumber: string
//   sssNumber: string
//   tinNumber: string
//   agencyNumber: string
//   permaHouseNumber: string | void | undefined
//   permaStreet: string | void | undefined
//   permaSubd: string | void | undefined
//   permaProv: string | void | undefined
//   permaProvCode: string | void | undefined
//   permaCity: string | void | undefined
//   permaCityCode: string | void | undefined
//   permaBrgy: string | void | undefined
//   permaBrgyCode: string | void | undefined
//   permaZipCode: string | void | undefined
//   resHouseNumber: string | void | undefined
//   resStreet: string | void | undefined
//   resSubd: string | void | undefined
//   resProv: string | void | undefined
//   resProvCode: string | void | undefined
//   resCity: string | void | undefined
//   resCityCode: string | void | undefined
//   resBrgy: string | void | undefined
//   resBrgyCode: string | void | undefined
//   resZipCode: string | void | undefined
//   checkboxSameAddr: boolean
// }

import { Address } from '../../types/data/address.type';
import { GovernmentIssuedIds, PersonalInfo } from '../../types/data/basic-info.type';
import { Spouse, Parent, Child } from '../../types/data/family.type';

// export type AddressType = {
//   permaHouseNumber: string | void | undefined
//   permaStreet: string | void | undefined
//   permaSubd: string | void | undefined
//   permaProv: string | void | undefined
//   permaProvCode: string | void | undefined
//   permaCity: string | void | undefined
//   permaCityCode: string | void | undefined
//   permaBrgy: string | void | undefined
//   permaBrgyCode: string | void | undefined
//   permaZipCode: string | void | undefined
//   resHouseNumber: string | void | undefined
//   resStreet: string | void | undefined
//   resSubd: string | void | undefined
//   resProv: string | void | undefined
//   resProvCode: string | void | undefined
//   resCity: string | void | undefined
//   resCityCode: string | void | undefined
//   resBrgy: string | void | undefined
//   resBrgyCode: string | void | undefined
//   resZipCode: string | void | undefined
// }

// //Personal Info
// export type PersonalInfo = {
//   email: string
//   firstName: string
//   middleName: string
//   lastName: string
//   nameExtension: string
//   birthDate: string
//   birthPlace: string
//   sex: string
//   civilStatus: string
//   height: number
//   weight: number
//   bloodType: string
//   mobileNumber: string
//   telephoneNumber: string
//   citizenship: string
//   citizenshipType: string
//   country: string
//   employeeId?: string
// }

// //Government ID
// export type GovernmentIssuedIds = {
//   gsisNumber: string
//   pagibigNumber: string
//   philhealthNumber: string
//   sssNumber: string
//   tinNumber: string
//   agencyNumber: string
//   employeeId?: string
// }

// export type CheckboxAddress = {
//   checkboxAddress: boolean
// }

// //Address
// export type Address = {
//   houseNumber: string
//   street: string
//   subdivision: string
//   barangay: string
//   city: string
//   province: string
//   zipCode: string
//   cityCode?: string
//   provCode?: string
//   brgyCode?: string
//   employeeId?: string
// }

// export type ResAddressForm = {
//   resHouseNumber: string
//   resStreet: string
//   resSubdivision: string
//   resZipCode: string
//   resProvince: string
//   resProvCode: string
//   resCity: string
//   resCityCode: string
//   resBrgy: string
//   resBrgyCode: string
// }

// export type PermaAddressForm = {
//   permaHouseNumber: string
//   permaStreet: string
//   permaSubdivision: string
//   permaZipCode: string
//   permaProvince: string
//   permaProvCode: string
//   permaCity: string
//   permaCityCode: string
//   permaBrgy: string
//   permaBrgyCode: string
// }

// export type AddressForm = {
//   resHouseNumber: string
//   resStreet: string
//   resSubdivision: string
//   resProvince: string
//   resProvCode: string
//   resCity: string
//   resCityCode: string
//   resBrgy: string
//   resBrgyCode: string
//   resZipCode: string
//   permaHouseNumber: string
//   permaStreet: string
//   permaSubdivision: string
//   permaZipCode: string
//   permaProvince: string
//   permaProvCode: string
//   permaCity: string
//   permaCityCode: string
//   permaBrgy: string
//   permaBrgyCode: string
//   checkboxAddress: boolean
// }

// //Spouse
// export type Spouse = {
//   firstName: string
//   middleName: string
//   lastName: string
//   employer: string
//   telephoneNumber: string
//   nameExtension?: string
//   businessAddress: string
//   occupation: string
//   employeeId?: string
// }

// export type SpouseForm = {
//   spouseLName: string
//   spouseFName: string
//   spouseMName: string
//   spouseNameExt?: string
//   spouseEmpBusName: string
//   spouseBusAddr: string
//   spouseTelNo: string
//   spouseOccupation: string
// }

// export type ParentForm = {
//   fatherFName: string
//   fatherMName: string
//   fatherLName: string
//   fatherNameExt: string
//   motherLName: string
//   motherFName: string
//   motherMName: string
// }

// //Parent
// export type Parent = {
//   fatherFirstName: string
//   fatherMiddleName: string
//   fatherLastName: string
//   fatherNameExtension: string
//   motherFirstName: string
//   motherMiddleName: string
//   motherLastName: string
//   // motherMaidenName: string
//   employeeId?: string
// }

// //Child
// export type Child = {
//   childName: string
//   birthDate: string
//   employeeId?: string
// }

// export type EducationInfo = {
//   schoolName: string | null
//   degree: string | null
//   from: number | null
//   to: number | null
//   units: string
//   yearGraduated: number | null
//   awards: string | null
//   employeeId?: string | null
//   isOngoing?: boolean
//   isGraduated?: boolean
// }

// export type Eligibility = {
//   name: string
//   rating: string
//   // examDate: string | undefined
//   examDateFrom?: string
//   examDateTo?: string
//   examPlace: string
//   licenseNumber: string
//   validity: Date | null
//   employeeId?: string
//   isOneDayOfExam?: boolean
// }

// export type WorkExperience = {
//   positionTitle: string
//   companyName: string
//   monthlySalary: number | null
//   appointmentStatus: string
//   isGovernmentService: boolean
//   salaryGrade: string | null
//   from: string
//   to: string
//   isSelected?: boolean
//   employeeId?: string
//   isPresentWork?: boolean
// }

export type WorkExpSheet = {
  dateFrom: string;
  dateTo: string;
  positionTitle: string;
  officeName: string;
  immediateSupervisor: string;
  orgNameLocation: string;
  accomplishments: string;
  actualDuties: string;
  employeeId?: string;
};

// export type VoluntaryWork = {
//   organizationName: string
//   position: string
//   from: string
//   to: string
//   numberOfHours: number | null
//   employeeId?: string
//   isCurrentlyVol?: boolean
// }

// export type LearningDevelopment = {
//   title: string
//   conductedBy: string
//   type: string
//   from: string
//   to: string
//   numberOfHours: number | null
//   employeeId?: string
// }

// export type Skills = {
//   skill: string
//   employeeId?: string
// }

// export type Recognitions = {
//   recognition: string
//   employeeId?: string
// }

// export type Organizations = {
//   organization: string
//   employeeId?: string
// }

// export type SupportingDetails = {
//   officeRelation: OfficeRelation
//   guiltyCharged: GuiltyCharged
//   convicted: Convicted
//   separatedService: SeparatedService
//   candidateResigned: CandidateResigned
//   immigrant: Immigrant
//   indigenousPwdSoloParent: IndigenousPwdSoloParent
//   employeeId?: string
// }

// export type OfficeRelation = {
//   withinThirdDegree: boolean
//   withinFourthDegree: boolean
//   details: string | null
//   employeeId?: string
// }

// export type GuiltyCharged = {
//   isGuilty: boolean
//   guiltyDetails: string | null
//   isCharged: boolean
//   chargedDateFiled: string | null
//   chargedCaseStatus: string | null
//   employeeId?: string
// }

// export type Convicted = {
//   isConvicted: boolean
//   details: string
//   employeeId?: string
// }

// export type SeparatedService = {
//   isSeparated: boolean
//   details: string
//   employeeId?: string
// }

// export type CandidateResigned = {
//   isCandidate: boolean
//   candidateDetails: string
//   isResigned: boolean
//   resignedDetails: string
//   employeeId?: string
// }

// export type Immigrant = {
//   isImmigrant: boolean
//   details: string
//   employeeId?: string
// }

// export type IndigenousPwdSoloParent = {
//   isIndigenousMember: boolean
//   indigenousMemberDetails: string
//   isPwd: boolean
//   pwdIdNumber: string
//   isSoloParent: boolean
//   soloParentIdNumber: string
//   employeeId?: string
// }

// export type References = {
//   name: string
//   address: string
//   telephoneNumber: string
//   employeeId?: string
// }

// export type GovernmentIssuedId = {
//   issuedId: string
//   idNumber: string
//   issueDate: string
//   issuePlace: string
//   employeeId?: string
// }

// export type SupportingDetailsForm = {
//   offRelThird: number
//   offRelFourth: number
//   offRelDetails: string | null
//   isGuilty: number
//   guiltyDetails: string | null
//   isCharged: number
//   chargedDateFiled: string | null
//   chargedCaseStatus: string | null
//   isConvicted: number
//   convictedDetails: string
//   isSeparated: number
//   separatedDetails: string
//   isCandidate: number
//   candidateDetails: string
//   isResigned: number
//   resignedDetails: string
//   isImmigrant: number
//   immigrantDetails: string
//   isIndigenousMember: number
//   indigenousMemberDetails: string
//   isPwd: number
//   pwdIdNumber: string
//   isSoloParent: number
//   soloParentIdNumber: string
// }

// export type BasicInfo = {
//   personalInfo: PersonalInfo
//   address: {
//     residentialAddress: Address
//     permanentAddress: Address
//   }
//   governmentIssuedIds: GovernmentIssuedIds
// }

// export type Family = {
//   spouse: Spouse
//   parents: Parent
//   children: Array<Child>
// }

// export type Education = {
//   elementary: EducationInfo
//   secondary: EducationInfo
//   vocational: Array<EducationInfo>
//   college: Array<EducationInfo>
//   graduate: Array<EducationInfo>
// }

// export type OtherInfo = {
//   skills: Array<Skills>
//   recognitions: Array<Recognitions>
//   organizations: Array<Organizations>
//   officeRelation: OfficeRelation
//   guiltyCharged: GuiltyCharged
//   convicted: Convicted
//   separatedService: SeparatedService
//   candidateResigned: CandidateResigned
//   immigrant: Immigrant
//   indigenousPwdSoloParent: IndigenousPwdSoloParent
//   references: Array<References>
//   governmentIssuedId: GovernmentIssuedId
// }

// export type PDSInfo = {
//   basicInfo: BasicInfo
//   family: Family
//   education: Education
//   eligibility: Array<Eligibility>
//   workExperience: Array<WorkExperience>
//   voluntaryWork: Array<VoluntaryWork>
//   learningDevelopment: Array<LearningDevelopment>
//   otherInfo: OtherInfo
// }

// export type PDS = {
//   personalInfo: PersonalInfo
//   permanentAddress: Address
//   residentialAddress: Address
//   governmentIssuedIds: GovernmentIssuedIds
//   spouse: Spouse
//   parents: Parent
//   children: Array<Child>
//   elementary: EducationInfo
//   secondary: EducationInfo
//   vocational: Array<EducationInfo>
//   college: Array<EducationInfo>
//   graduate: Array<EducationInfo>
//   eligibility: Array<Eligibility>
//   workExperience: Array<WorkExperience>
//   voluntaryWork: Array<VoluntaryWork>
//   learningDevelopment: Array<LearningDevelopment>
//   skills: Array<Skills>
//   recognitions: Array<Recognitions>
//   organizations: Array<Organizations>
//   officeRelation: OfficeRelation
//   guiltyCharged: GuiltyCharged
//   convicted: Convicted
//   separatedService: SeparatedService
//   candidateResigned: CandidateResigned
//   immigrant: Immigrant
//   indigenousPwdSoloParent: IndigenousPwdSoloParent
//   references: Array<References>
//   governmentIssuedId: GovernmentIssuedId
// }
