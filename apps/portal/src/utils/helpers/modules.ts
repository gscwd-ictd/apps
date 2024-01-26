/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty, isEqual } from 'lodash';
import { Card } from '../../../src/types/allowed-modules.type';
import { EmployeeDetails } from '../../../src/types/employee.type';
import { Modules } from '../constants/card';
import { UserRole } from '../enums/userRoles';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { EmployeeRestDay } from 'libs/utils/src/lib/types/dtr.type';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';

<<<<<<< HEAD
// export const setModules = async (userDetails: EmployeeDetails) => {
//   let allowed: Array<Card> = [];
//   if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
//     if (Boolean(userDetails.employmentDetails.isHRMPSB) === true) {
//       allowed = Modules.filter(
//         (card) =>
//           card.destination === 'psb' ||
//           card.destination === 'pds' ||
//           card.destination === 'dtr' ||
//           card.destination === 'pass-slip' ||
//           card.destination === 'leaves'
//       );
//     } else if (Boolean(userDetails.employmentDetails.isHRMPSB) === false) {
//       allowed = Modules.filter(
//         (card) =>
//           card.destination === 'pds' ||
//           card.destination === 'dtr' ||
//           card.destination === 'pass-slip' ||
//           card.destination === 'leaves'
//       );
//     }
//   } else if (
//     isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)
//   ) {
//     allowed = Modules.filter(
//       (card) =>
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
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
//         card.destination === 'approvals' ||
//         card.destination === 'pds' ||
//         card.destination === 'dtr' ||
//         card.destination === 'pass-slip' ||
//         card.destination === 'leaves'
//     );
//   }

//   return allowed;
// };

//FOR PRE-PROD VERSION:

export const setModules = async (userDetails: EmployeeDetails) => {
  let allowed: Array<Card> = [];
  if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
    if (Boolean(userDetails.employmentDetails.isHRMPSB) === true) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'psb' ||
          card.destination === 'pds' ||
          card.destination === 'dtr'
        // ||
        // card.destination === 'pass-slip' ||
        // card.destination === 'leaves'
      );
    } else if (Boolean(userDetails.employmentDetails.isHRMPSB) === false) {
      allowed = Modules.filter(
        (card) => card.destination === 'pds' || card.destination === 'dtr'
        // ||
        // card.destination === 'pass-slip' ||
        // card.destination === 'leaves'
      );
    }
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)
  ) {
    allowed = Modules.filter(
      (card) => card.destination === 'dtr'
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(
      userDetails.employmentDetails.userRole,
      UserRole.ASSISTANT_GENERAL_MANAGER
    )
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      //  ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'selection' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.BOARD_MEMBER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'selection' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(
      userDetails.employmentDetails.userRole,
      UserRole.OIC_DIVISION_MANAGER
    )
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(
      userDetails.employmentDetails.userRole,
      UserRole.OIC_DEPARTMENT_MANAGER
    )
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(
      userDetails.employmentDetails.userRole,
      UserRole.OIC_ASSISTANT_GENERAL_MANAGER
    )
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      //  ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
  } else if (
    isEqual(
      userDetails.employmentDetails.userRole,
      UserRole.OIC_GENERAL_MANAGER
    )
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'selection' ||
        card.destination === 'psb' ||
        // card.destination === 'approvals' ||
        card.destination === 'pds' ||
        card.destination === 'dtr'
      // ||
      // card.destination === 'pass-slip' ||
      // card.destination === 'leaves'
    );
=======
export const setModules = async (userDetails: EmployeeDetails, schedule: Schedule & EmployeeRestDay) => {
  let allowed: Array<Card> = [];
  if (isEmpty(userDetails.employmentDetails.userRole)) {
    //do nothing
  } else {
    if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
      if (schedule.scheduleBase == ScheduleBases.PUMPING_STATION || schedule.scheduleBase == ScheduleBases.FIELD) {
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
    } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) {
      if (isEmpty(schedule)) {
        allowed = Modules.filter(
          (card) =>
            card.destination === 'dtr' ||
            card.destination === 'pass-slip' ||
            card.destination === 'email' ||
            card.destination === 'overtime-accomplishment'
        );
      } else if (
        (schedule && schedule.scheduleBase == ScheduleBases.PUMPING_STATION) ||
        schedule.scheduleBase == ScheduleBases.FIELD
      ) {
        allowed = Modules.filter(
          (card) =>
            card.destination === 'dtr' ||
            card.destination === 'pass-slip' ||
            card.destination === 'email' ||
            card.destination === 'overtime-accomplishment'
        );
      } else {
        allowed = Modules.filter(
          (card) =>
            card.destination === 'dtr' ||
            card.destination === 'pass-slip' ||
            card.destination === 'email' ||
            card.destination === 'overtime-accomplishment'
        );
      }
    } else {
      // all managers
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
>>>>>>> 13761ca59b7709d133207e83699e2adb884de29e
  }

  return allowed;
};
