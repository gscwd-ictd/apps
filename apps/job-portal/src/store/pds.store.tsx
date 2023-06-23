import { Address } from 'apps/job-portal/utils/types/data/address.type';
import {
  PersonalInfo,
  GovernmentIssuedIds,
} from 'apps/job-portal/utils/types/data/basic-info.type';
import { EducationInfo } from 'apps/job-portal/utils/types/data/education.type';
import {
  Eligibility,
  EligibilityState,
} from 'apps/job-portal/utils/types/data/eligibility.type';
import {
  Spouse,
  Parent,
  Child,
} from 'apps/job-portal/utils/types/data/family.type';
import {
  LearningDevelopment,
  LNDState,
} from 'apps/job-portal/utils/types/data/lnd.type';
import {
  Skill,
  Recognition,
  Organization,
  OtherInfoState,
} from 'apps/job-portal/utils/types/data/other-info.type';
import {
  BasicInfoState,
  FamilyState,
  EducationState,
} from 'apps/job-portal/utils/types/data/store.type';
import {
  OfficeRelation,
  GuiltyCharged,
  Convicted,
  SeparatedService,
  CandidateResigned,
  Immigrant,
  IndigenousPwdSoloParent,
  GovernmentIssuedId,
  SupportingDetailsState,
  Reference,
} from 'apps/job-portal/utils/types/data/supporting-info.type';
import {
  VoluntaryWork,
  VolWorkState,
} from 'apps/job-portal/utils/types/data/vol-work.type';
import {
  WorkExperience,
  WorkExpState,
} from 'apps/job-portal/utils/types/data/work.type';
import { create } from 'zustand';
import {
  PERSONAL_INFO,
  GOVERNMENT_ID,
  ADDRESS,
  SPOUSE_INFO,
  PARENTS_INFO,
  ELEMENTARY,
  SECONDARY,
  GOVT_ISSUED_ID,
  OFFICE_REL,
  GUILTY_CHARGED,
  CONVICTED,
  SEP_SERV,
  CAND_RES,
  IMMIGRANT,
  IND_PWD_SOLO,
} from '../../utils/constants/pds';

export type Pds = {
  personalInfo: PersonalInfo;
  permanentAddress: Address;
  residentialAddress: Address;
  governmentIssuedIds: GovernmentIssuedIds;
  spouse: Spouse;
  parents: Parent;
  children: Array<Child>;
  elementary: EducationInfo;
  secondary: EducationInfo;
  vocational: Array<EducationInfo>;
  college: Array<EducationInfo>;
  graduate: Array<EducationInfo>;
  eligibility: Array<Eligibility>;
  workExperience: Array<WorkExperience>;
  voluntaryWork: Array<VoluntaryWork>;
  learningDevelopment: Array<LearningDevelopment>;
  skills: Array<Skill>;
  recognitions: Array<Recognition>;
  organizations: Array<Organization>;
  officeRelation: OfficeRelation;
  guiltyCharged: GuiltyCharged;
  convicted: Convicted;
  separatedService: SeparatedService;
  candidateResigned: CandidateResigned;
  immigrant: Immigrant;
  indigenousPwdSoloParent: IndigenousPwdSoloParent;
  references: Array<Reference>;
  governmentIssuedId: GovernmentIssuedId;
};

const PDS_INFO = {
  personalInfo: PERSONAL_INFO,
  governmentIssuedIds: GOVERNMENT_ID,
  residentialAddress: ADDRESS,
  permanentAddress: ADDRESS,
  spouse: SPOUSE_INFO,
  parents: PARENTS_INFO,
  children: [],
  elementary: ELEMENTARY,
  secondary: SECONDARY,
  college: [],
  graduate: [],
  vocational: [],
  eligibility: [],
  workExperience: [],
  voluntaryWork: [],
  learningDevelopment: [],
  skills: [],
  recognitions: [],
  organizations: [],
  officeRelation: OFFICE_REL,
  guiltyCharged: GUILTY_CHARGED,
  convicted: CONVICTED,
  separatedService: SEP_SERV,
  candidateResigned: CAND_RES,
  immigrant: IMMIGRANT,
  indigenousPwdSoloParent: IND_PWD_SOLO,
  references: [],
  governmentIssuedId: GOVT_ISSUED_ID,
};

