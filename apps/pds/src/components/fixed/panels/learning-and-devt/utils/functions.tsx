import { isEmpty } from 'lodash';
import { LearningDevelopment } from '../../../../../types/data/lnd.type';

export async function AssignLndsForUpdate(lnds: Array<LearningDevelopment>) {
  const add: Array<LearningDevelopment> = [];
  const update: Array<LearningDevelopment> = [];

  // add
  lnds.length > 0 &&
    lnds.map((lnd: LearningDevelopment) => {
      if (isEmpty(lnd._id)) add.push(lnd);
    });

  // update
  lnds.length > 0 &&
    lnds.map((lnd: LearningDevelopment) => {
      if (!isEmpty(lnd._id) && lnd.isEdited === true) update.push(lnd);
    });

  add.sort((firstItem, secondItem) =>
    firstItem.from! > secondItem.from!
      ? -1
      : secondItem.from! > firstItem.from!
      ? 1
      : 0
  );
  update.sort((firstItem, secondItem) =>
    firstItem.from! > secondItem.from!
      ? -1
      : secondItem.from! > firstItem.from!
      ? 1
      : 0
  );

  return { add, update };
}
