import { isEmpty } from 'lodash';
import { Eligibility } from 'types/data/eligibility.type';

export async function AssignEligibilitiesForUpdate(eligs: Array<Eligibility>) {
  let add: Array<Eligibility> = [];
  let update: Array<Eligibility> = [];

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
    firstItem.examDateFrom! > secondItem.examDateFrom! ? -1 : secondItem.examDateFrom! > firstItem.examDateFrom! ? 1 : 0
  );

  // sort update
  update.sort((firstItem, secondItem) =>
    firstItem.examDateFrom! > secondItem.examDateFrom! ? -1 : secondItem.examDateFrom! > firstItem.examDateFrom! ? 1 : 0
  );

  return { add, update };
}