export type PDSState = BasicInfoState & //* Basic Information
  FamilyState & //* Family Information
  EducationState & //* Education Information
  EligibilityState & //* Eligibility Information
  WorkExpState & //* Work Experience
  VolWorkState & //* Voluntary Work
  LNDState & //* Learning Development
  OtherInfoState & //* Other information (Skills, Organization, Recognitions)
  SupportingDetailsState & {
    //* Supporting Details
    checkboxAddress: boolean;
    setCheckboxAddress: (checkboxAddress: boolean) => void;
    checkboxAddressInitialState: boolean;
    setCheckboxAddressInitialState: (
      checkboxAddressInitialState: boolean
    ) => void;
    initialPdsState: Pds;
    setInitialPdsState: (initialPdsState: Pds) => void;
    deletedChildren: Array<Child>;
    setDeletedChildren: (deletedChildren: Array<Child>) => void;
    deletedVocationals: Array<EducationInfo>;
    setDeletedVocationals: (deletedVocationals: Array<EducationInfo>) => void;
    deletedColleges: Array<EducationInfo>;
    setDeletedColleges: (deletedColleges: Array<EducationInfo>) => void;
    deletedGraduates: Array<EducationInfo>;
    setDeletedGraduates: (deletedGraduates: Array<EducationInfo>) => void;
    deletedEligibilities: Array<Eligibility>;
    setDeletedEligibilities: (deletedEligibilities: Array<Eligibility>) => void;
    deletedWorkExperiences: Array<WorkExperience>;
    setDeletedWorkExperiences: (
      deletedWorkExperiences: Array<WorkExperience>
    ) => void;
    deletedVolWorks: Array<VoluntaryWork>;
    setDeletedVolWorks: (deletedVolWorks: Array<VoluntaryWork>) => void;
    deletedLearningDevelopments: Array<LearningDevelopment>;
    setDeletedLearningDevelopments: (
      deletedLearningDevelopments: Array<LearningDevelopment>
    ) => void;
    deletedSkills: Array<Skill>;
    setDeletedSkills: (deletedSkills: Array<Skill>) => void;
    deletedOrganizations: Array<Organization>;
    setDeletedOrganizations: (
      deletedOrganizations: Array<Organization>
    ) => void;
    deletedRecognitions: Array<Recognition>;
    setDeletedRecognitions: (deletedRecognitions: Array<Recognition>) => void;
    deletedReferences: Array<Reference>;
    setDeletedReferences: (deletedReferences: Array<Reference>) => void;
  };

// & PdsState
// & {
//     pds: object
// }
// & EmployeeState //! Removed Temporarily

