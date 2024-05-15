/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

function UseRenderLeaveStatus(status: LeaveStatus | string, textSize?: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === LeaveStatus.APPROVED || status === 'approved'
          ? 'success'
          : status === LeaveStatus.CANCELLED || status === 'cancelled'
          ? 'default'
          : status === LeaveStatus.FOR_HRDM_APPROVAL || status === 'for hrdm approval'
          ? 'warning'
          : status === LeaveStatus.FOR_HRMO_APPROVAL || status === 'for hrmo approval'
          ? 'warning'
          : status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION || status === 'for hrmo credit certification'
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
          ? 'For HRMO Review'
          : status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
          ? 'For HRMO Credit Certification'
          : status === LeaveStatus.FOR_SUPERVISOR_APPROVAL
          ? 'For Supervisor Review'
          : status === LeaveStatus.FOR_HRDM_APPROVAL
          ? 'For HRDM Review'
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
          : status
      }
    />
  );
}

export default UseRenderLeaveStatus;
