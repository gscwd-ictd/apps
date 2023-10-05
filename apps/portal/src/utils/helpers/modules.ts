import { isEqual } from 'lodash';
import { Card } from '../../../src/types/allowed-modules.type';
import { EmployeeDetails } from '../../../src/types/employee.type';
import { Modules } from '../constants/card';
import { UserRole } from '../enums/userRoles';

export const setModules = async (userDetails: EmployeeDetails) => {
  let allowed: Array<Card> = [];
  if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
    if (Boolean(userDetails.employmentDetails.isHRMPSB) === true) {
      allowed = Modules.filter(
        (card) =>
          // card.destination === 'psb' ||
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else if (Boolean(userDetails.employmentDetails.isHRMPSB) === false) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    }
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'overtime-accomplishment'
    );
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER)) {
    if (
      userDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      userDetails.employmentDetails.assignment.name === 'Training and Development Division'
    ) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    }
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER)) {
    if (
      userDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      userDetails.employmentDetails.assignment.name === 'Training and Development Division'
    ) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    }
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pds' ||
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'email' ||
        card.destination === 'overtime-accomplishment'
    );
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pds' ||
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'email' ||
        card.destination === 'overtime-accomplishment'
    );
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.BOARD_MEMBER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pds' ||
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'email' ||
        card.destination === 'overtime-accomplishment'
    );
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER)) {
    if (
      userDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      userDetails.employmentDetails.assignment.name === 'Training and Development Division'
    ) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    }
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER)) {
    if (
      userDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      userDetails.employmentDetails.assignment.name === 'Training and Development Division'
    ) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    }
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pds' ||
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'email' ||
        card.destination === 'overtime-accomplishment'
    );
  } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pds' ||
        card.destination === 'dtr' ||
        card.destination === 'pass-slip' ||
        card.destination === 'leaves' ||
        card.destination === 'email' ||
        card.destination === 'overtime-accomplishment'
    );
  }

  return allowed;
};

//FOR PRE-PROD VERSION:

// export const setModules = async (userDetails: EmployeeDetails) => {
//   let allowed: Array<Card> = [];
//   if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
//     if (Boolean(userDetails.employmentDetails.isHRMPSB) === true) {
//       allowed = Modules.filter(
//         (card) =>
//           card.destination === 'psb' ||
//           card.destination === 'pds' ||
//           card.destination === 'dtr'
//         // ||
//         // card.destination === 'pass-slip' ||
//         // card.destination === 'leaves' ||
//          card.destination === 'email'
//       );
//     } else if (Boolean(userDetails.employmentDetails.isHRMPSB) === false) {
//       allowed = Modules.filter(
//         (card) => card.destination === 'pds' || card.destination === 'dtr'
//         // ||
//         // card.destination === 'pass-slip' ||
//         // card.destination === 'leaves' ||
//          card.destination === 'email'
//       );
//     }
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)
//   ) {
//     allowed = Modules.filter(
//       (card) => card.destination === 'dtr'
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves'
//     );
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER)
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER)
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(
//       userDetails.employmentDetails.userRole,
//       UserRole.ASSISTANT_GENERAL_MANAGER
//     )
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       //  ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER)
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'selection' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.BOARD_MEMBER)
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'selection' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(
//       userDetails.employmentDetails.userRole,
//       UserRole.OIC_DIVISION_MANAGER
//     )
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(
//       userDetails.employmentDetails.userRole,
//       UserRole.OIC_DEPARTMENT_MANAGER
//     )
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(
//       userDetails.employmentDetails.userRole,
//       UserRole.OIC_ASSISTANT_GENERAL_MANAGER
//     )
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       //  ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   } else if (
//     isEqual(
//       userDetails.employmentDetails.userRole,
//       UserRole.OIC_GENERAL_MANAGER
//     )
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dnr' ||
//         card.destination === 'prf' ||
//         card.destination === 'endorsement' ||
//         card.destination === 'selection' ||
//         card.destination === 'psb' ||
//         // card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr'
//       // ||
//       // card.destination === 'pass-slip' ||
//       // card.destination === 'leaves' ||
//          card.destination === 'email'
//     );
//   }

//   return allowed;
// };
