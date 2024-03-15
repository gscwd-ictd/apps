/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { LeaveCancellationStatus } from 'libs/utils/src/lib/enums/leave.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderLeaveCancellationStatus(status: LeaveCancellationStatus | string, textSize?: string) {
  return (
    <BadgePill
      variant={
        status === LeaveCancellationStatus.FOR_CANCELLATION || status === 'for cancellation'
          ? 'warning'
          : status === LeaveCancellationStatus.CANCELLED || status === 'cancelled'
          ? 'success'
          : // : status === LeaveStatus.DISAPPROVED_BY_HRMO || status === 'disapproved by hrmo'
            // ? 'error'
            'default'
      }
      label={
        status === LeaveCancellationStatus.FOR_CANCELLATION
          ? 'For Cancellation'
          : status === LeaveCancellationStatus.CANCELLED
          ? 'Cancelled'
          : null
      }
      textSize={textSize}
    />
  );
}

export default UseRenderLeaveCancellationStatus;
