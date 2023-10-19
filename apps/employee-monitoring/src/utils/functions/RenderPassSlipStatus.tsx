/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderPassSlipStatus(status: PassSlipStatus, textSize?: string) {
  return (
    <BadgePill
      variant={
        status === PassSlipStatus.APPROVED
          ? 'success'
          : status === PassSlipStatus.DISAPPROVED
          ? 'error'
          : status === PassSlipStatus.DISAPPROVED_BY_HRMO
          ? 'error'
          : status === PassSlipStatus.ONGOING
          ? 'warning'
          : status === PassSlipStatus.FOR_HRMO_APPROVAL
          ? 'warning'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
          ? 'warning'
          : status === PassSlipStatus.FOR_DISPUTE
          ? 'warning'
          : status === PassSlipStatus.CANCELLED
          ? 'default'
          : status === PassSlipStatus.USED
          ? 'default'
          : status === PassSlipStatus.UNUSED
          ? 'default'
          : null
      }
      label={
        status === PassSlipStatus.APPROVED
          ? 'Approved'
          : status === PassSlipStatus.DISAPPROVED
          ? 'Disapproved'
          : status === PassSlipStatus.DISAPPROVED_BY_HRMO
          ? 'Disapproved by HRMO'
          : status === PassSlipStatus.ONGOING
          ? 'Ongoing'
          : status === PassSlipStatus.FOR_HRMO_APPROVAL
          ? 'For HRMO Approval'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
          ? 'For Supervisor Approval'
          : status === PassSlipStatus.FOR_DISPUTE
          ? 'For Dispute'
          : status === PassSlipStatus.CANCELLED
          ? 'Cancelled'
          : status === PassSlipStatus.USED
          ? 'Used'
          : status === PassSlipStatus.UNUSED
          ? 'Unused'
          : ''
      }
      textSize={textSize}
    />
  );
}

export default UseRenderPassSlipStatus;
