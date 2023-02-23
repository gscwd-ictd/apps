import { isEmpty } from 'lodash';
import { Organization, Recognition, Skill } from 'types/data/other-info.type';
import { Reference } from 'types/data/supporting-info.type';

export async function AssignSkillsToUpdate(skills: Array<Skill>) {
  let add: Array<Skill> = [];
  let update: Array<Skill> = [];

  // add
  skills.length > 0 &&
    skills.map((skill: Skill) => {
      if (isEmpty(skill._id)) add.push(skill);
    });

  // update
  skills.length > 0 &&
    skills.map((skill: Skill) => {
      if (!isEmpty(skill._id) && skill.isEdited === true) update.push(skill);
    });

  return { add, update };
}

export async function AssignRecognitionsToUpdate(recognitions: Array<Recognition>) {
  let add: Array<Recognition> = [];
  let update: Array<Recognition> = [];

  // add
  recognitions.length > 0 &&
    recognitions.map((recognition: Recognition) => {
      if (isEmpty(recognition._id)) add.push(recognition);
    });

  // update
  recognitions.length > 0 &&
    recognitions.map((recognition: Recognition) => {
      if (!isEmpty(recognition._id) && recognition.isEdited === true) update.push(recognition);
    });

  return { add, update };
}

export async function AssignOrganizationsToUpdate(organizations: Array<Organization>) {
  let add: Array<Organization> = [];
  let update: Array<Organization> = [];

  // add
  organizations.length > 0 &&
    organizations.map((organization: Organization) => {
      if (isEmpty(organization._id)) add.push(organization);
    });

  // update
  organizations.length > 0 &&
    organizations.map((organization: Organization) => {
      if (!isEmpty(organization._id) && organization.isEdited === true) update.push(organization);
    });

  return { add, update };
}

export async function AssignReferencesForUpdate(references: Array<Reference>) {
  let add: Array<Reference> = [];
  let update: Array<Reference> = [];

  // add
  references.length > 0 &&
    references.map((reference: Reference) => {
      if (isEmpty(reference._id)) add.push(reference);
    });

  // update
  references.length > 0 &&
    references.map((reference: Reference) => {
      if (!isEmpty(reference._id) && reference.isEdited === true) update.push(reference);
    });

  return { add, update };
}
