/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty, isEqual } from 'lodash';
import { Card } from '../../../src/types/allowed-modules.type';
import { EmployeeDetails } from '../../../src/types/employee.type';
import { Modules } from '../constants/card';
import { UserRole } from '../enums/userRoles';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { EmployeeRestDay } from 'libs/utils/src/lib/types/dtr.type';

export const setModules = async (userDetails: EmployeeDetails, schedule: Schedule & EmployeeRestDay) => {
  let allowed: Array<Card> = [];
  if (isEmpty(userDetails.employmentDetails.userRole)) {
    //do nothing
  } else {
    if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'leaves' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else if (
      isEqual(userDetails.employmentDetails.userRole, UserRole.JOB_ORDER) ||
      isEqual(userDetails.employmentDetails.userRole, UserRole.COS_JO)
    ) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'dtr' ||
          card.destination === 'pass-slip' ||
          card.destination === 'email' ||
          card.destination === 'overtime-accomplishment'
      );
    } else if (isEqual(userDetails.employmentDetails.userRole, UserRole.COS)) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'dtr' || card.destination === 'email' || card.destination === 'overtime-accomplishment'
      );
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
  }

  return allowed;
};
