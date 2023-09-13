/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderOvertimeAccomplishmentStatus(status: OvertimeAccomplishmentStatus | string) {
  return (
    <BadgePill
      variant={
        status === OvertimeAccomplishmentStatus.APPROVED || status === 'approved'
          ? 'success'
          : status === OvertimeAccomplishmentStatus.DISAPPROVED || status === 'disapproved'
          ? 'error'
          : status === OvertimeAccomplishmentStatus.PENDING || status === 'pending'
          ? 'warning'
          : 'default'
      }
      label={
        status === OvertimeAccomplishmentStatus.APPROVED
          ? 'Approved'
          : status === OvertimeAccomplishmentStatus.DISAPPROVED
          ? 'Disapproved'
          : status === OvertimeAccomplishmentStatus.PENDING
          ? 'Pending'
          : null
      }
    />
  );
}

export default UseRenderOvertimeAccomplishmentStatus;
