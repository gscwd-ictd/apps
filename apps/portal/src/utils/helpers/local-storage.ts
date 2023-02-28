import { EmployeeDetails } from '../../types/employee.type';
import { UseNameInitials } from '../hooks/useNameInitials';

export function setLocalStorage(userDetails: EmployeeDetails) {
  if (typeof window !== undefined) {
    // store employee data in the local storage
    localStorage.setItem(
      // set the key for this item
      'employee',

      // convert the json data into string
      JSON.stringify({
        // store email
        profile: userDetails.user.email,

        // store full name
        fullName: `${userDetails.profile.firstName} ${userDetails.profile.lastName}`,

        // generate name initials
        initials: UseNameInitials(
          userDetails.profile.firstName,
          userDetails.profile.lastName
        ),
      })
    );
  }
}
