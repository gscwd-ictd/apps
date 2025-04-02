/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

function UseRenderOvertimeStatus(status: OvertimeStatus | string, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === OvertimeStatus.APPROVED || status === 'approved'
          ? 'success'
          : status === OvertimeStatus.DISAPPROVED || status === 'disapproved'
          ? 'error'
          : status === OvertimeStatus.PENDING || status === 'pending'
          ? 'warning'
          : status === OvertimeStatus.CANCELLED || status === 'cancelled'
          ? 'error'
          : 'default'
      }
      label={
        status === OvertimeStatus.APPROVED
          ? 'Approved'
          : status === OvertimeStatus.DISAPPROVED
          ? 'Disapproved'
          : status === OvertimeStatus.PENDING
          ? 'For Approval'
          : status === OvertimeStatus.CANCELLED
          ? 'Cancelled'
          : status
      }
    />
  );
}

export default UseRenderOvertimeStatus;
