import { isEmpty } from 'lodash';
import { WorkExperience } from 'types/data/work.type';

export async function AssignWorkExperiencesForUpdate(workExperiences: Array<WorkExperience>) {
  let add: Array<WorkExperience> = [];
  let update: Array<WorkExperience> = [];

  // add
  workExperiences.length > 0 &&
    workExperiences.map((work: WorkExperience) => {
      if (isEmpty(work._id)) add.push(work);
    });

  // update
  workExperiences.length > 0 &&
    workExperiences.map((work: WorkExperience) => {
      if (!isEmpty(work._id) && work.isEdited === true) update.push(work);
    });

  return { add, update };
}
