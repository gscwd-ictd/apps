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
          card.destination === 'pds' ||
          card.destination === 'leaves' ||
          card.destination === 'pass-slip' ||
          card.destination === 'dtr' ||
          card.destination === 'psb'
      );
    } else if (Boolean(userDetails.employmentDetails.isHRMPSB) === false) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'leaves' ||
          card.destination === 'pass-slip' ||
          card.destination === 'dtr'
      );
    }
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'pass-slip' ||
        card.destination === 'dtr'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr'
    );
  } else if (
    isEqual(userDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER)
  ) {
    allowed = Modules.filter(
      (card) =>
        card.destination === 'dnr' ||
        card.destination === 'prf' ||
        card.destination === 'endorsement' ||
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
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
        card.destination === 'pds' ||
        card.destination === 'psb' ||
        card.destination === 'leaves' ||
        card.destination === 'pass-slip' ||
        card.destination === 'dtr' ||
        card.destination === 'approvals'
    );
  }

  return allowed;
};
