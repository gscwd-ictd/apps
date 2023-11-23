/* eslint-disable @nx/enforce-module-boundaries */
import { isEqual } from 'lodash';
import { Card } from '../../../src/types/allowed-modules.type';
import { EmployeeDetails } from '../../../src/types/employee.type';
import { Modules } from '../constants/card';
import { UserRole } from '../enums/userRoles';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { EmployeeRestDay } from 'libs/utils/src/lib/types/dtr.type';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';

export const setModules = async (userDetails: EmployeeDetails, schedule: Schedule & EmployeeRestDay) => {
  let allowed: Array<Card> = [];
  if (isEqual(userDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE)) {
    if (schedule.scheduleBase != ScheduleBases.PUMPING_STATION) {
      allowed = Modules.filter(
        (card) =>
          card.destination === 'pds' ||
          card.destination === 'dtr' ||
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
