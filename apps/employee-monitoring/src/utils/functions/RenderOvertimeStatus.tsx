/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderOvertimeStatus(status: OvertimeStatus | string) {
  return (
    <BadgePill
      variant={
        status === OvertimeStatus.APPROVED || status === 'approved'
          ? 'success'
          : status === OvertimeStatus.DISAPPROVED || status === 'disapproved'
          ? 'error'
          : status === OvertimeStatus.PENDING || status === 'pending'
          ? 'warning'
          : 'default'
      }
      label={
        status === OvertimeStatus.APPROVED
          ? 'Approved'
          : status === OvertimeStatus.DISAPPROVED
          ? 'Disapproved'
          : status === OvertimeStatus.PENDING
          ? 'Pending'
          : null
      }
    />
  );
}

export default UseRenderOvertimeStatus;
