/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import BadgePill from '../../components/modular/badges/BadgePill';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';

function UseRenderOvertimeAccomplishmentStatus(status: OvertimeAccomplishmentStatus) {
  return (
    <BadgePill
      variant={
        status === OvertimeAccomplishmentStatus.APPROVED
          ? 'success'
          : status === OvertimeAccomplishmentStatus.DISAPPROVED
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
          : status === OvertimeAccomplishmentStatus.PENDING
          ? 'Pending'
          : ''
      }
    />
  );
}

export default UseRenderOvertimeAccomplishmentStatus;
