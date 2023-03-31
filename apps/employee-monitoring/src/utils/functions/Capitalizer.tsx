/* This function is used for capitalizing the first letter of a word */

export const UseCapitalizer = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
