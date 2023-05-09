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

type AllChildren = {
  update: Array<Child>;
  deleted: Array<Child>;
};

type AllEducation = {
  update: Array<EducationInfo>;
  deleted: Array<EducationInfo>;
};

type AllEligibilities = {
  update: Array<Eligibility>;
  deleted: Array<Eligibility>;
};

type AllWorkExperiences = {
  update: Array<WorkExperience>;
  deleted: Array<WorkExperience>;
};

type AllVoluntaryWorks = {
  update: Array<VoluntaryWork>;
  deleted: Array<VoluntaryWork>;
};

type AllLearningDevelopments = {
  update: Array<LearningDevelopment>;
  deleted: Array<LearningDevelopment>;
};

type AllSkills = {
  update: Array<Skill>;
  deleted: Array<Skill>;
};

type AllRecognitions = {
  update: Array<Recognition>;
  deleted: Array<Recognition>;
};

type AllOrganizations = {
  update: Array<Organization>;
  deleted: Array<Organization>;
};

type AllReferences = {
  update: Array<Reference>;
  deleted: Array<Reference>;
};

export function AssignChildrenForUpdating(
  children: Array<Child>,
  deleted: Array<Child>
) {
  const allChildren: AllChildren = { update: children, deleted };
  return allChildren;
}

export function AssignEducationForUpdating(
  education: Array<EducationInfo>,
  deleted: Array<EducationInfo>
) {
  const allEducation: AllEducation = { update: education, deleted };
  return allEducation;
}

export function AssignEligibilitiesForUpdating(
  eligibilities: Array<Eligibility>,
  deleted: Array<Eligibility>
) {
  const allEligibilites: AllEligibilities = { update: eligibilities, deleted };
  return allEligibilites;
}

export function AssignWorkExperiencesForUpdating(
  workExperiences: Array<WorkExperience>,
  deleted: Array<WorkExperience>
) {
  const allWorkExperiences: AllWorkExperiences = {
    update: workExperiences,
    deleted,
  };
  return allWorkExperiences;
}

export function AssignVoluntaryWorksForUpdating(
  volWorks: Array<VoluntaryWork>,
  deleted: Array<VoluntaryWork>
) {
  const allVoluntaryWorks: AllVoluntaryWorks = { update: volWorks, deleted };
  return allVoluntaryWorks;
}

export function AssignLearningDevelopmentsForUpdating(
  lnds: Array<LearningDevelopment>,
  deleted: Array<LearningDevelopment>
) {
  const allLearningDevelopments: AllLearningDevelopments = {
    update: lnds,
    deleted,
  };
  return allLearningDevelopments;
}

export function AssignSkillsForUpdating(
  skills: Array<Skill>,
  deleted: Array<Skill>
) {
  const allSkills: AllSkills = { update: skills, deleted };
  return allSkills;
}

export function AssignRecognitionsForUpdating(
  recognitions: Array<Recognition>,
  deleted: Array<Recognition>
) {
  const allRecognitions: AllRecognitions = { update: recognitions, deleted };
  return allRecognitions;
}

export function AssignOrganizationsForUpdating(
  organizations: Array<Organization>,
  deleted: Array<Organization>
) {
  const allOrganizations: AllOrganizations = { update: organizations, deleted };
  return allOrganizations;
}

export function AssignReferencesForUpdating(
  references: Array<Reference>,
  deleted: Array<Reference>
) {
  const allReferences: AllReferences = { update: references, deleted };
  return allReferences;
}
