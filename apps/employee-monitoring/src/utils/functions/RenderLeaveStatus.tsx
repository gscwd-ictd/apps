/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderLeaveStatus(status: LeaveStatus) {
  return (
    <BadgePill
      variant={
        status === LeaveStatus.APPROVED
          ? 'success'
          : status === LeaveStatus.CANCELLED
          ? 'error'
          : status === LeaveStatus.DISAPPROVED
          ? 'error'
          : status === LeaveStatus.FOR_APPROVAL
          ? 'warning'
          : status === LeaveStatus.ONGOING
          ? 'primary'
          : 'default'
      }
      label={
        status === LeaveStatus.APPROVED
          ? 'Approved'
          : status === LeaveStatus.FOR_APPROVAL
          ? 'For Approval'
          : status === LeaveStatus.CANCELLED
          ? 'Cancelled'
          : status === LeaveStatus.DISAPPROVED
          ? 'Disapproved'
          : status === LeaveStatus.ONGOING
          ? 'Ongoing'
          : null
      }
    />
  );
}

export default UseRenderLeaveStatus;
