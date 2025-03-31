/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderOvertimeAccomplishmentStatus(status: OvertimeAccomplishmentStatus | string) {
  return (
    <BadgePill
      variant={
        status === OvertimeAccomplishmentStatus.APPROVED
          ? 'success'
          : status === OvertimeAccomplishmentStatus.DISAPPROVED
          ? 'error'
          : status === OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER ||
            status === OvertimeAccomplishmentStatus.REMOVED_BY_SUPERVISOR
          ? 'error'
          : status === OvertimeAccomplishmentStatus.PENDING
          ? 'warning'
          : 'default'
      }
      label={
        status === OvertimeAccomplishmentStatus.APPROVED
          ? 'Approved'
          : status === OvertimeAccomplishmentStatus.DISAPPROVED
          ? 'Disapproved'
          : status === OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER
          ? 'Removed by Manager'
          : status === OvertimeAccomplishmentStatus.REMOVED_BY_SUPERVISOR
          ? 'Removed by Supervisor'
          : status === OvertimeAccomplishmentStatus.PENDING
          ? 'Pending'
          : null
      }
    />
  );
}

export default UseRenderOvertimeAccomplishmentStatus;