export const usePdsStore = create<PDSState>((set) => ({
  personalInfo: PERSONAL_INFO,
  personalInfoOnEdit: false,
  governmentIssuedIds: GOVERNMENT_ID,
  governmentIssuedIdsOnEdit: false,
  residentialAddress: ADDRESS,
  residentialAddressOnEdit: false,
  permanentAddress: ADDRESS,
  permanentAddressOnEdit: false,
  spouse: SPOUSE_INFO,
  parents: PARENTS_INFO,
  children: [],
  elementary: ELEMENTARY,
  secondary: SECONDARY,
  college: [],
  graduate: [],
  vocational: [],
  eligibility: [],
  workExperience: [],
  voluntaryWork: [],
  learningDevelopment: [],
  skills: [],
  recognitions: [],
  organizations: [],
  checkboxAddressInitialState: false,
  officeRelation: OFFICE_REL,
  guiltyCharged: GUILTY_CHARGED,
  convicted: CONVICTED,
  separatedService: SEP_SERV,
  candidateResigned: CAND_RES,
  immigrant: IMMIGRANT,
  indigenousPwdSoloParent: IND_PWD_SOLO,
  references: [],
  governmentIssuedId: GOVT_ISSUED_ID,
  initialPdsState: {} as Pds,
  checkboxAddress: false,
  spouseOnEdit: false,
  motherOnEdit: false,
  fatherOnEdit: false,
  childrenOnEdit: true,
  elementaryOnEdit: false,
  secondaryOnEdit: false,
  vocationalOnEdit: false,
  collegeOnEdit: false,
  graduateOnEdit: false,
  eligibilityOnEdit: false,
  workExperienceOnEdit: false,
  voluntaryWorkOnEdit: false,
  learningDevelopmentOnEdit: false,
  skillsOnEdit: false,
  organizationsOnEdit: false,
  recognitionsOnEdit: false,
  referencesOnEdit: false,
  governmentIssuedIdOnEdit: false,
  deletedChildren: [],
  deletedVocationals: [],
  deletedColleges: [],
  deletedGraduates: [],
  deletedEligibilities: [],
  deletedWorkExperiences: [],
  deletedVolWorks: [],
  deletedLearningDevelopments: [],
  deletedSkills: [],
  deletedOrganizations: [],
  deletedRecognitions: [],
  deletedReferences: [],
  setPersonalInfo: (personalInfo: PersonalInfo) => {
    set((state) => ({ ...state, personalInfo }));
  },
  setPersonalInfoOnEdit: (personalInfoOnEdit: boolean) => {
    set((state) => ({ ...state, personalInfoOnEdit }));
  },
  setGovernmentIssuedIds: (governmentIssuedIds: GovernmentIssuedIds) => {
    set((state) => ({ ...state, governmentIssuedIds }));
  },
  setGovernmentIssuedIdsOnEdit: (governmentIssuedIdsOnEdit: boolean) => {
    set((state) => ({ ...state, governmentIssuedIdsOnEdit }));
  },
  setResidentialAddress: (residentialAddress: Address) => {
    set((state) => ({ ...state, residentialAddress }));
  },
  setResidentialAddressOnEdit: (residentialAddressOnEdit: boolean) => {
    set((state) => ({ ...state, residentialAddressOnEdit }));
  },
  setPermanentAddress: (permanentAddress: Address) => {
    set((state) => ({ ...state, permanentAddress }));
  },
  setPermanentAddressOnEdit: (permanentAddressOnEdit: boolean) => {
    set((state) => ({ ...state, permanentAddressOnEdit }));
  },
  setSpouse: (spouse: Spouse) => {
    set((state) => ({ ...state, spouse }));
  },
  setChildren: (children: Array<Child>) => {
    set((state) => ({ ...state, children }));
  },
  setParents: (parents: Parent) => {
    set((state) => ({ ...state, parents }));
  },
  setElementary: (elementary: EducationInfo) => {
    set((state) => ({ ...state, elementary }));
  },
  setSecondary: (secondary: EducationInfo) => {
    set((state) => ({ ...state, secondary }));
  },
  setCollege: (college: Array<EducationInfo>) => {
    set((state) => ({ ...state, college }));
  },
  setGraduate: (graduate: Array<EducationInfo>) => {
    set((state) => ({ ...state, graduate }));
  },
  setVocational: (vocational: Array<EducationInfo>) => {
    set((state) => ({ ...state, vocational }));
  },
  setEligibility: (eligibility: Array<Eligibility>) => {
    set((state) => ({ ...state, eligibility }));
  },
  setWorkExperience: (workExperience: Array<WorkExperience>) => {
    set((state) => ({ ...state, workExperience }));
  },
  setVoluntaryWork: (voluntaryWork: Array<VoluntaryWork>) => {
    set((state) => ({ ...state, voluntaryWork }));
  },
  setLearningDevelopment: (learningDevelopment: Array<LearningDevelopment>) => {
    set((state) => ({ ...state, learningDevelopment }));
  },
  setSkills: (skills: Array<Skill>) => {
    set((state) => ({ ...state, skills }));
  },
  setRecognitions: (recognitions: Array<Recognition>) => {
    set((state) => ({ ...state, recognitions }));
  },
  setOrganizations: (organizations: Array<Organization>) => {
    set((state) => ({ ...state, organizations }));
  },
  setOfficeRelation: (officeRelation: OfficeRelation) => {
    set((state) => ({ ...state, officeRelation }));
  },
  setGuiltyCharged: (guiltyCharged: GuiltyCharged) => {
    set((state) => ({ ...state, guiltyCharged }));
  },
  setConvicted: (convicted: Convicted) => {
    set((state) => ({ ...state, convicted }));
  },
  setSeparatedService: (separatedService: SeparatedService) => {
    set((state) => ({ ...state, separatedService }));
  },
  setCandidateResigned: (candidateResigned: CandidateResigned) => {
    set((state) => ({ ...state, candidateResigned }));
  },
  setImmigrant: (immigrant: Immigrant) => {
    set((state) => ({ ...state, immigrant }));
  },
  setIndigenousPwdSoloParent: (
    indigenousPwdSoloParent: IndigenousPwdSoloParent
  ) => {
    set((state) => ({ ...state, indigenousPwdSoloParent }));
  },
  setReferences: (references: Array<Reference>) => {
    set((state) => ({ ...state, references }));
  },
  setGovernmentIssuedId: (governmentIssuedId: GovernmentIssuedId) => {
    set((state) => ({ ...state, governmentIssuedId }));
  },
  setCheckboxAddress: (checkboxAddress: boolean) => {
    set((state) => ({ ...state, checkboxAddress }));
  },
  setInitialPdsState: (initialPdsState: Pds) => {
    set((state) => ({ ...state, initialPdsState }));
  },
  setCheckboxAddressInitialState: (checkboxAddressInitialState: boolean) => {
    set((state) => ({ ...state, checkboxAddressInitialState }));
  },
  setSpouseOnEdit: (spouseOnEdit: boolean) => {
    set((state) => ({ ...state, spouseOnEdit }));
  },
  setMotherOnEdit: (motherOnEdit: boolean) => {
    set((state) => ({ ...state, motherOnEdit }));
  },
  setFatherOnEdit: (fatherOnEdit: boolean) => {
    set((state) => ({ ...state, fatherOnEdit }));
  },
  setChildrenOnEdit: (childrenOnEdit: boolean) => {
    set((state) => ({ ...state, childrenOnEdit }));
  },
  setElementaryOnEdit: (elementaryOnEdit: boolean) => {
    set((state) => ({ ...state, elementaryOnEdit }));
  },
  setSecondaryOnEdit: (secondaryOnEdit: boolean) => {
    set((state) => ({ ...state, secondaryOnEdit }));
  },
  setVocationalOnEdit: (vocationalOnEdit: boolean) => {
    set((state) => ({ ...state, vocationalOnEdit }));
  },
  setCollegeOnEdit: (collegeOnEdit: boolean) => {
    set((state) => ({ ...state, collegeOnEdit }));
  },
  setGraduateOnEdit: (graduateOnEdit: boolean) => {
    set((state) => ({ ...state, graduateOnEdit }));
  },
  setEligibilityOnEdit: (eligibilityOnEdit: boolean) => {
    set((state) => ({ ...state, eligibilityOnEdit }));
  },
  setWorkExperienceOnEdit: (workExperienceOnEdit: boolean) => {
    set((state) => ({ ...state, workExperienceOnEdit }));
  },
  setVoluntaryWorkOnEdit: (voluntaryWorkOnEdit: boolean) => {
    set((state) => ({ ...state, voluntaryWorkOnEdit }));
  },
  setLearningDevelopmentOnEdit: (learningDevelopmentOnEdit: boolean) => {
    set((state) => ({ ...state, learningDevelopmentOnEdit }));
  },
  setSkillsOnEdit: (skillsOnEdit: boolean) => {
    set((state) => ({ ...state, skillsOnEdit }));
  },
  setOrganizationsOnEdit: (organizationsOnEdit: boolean) => {
    set((state) => ({ ...state, organizationsOnEdit }));
  },
  setRecognitionsOnEdit: (recognitionsOnEdit: boolean) => {
    set((state) => ({ ...state, recognitionsOnEdit }));
  },
  setGovernmentIssuedIdOnEdit: (governmentIssuedIdOnEdit: boolean) => {
    set((state) => ({ ...state, governmentIssuedIdOnEdit }));
  },
  setReferencesOnEdit: (referencesOnEdit: boolean) => {
    set((state) => ({ ...state, referencesOnEdit }));
  },
  setDeletedChildren: (deletedChildren: Array<Child>) => {
    set((state) => ({ ...state, deletedChildren }));
  },
  setDeletedVocationals: (deletedVocationals: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedVocationals }));
  },
  setDeletedColleges: (deletedColleges: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedColleges }));
  },
  setDeletedGraduates: (deletedGraduates: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedGraduates }));
  },
  setDeletedEligibilities: (deletedEligibilities: Array<Eligibility>) => {
    set((state) => ({ ...state, deletedEligibilities }));
  },
  setDeletedWorkExperiences: (
    deletedWorkExperiences: Array<WorkExperience>
  ) => {
    set((state) => ({ ...state, deletedWorkExperiences }));
  },
  setDeletedVolWorks: (deletedVolWorks: Array<VoluntaryWork>) => {
    set((state) => ({ ...state, deletedVolWorks }));
  },
  setDeletedLearningDevelopments: (
    deletedLearningDevelopments: Array<LearningDevelopment>
  ) => {
    set((state) => ({ ...state, deletedLearningDevelopments }));
  },
  setDeletedSkills: (deletedSkills: Array<Skill>) => {
    set((state) => ({ ...state, deletedSkills }));
  },
  setDeletedOrganizations: (deletedOrganizations: Array<Organization>) => {
    set((state) => ({ ...state, deletedOrganizations }));
  },
  setDeletedRecognitions: (deletedRecognitions: Array<Recognition>) => {
    set((state) => ({ ...state, deletedRecognitions }));
  },
  setDeletedReferences: (deletedReferences: Array<Reference>) => {
    set((state) => ({ ...state, deletedReferences }));
  },
}));
