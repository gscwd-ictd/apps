/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderLeaveStatus(status: LeaveStatus | string) {
  return (
    <BadgePill
      variant={
        status === LeaveStatus.APPROVED || status === 'approved'
          ? 'success'
          : status === LeaveStatus.CANCELLED || status === 'cancelled'
          ? 'error'
          : status === LeaveStatus.FOR_HRDM_APPROVAL || status === 'for hrdm approval'
          ? 'warning'
          : status === LeaveStatus.FOR_HRMO_APPROVAL || status === 'for hrmo approval'
          ? 'warning'
          : status === LeaveStatus.FOR_SUPERVISOR_APPROVAL || status === 'for supervisor approval'
          ? 'warning'
          : status === LeaveStatus.DISAPPROVED_BY_HRDM || status === 'disapproved by hrdm'
          ? 'error'
          : status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR || status === 'disapproved by supervisor'
          ? 'error'
          : status === LeaveStatus.DISAPPROVED_BY_HRMO || status === 'disapproved by hrmo'
          ? 'error'
          : 'default'
      }
      label={
        status === LeaveStatus.FOR_HRMO_APPROVAL
          ? 'For HRMO Approval'
          : status === LeaveStatus.FOR_SUPERVISOR_APPROVAL
          ? 'For Supervisor Approval'
          : status === LeaveStatus.FOR_HRDM_APPROVAL
          ? 'For HRDM Approval'
          : status === LeaveStatus.APPROVED
          ? 'Approved'
          : status === LeaveStatus.DISAPPROVED_BY_HRDM
          ? 'Disapproved By HRDM'
          : status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
          ? 'Disapproved By Supervisor'
          : status === LeaveStatus.DISAPPROVED_BY_HRMO
          ? 'Disapproved By HRMO'
          : status === LeaveStatus.CANCELLED
          ? 'Cancelled'
          : null
      }
    />
  );
}

export default UseRenderLeaveStatus;
