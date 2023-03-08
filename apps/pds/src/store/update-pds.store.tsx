import { create } from 'zustand';
import { EducationInfo } from '../types/data/education.type';
import { Eligibility } from '../types/data/eligibility.type';
import { Child } from '../types/data/family.type';
import { LearningDevelopment } from '../types/data/lnd.type';
import {
  Skill,
  Recognition,
  Organization,
} from '../types/data/other-info.type';
import { Reference } from '../types/data/supporting-info.type';
import { VoluntaryWork } from '../types/data/vol-work.type';
import { WorkExperience } from '../types/data/work.type';

export type UpdatePdsState = {
  allowPersonalInfoSave: boolean;
  setAllowPersonalInfoSave: (allowPersonalInfoSave: boolean) => void;
  allowGovernmentIssuedIdSave: boolean;
  setAllowGovernmentIssuedIdSave: (
    allowGovernmentIssuedIdSave: boolean
  ) => void;
  allowResidentialAddressSave: boolean;
  setAllowResidentialAddressSave: (
    allowResidentialAddressSave: boolean
  ) => void;
  allowPermanentAddressSave: boolean;
  setAllowPermanentAddressSave: (allowPermanentAddressSave: boolean) => void;
  allowElementarySave: boolean;
  setAllowElementarySave: (allowElementarySave: boolean) => void;
  allowSecondarySave: boolean;
  setAllowSecondarySave: (allowSecondarySave: boolean) => void;
  allowGovernmentIdsSave: boolean;
  setAllowGovernmentIdsSave: (allowGovernmentIdsSave: boolean) => void;
  allowSpouseSave: boolean;
  setAllowSpouseSave: (allowSpouseSave: boolean) => void;
  allowFatherSave: boolean;
  setAllowFatherSave: (allowFatherSave: boolean) => void;
  allowMotherSave: boolean;
  setAllowMotherSave: (allowMotherSave: boolean) => void;
  allowQuestionsSave: boolean;
  setAllowQuestionsSave: (allowQuestionsSave: boolean) => void;
  deletedChildren: Array<Child>;
  setDeletedChildren: (deletedChildren: Array<Child>) => void;
  deletedVocationalEducs: Array<EducationInfo>;
  setDeletedVocationalEducs: (
    deletedVocationalEducs: Array<EducationInfo>
  ) => void;
  deletedCollegeEducs: Array<EducationInfo>;
  setDeletedCollegeEducs: (deletedCollegeEducs: Array<EducationInfo>) => void;
  deletedGraduateEducs: Array<EducationInfo>;
  setDeletedGraduateEducs: (deletedGraduateEducs: Array<EducationInfo>) => void;
  deletedEligibilities: Array<Eligibility>;
  setDeletedEligibilities: (deletedEligibilities: Array<Eligibility>) => void;
  deletedWorkExperiences: Array<WorkExperience>;
  setDeletedWorkExperiences: (
    deletedWorkExperiences: Array<WorkExperience>
  ) => void;
  deletedLearningDevelopment: Array<LearningDevelopment>;
  setDeletedLearningDevelopment: (
    deletedLearningDevelopment: Array<LearningDevelopment>
  ) => void;
  deletedVolWork: Array<VoluntaryWork>;
  setDeletedVolWork: (deletedVolWork: Array<VoluntaryWork>) => void;
  deletedSkills: Array<Skill>;
  setDeletedSkills: (deletedSkills: Array<Skill>) => void;
  deletedRecognitions: Array<Recognition>;
  setDeletedRecognitions: (deletedRecognitions: Array<Recognition>) => void;
  deletedOrganizations: Array<Organization>;
  setDeletedOrganizations: (deletedOrganizations: Array<Organization>) => void;
  deletedReferences: Array<Reference>;
  setDeletedReferences: (deletedReferences: Array<Reference>) => void;
  allowDelete: boolean;
  setAllowDelete: (allowDelete: boolean) => void;
  allowDeleteChildren: boolean;
  setAllowDeleteChildren: (allowDeleteChildren: boolean) => void;
  allowEditChildren: boolean;
  setAllowEditChildren: (allowEditChildren: boolean) => void;
  allowDeleteVocational: boolean;
  setAllowDeleteVocational: (allowDeleteVocational: boolean) => void;
  allowDeleteWorkExperience: boolean;
  setAllowAddWorkExperience: (allowAddWorkExperience: boolean) => void;
  allowAddWorkExperience: boolean;
  setAllowDeleteWorkExperience: (allowDeleteWorkExperience: boolean) => void;
  allowManageWorkExperience: boolean;
  setAllowManageWorkExperience: (allowManageWorkExperience: boolean) => void;
  allowEditWorkExperience: boolean;
  setAllowEditWorkExperience: (allowEditWorkExperience: boolean) => void;
  allowEditVocational: boolean;
  setAllowEditVocational: (allowEditVocational: boolean) => void;
  allowEditCollege: boolean;
  setAllowEditCollege: (allowEditCollege: boolean) => void;
  allowDeleteCollege: boolean;
  setAllowDeleteCollege: (allowDeleteCollege: boolean) => void;
  allowEditGraduate: boolean;
  setAllowEditGraduate: (allowEditGraduate: boolean) => void;
  allowDeleteGraduate: boolean;
  setAllowDeleteGraduate: (allowEditGraduate: boolean) => void;
  allowDeleteEligibility: boolean;
  setAllowDeleteEligibility: (allowDeleteEligibility: boolean) => void;
  allowEditEligibility: boolean;
  setAllowEditEligibility: (allowEditEligibility: boolean) => void;
  allowDeleteVolWork: boolean;
  setAllowDeleteVolWork: (allowDeleteVolWork: boolean) => void;
  allowEditVolWork: boolean;
  setAllowEditVolWork: (allowEditVolWork: boolean) => void;
  allowEditLnd: boolean;
  setAllowEditLnd: (allowEditLnd: boolean) => void;
  allowDeleteLnd: boolean;
  setAllowDeleteLnd: (allowEditLnd: boolean) => void;
  allowAddLnd: boolean;
  setAllowAddLnd: (allowAddLnd: boolean) => void;
  allowAddSkill: boolean;
  setAllowAddSkill: (allowAddSkill: boolean) => void;
  allowEditSkill: boolean;
  setAllowEditSkill: (allowEditSkill: boolean) => void;
  allowDeleteSkill: boolean;
  setAllowDeleteSkill: (allowDeleteSkill: boolean) => void;
  allowAddRecog: boolean;
  setAllowAddRecog: (allowAddRecog: boolean) => void;
  allowEditRecog: boolean;
  setAllowEditRecog: (allowEditRecog: boolean) => void;
  allowDeleteRecog: boolean;
  setAllowDeleteRecog: (allowDeleteRecog: boolean) => void;
  allowAddOrganization: boolean;
  setAllowAddOrganization: (allowAddOrganization: boolean) => void;
  allowEditOrganization: boolean;
  setAllowEditOrganization: (allowEditOrganization: boolean) => void;
  allowDeleteOrganization: boolean;
  setAllowDeleteOrganization: (allowDeleteOrganization: boolean) => void;
  allowAddReference: boolean;
  setAllowAddReference: (allowAddReference: boolean) => void;
  allowEditReference: boolean;
  setAllowEditReference: (allowEditReference: boolean) => void;
  allowDeleteReference: boolean;
  setAllowDeleteReference: (allowDeleteReference: boolean) => void;
  allowEditOfficeRelation: boolean;
  setAllowEditOfficeRelation: (allowEditOfficeRelation: boolean) => void;
  allowEditSupportingInfo: boolean;
  setAllowEditSupportingInfo: (allowEditSupportingInfo: boolean) => void;
};

