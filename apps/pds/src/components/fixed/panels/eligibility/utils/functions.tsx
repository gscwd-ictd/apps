import { Eligibility } from '../../../../../types/data/eligibility.type';
import { isEmpty } from 'lodash';

export async function AssignEligibilitiesForUpdate(eligs: Array<Eligibility>) {
  const add: Array<Eligibility> = [];
  const update: Array<Eligibility> = [];

  // add
  eligs.length > 0 &&
    eligs.map((elig: Eligibility) => {
      if (isEmpty(elig._id)) add.push(elig);
    });

  // update
  eligs.length > 0 &&
    eligs.map((elig: Eligibility) => {
      if (!isEmpty(elig._id) && elig.isEdited === true) update.push(elig);
    });

  // sort add
  add.sort((firstItem, secondItem) =>
    firstItem.examDateFrom! > secondItem.examDateFrom!
      ? -1
      : secondItem.examDateFrom! > firstItem.examDateFrom!
      ? 1
      : 0
  );

  // sort update
  update.sort((firstItem, secondItem) =>
    firstItem.examDateFrom! > secondItem.examDateFrom!
      ? -1
      : secondItem.examDateFrom! > firstItem.examDateFrom!
      ? 1
      : 0
  );

  return { add, update };
}
