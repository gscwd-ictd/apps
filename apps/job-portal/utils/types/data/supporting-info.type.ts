export type SupportingDetails = {
  officeRelation: OfficeRelation
  guiltyCharged: GuiltyCharged
  convicted: Convicted
  separatedService: SeparatedService
  candidateResigned: CandidateResigned
  immigrant: Immigrant
  indigenousPwdSoloParent: IndigenousPwdSoloParent
  employeeId?: string
}

export type QuestionsState = {
  //   supportingDetails?: SupportingDetails
  officeRelation: OfficeRelation
  guiltyCharged: GuiltyCharged
  convicted: Convicted
  separatedService: SeparatedService
  candidateResigned: CandidateResigned
  immigrant: Immigrant
  indigenousPwdSoloParent: IndigenousPwdSoloParent
  setOfficeRelation: (officeRelation: OfficeRelation) => void
  setGuiltyCharged: (guiltyCharged: GuiltyCharged) => void
  setConvicted: (convicted: Convicted) => void
  setSeparatedService: (separatedService: SeparatedService) => void
  setCandidateResigned: (candidateResigned: CandidateResigned) => void
  setImmigrant: (immigrant: Immigrant) => void
  setIndigenousPwdSoloParent: (indigenousPwdSoloParent: IndigenousPwdSoloParent) => void
}

export type OfficeRelation = {
  withinThirdDegree: boolean
  withinFourthDegree: boolean
  details: string | null
  employeeId?: string
}

export type GuiltyCharged = {
  isGuilty: boolean
  guiltyDetails: string | null
  isCharged: boolean
  chargedDateFiled: string | null
  chargedCaseStatus: string | null
  employeeId?: string
}

export type Convicted = {
  isConvicted: boolean
  details: string
  employeeId?: string
}

export type SeparatedService = {
  isSeparated: boolean
  details: string
  employeeId?: string
}

export type CandidateResigned = {
  isCandidate: boolean
  candidateDetails: string
  isResigned: boolean
  resignedDetails: string
  employeeId?: string
}

export type Immigrant = {
  isImmigrant: boolean
  details: string
  employeeId?: string
}

export type IndigenousPwdSoloParent = {
  isIndigenousMember: boolean
  indigenousMemberDetails: string
  isPwd: boolean
  pwdIdNumber: string
  isSoloParent: boolean
  soloParentIdNumber: string
  employeeId?: string
}

export type Reference = {
  _id?: string
  name: string
  address: string
  telephoneNumber: string
  employeeId?: string
}

export type GovernmentIssuedId = {
  issuedId: string
  idNumber: string
  issueDate: string
  issuePlace: string
  employeeId?: string
}

export type ReferencesState = {
  references: Array<Reference>
  setReferences: (references: Array<Reference>) => void
  referencesOnEdit: boolean
  setReferencesOnEdit: (referencesOnEdit: boolean) => void
}

export type GovtIDState = {
  governmentIssuedId: GovernmentIssuedId
  setGovernmentIssuedId: (governmentIssuedID: GovernmentIssuedId) => void
  governmentIssuedIdOnEdit: boolean
  setGovernmentIssuedIdOnEdit: (governmentIssuedIdOnEdit: boolean) => void
}

export type GovtIssuedIdForm = {
  govtId: string
  govtIdNo: string
  issueDate: string
  issuePlace: string
}

export type SupportingDetailsForm = {
  offRelThird: number
  offRelFourth: number
  offRelDetails: string | null
  isGuilty: number
  guiltyDetails: string | null
  isCharged: number
  chargedDateFiled: string | null
  chargedCaseStatus: string | null
  isConvicted: number
  convictedDetails: string
  isSeparated: number
  separatedDetails: string
  isCandidate: number
  candidateDetails: string
  isResigned: number
  resignedDetails: string
  isImmigrant: number
  immigrantDetails: string
  isIndigenousMember: number
  indigenousMemberDetails: string
  isPwd: number
  pwdIdNumber: string
  isSoloParent: number
  soloParentIdNumber: string
}

export type SupportingDetailsState = QuestionsState & ReferencesState & GovtIDState
