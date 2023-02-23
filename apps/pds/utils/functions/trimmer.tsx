// trimmer
export const trimmer = (value: string) => {
  return value
    .replace(/(^\s*)|(\s*$)/gi, '') // removes leading and trailing spaces
    .replace(/[ ]{2,}/gi, ' ') // replaces multiple spaces with one space
    .replace(/\n +/, '\n'); // Removes spaces after newlines
};
