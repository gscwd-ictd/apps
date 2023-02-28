import { isEmpty } from 'lodash';
import { Child } from '../../../../../types/data/family.type';

export async function AssignChildrenToUpdate(children: Array<Child>) {
  const add: Array<Child> = [];
  const update: Array<Child> = [];

  // for posting
  children.length > 0 &&
    children.map((child: Child) => {
      if (isEmpty(child._id))
        add.push({
          _id: child._id,
          birthDate: child.birthDate,
          childName: child.childName,
        });
    });

  // for updating
  children.length > 0 &&
    children.map((child: Child) => {
      if (!isEmpty(child._id))
        update.push({
          _id: child._id,
          birthDate: child.birthDate,
          childName: child.childName,
        });
    });

  // sort
  add.sort((firstItem, secondItem) =>
    firstItem.birthDate > secondItem.birthDate
      ? 1
      : secondItem.birthDate > firstItem.birthDate
      ? -1
      : 0
  );

  // sort
  update.sort((firstItem, secondItem) =>
    firstItem.birthDate > secondItem.birthDate
      ? 1
      : secondItem.birthDate > firstItem.birthDate
      ? -1
      : 0
  );

  return { add, update };
}
