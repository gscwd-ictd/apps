import { isEmpty } from 'lodash';
import { EducationInfo } from 'types/data/education.type';

export async function AssignCoursesToUpdate(course: Array<EducationInfo>) {
  let add: Array<EducationInfo> = [];
  let update: Array<EducationInfo> = [];

  // add
  course.length > 0 &&
    course.map((voc: EducationInfo) => {
      if (isEmpty(voc._id)) add.push(voc);
    });

  // post
  course.length > 0 &&
    course.map((voc: EducationInfo) => {
      if (!isEmpty(voc._id) && voc.isEdited === true) update.push(voc);
    });

  add.sort((firstItem, secondItem) => (firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0));

  update.sort((firstItem, secondItem) => (firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0));

  return { add, update };
}
