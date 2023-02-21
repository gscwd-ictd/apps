export const useNameInitials = (firstName: string, lastName: string): string => {
  // get the first letter of the first name
  const fNameInitial = firstName.split('')[0].toUpperCase();

  // get the first letter of the last name
  const lNameInitial = lastName.split('')[0].toUpperCase();

  // return name initials
  return `${fNameInitial}${lNameInitial}`;
};

export const useInitialsFromFullName = (fullName: string) => {
  // set firstname initial to first array
  const firstName = fullName.split(' ')[0];

  // set lastname initial to second array
  const lastName = fullName.split(' ')[1];

  return useNameInitials(firstName, lastName);
};
