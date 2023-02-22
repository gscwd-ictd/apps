import { isEmpty } from 'lodash';
import { VoluntaryWork } from 'types/data/vol-work.type';

export async function AssignedVolWorksToUpdate(volWorks: Array<VoluntaryWork>) {
  let add: Array<VoluntaryWork> = [];
  let update: Array<VoluntaryWork> = [];

  // add
  volWorks.length > 0 &&
    volWorks.map((volWork: VoluntaryWork) => {
      if (isEmpty(volWork._id)) add.push(volWork);
    });

  // update
  volWorks.length > 0 &&
    volWorks.map((volWork: VoluntaryWork) => {
      if (!isEmpty(volWork._id) && volWork.isEdited === true) update.push(volWork);
    });

  // sort add
  add.sort((firstItem, secondItem) => (firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0));

  // sort update
  update.sort((firstItem, secondItem) => (firstItem.from! > secondItem.from! ? -1 : secondItem.from! > firstItem.from! ? 1 : 0));

  return { add, update };
}
