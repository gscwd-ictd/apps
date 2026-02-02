/* This function is used for capitalizing the first letter of a word */

import { isEmpty } from 'lodash';

export const UseCapitalizer = (string: string) => {
  if (!isEmpty(string)) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  } else {
    return;
  }
};
