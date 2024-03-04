/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';

function UseRenderOvertimeAccomplishmentStatus(status: OvertimeAccomplishmentStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
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
          : status
      }
    />
  );
}

export default UseRenderOvertimeAccomplishmentStatus;