export const useUpdatePdsStore = create<UpdatePdsState>((set) => ({
  allowFatherSave: true,
  allowMotherSave: true,
  allowGovernmentIssuedIdSave: true,
  allowElementarySave: true,
  allowSecondarySave: true,
  allowPersonalInfoSave: true,
  allowSpouseSave: true,
  allowGovernmentIdsSave: true,
  allowQuestionsSave: true,
  allowResidentialAddressSave: true,
  allowPermanentAddressSave: true,
  deletedChildren: [],
  deletedVocationalEducs: [],
  deletedCollegeEducs: [],
  deletedGraduateEducs: [],
  deletedEligibilities: [],
  deletedLearningDevelopment: [],
  deletedWorkExperiences: [],
  deletedVolWork: [],
  deletedSkills: [],
  deletedRecognitions: [],
  deletedOrganizations: [],
  deletedReferences: [],
  allowDelete: false,
  allowEditChildren: true,
  allowDeleteChildren: true,
  allowEditVocational: true,
  allowDeleteVocational: true,
  allowEditCollege: true,
  allowDeleteCollege: true,
  allowEditGraduate: true,
  allowDeleteGraduate: true,
  allowDeleteEligibility: true,
  allowEditEligibility: true,
  allowEditWorkExperience: true,
  allowAddWorkExperience: true, //! REMOVE THIS LATER
  allowDeleteWorkExperience: true,
  allowEditVolWork: true,
  allowDeleteVolWork: true,
  allowAddLnd: true, //! REMOVE THIS LATER
  allowDeleteLnd: true,
  allowEditLnd: true,
  allowAddSkill: true,
  allowEditSkill: true,
  allowDeleteSkill: true,
  allowAddRecog: true,
  allowEditRecog: true,
  allowDeleteRecog: true,
  allowAddOrganization: true,
  allowEditOrganization: true,
  allowDeleteOrganization: true,
  allowAddReference: true,
  allowEditReference: true,
  allowDeleteReference: true,
  allowManageWorkExperience: true,
  allowEditOfficeRelation: true,
  allowEditSupportingInfo: true,
  setAllowResidentialAddressSave: (allowResidentialAddressSave: boolean) => {
    set((state) => ({ ...state, allowResidentialAddressSave }));
  },
  setAllowPermanentAddressSave: (allowPermanentAddressSave: boolean) => {
    set((state) => ({ ...state, allowPermanentAddressSave }));
  },
  setAllowGovernmentIssuedIdSave: (allowGovernmentIssuedIdSave: boolean) => {
    set((state) => ({ ...state, allowGovernmentIssuedIdSave }));
  },
  setAllowElementarySave: (allowElementarySave: boolean) => {
    set((state) => ({ ...state, allowElementarySave }));
  },
  setAllowSecondarySave: (allowSecondarySave: boolean) => {
    set((state) => ({ ...state, allowSecondarySave }));
  },
  setAllowMotherSave: (allowMotherSave: boolean) => {
    set((state) => ({ ...state, allowMotherSave }));
  },
  setAllowSpouseSave: (allowSpouseSave: boolean) => {
    set((state) => ({ ...state, allowSpouseSave }));
  },
  setAllowGovernmentIdsSave: (allowGovernmentIdsSave: boolean) => {
    set((state) => ({ ...state, allowGovernmentIdsSave }));
  },
  setAllowPersonalInfoSave: (allowPersonalInfoSave: boolean) => {
    set((state) => ({ ...state, allowPersonalInfoSave }));
  },
  setAllowManageWorkExperience: (allowManageWorkExperience: boolean) => {
    set((state) => ({ ...state, allowManageWorkExperience }));
  },
  setDeletedChildren: (deletedChildren: Array<Child>) => {
    set((state) => ({ ...state, deletedChildren }));
  },
  setDeletedEligibilities: (deletedEligibilities: Array<Eligibility>) => {
    set((state) => ({ ...state, deletedEligibilities }));
  },
  setDeletedLearningDevelopment: (
    deletedLearningDevelopment: Array<LearningDevelopment>
  ) => {
    set((state) => ({ ...state, deletedLearningDevelopment }));
  },
  setDeletedWorkExperiences: (
    deletedWorkExperiences: Array<WorkExperience>
  ) => {
    set((state) => ({ ...state, deletedWorkExperiences }));
  },
  setDeletedVolWork: (deletedVolWork: Array<VoluntaryWork>) => {
    set((state) => ({ ...state, deletedVolWork }));
  },
  setDeletedVocationalEducs: (deletedVocationalEducs: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedVocationalEducs }));
  },
  setDeletedCollegeEducs: (deletedCollegeEducs: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedCollegeEducs }));
  },
  setDeletedGraduateEducs: (deletedGraduateEducs: Array<EducationInfo>) => {
    set((state) => ({ ...state, deletedGraduateEducs }));
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
  setAllowDelete: (allowDelete: boolean) => {
    set((state) => ({ ...state, allowDelete }));
  },
  setAllowDeleteChildren: (allowDeleteChildren: boolean) => {
    set((state) => ({ ...state, allowDeleteChildren }));
  },
  setAllowDeleteVocational: (allowDeleteVocational: boolean) => {
    set((state) => ({ ...state, allowDeleteVocational }));
  },
  setAllowDeleteWorkExperience: (allowDeleteWorkExperience: boolean) => {
    set((state) => ({ ...state, allowDeleteWorkExperience }));
  },
  setAllowEditWorkExperience: (allowEditWorkExperience: boolean) => {
    set((state) => ({ ...state, allowEditWorkExperience }));
  },
  setAllowEditVocational: (allowEditVocational: boolean) => {
    set((state) => ({ ...state, allowEditVocational }));
  },
  setAllowEditChildren: (allowEditChildren: boolean) => {
    set((state) => ({ ...state, allowEditChildren }));
  },
  setAllowEditCollege: (allowEditCollege: boolean) => {
    set((state) => ({ ...state, allowEditCollege }));
  },
  setAllowDeleteCollege: (allowDeleteCollege: boolean) => {
    set((state) => ({ ...state, allowDeleteCollege }));
  },
  setAllowEditGraduate: (allowEditGraduate: boolean) => {
    set((state) => ({ ...state, allowEditGraduate }));
  },
  setAllowDeleteGraduate: (allowDeleteGraduate: boolean) => {
    set((state) => ({ ...state, allowDeleteGraduate }));
  },
  setAllowDeleteEligibility: (allowDeleteEligibility: boolean) => {
    set((state) => ({ ...state, allowDeleteEligibility }));
  },
  setAllowEditEligibility: (allowEditEligibility: boolean) => {
    set((state) => ({ ...state, allowEditEligibility }));
  },
  setAllowDeleteVolWork: (allowDeleteVolWork: boolean) => {
    set((state) => ({ ...state, allowDeleteVolWork }));
  },
  setAllowAddWorkExperience: (allowAddWorkExperience: boolean) => {
    set((state) => ({ ...state, allowAddWorkExperience }));
  },
  setAllowEditVolWork: (allowEditVolWork: boolean) => {
    set((state) => ({ ...state, allowEditVolWork }));
  },
  setAllowDeleteLnd: (allowDeleteLnd: boolean) => {
    set((state) => ({ ...state, allowDeleteLnd }));
  },
  setAllowEditLnd: (allowEditLnd: boolean) => {
    set((state) => ({ ...state, allowEditLnd }));
  },
  setAllowAddLnd: (allowAddLnd: boolean) => {
    set((state) => ({ ...state, allowAddLnd }));
  },
  setAllowAddSkill: (allowAddSkill: boolean) => {
    set((state) => ({ ...state, allowAddSkill }));
  },
  setAllowEditSkill: (allowEditSkill: boolean) => {
    set((state) => ({ ...state, allowEditSkill }));
  },
  setAllowDeleteSkill: (allowDeleteSkill: boolean) => {
    set((state) => ({ ...state, allowDeleteSkill }));
  },
  setAllowAddRecog: (allowAddRecog: boolean) => {
    set((state) => ({ ...state, allowAddRecog }));
  },
  setAllowEditRecog: (allowEditRecog: boolean) => {
    set((state) => ({ ...state, allowEditRecog }));
  },
  setAllowDeleteRecog: (allowDeleteRecog: boolean) => {
    set((state) => ({ ...state, allowDeleteRecog }));
  },
  setAllowAddOrganization: (allowAddOrganization: boolean) => {
    set((state) => ({ ...state, allowAddOrganization }));
  },
  setAllowEditOrganization: (allowEditOrganization: boolean) => {
    set((state) => ({ ...state, allowEditOrganization }));
  },
  setAllowDeleteOrganization: (allowDeleteOrganization: boolean) => {
    set((state) => ({ ...state, allowDeleteOrganization }));
  },
  setAllowAddReference: (allowAddReference: boolean) => {
    set((state) => ({ ...state, allowAddReference }));
  },
  setAllowEditReference: (allowEditReference: boolean) => {
    set((state) => ({ ...state, allowEditReference }));
  },
  setAllowDeleteReference: (allowDeleteReference: boolean) => {
    set((state) => ({ ...state, allowDeleteReference }));
  },
  setAllowEditOfficeRelation: (allowEditOfficeRelation: boolean) => {
    set((state) => ({ ...state, allowEditOfficeRelation }));
  },
  setAllowEditSupportingInfo: (allowEditSupportingInfo: boolean) => {
    set((state) => ({ ...state, allowEditSupportingInfo }));
  },
  setAllowQuestionsSave: (allowQuestionsSave: boolean) => {
    set((state) => ({ ...state, allowQuestionsSave }));
  },
  setAllowFatherSave: (allowFatherSave: boolean) => {
    set((state) => ({ ...state, allowFatherSave }));
  },
}));
