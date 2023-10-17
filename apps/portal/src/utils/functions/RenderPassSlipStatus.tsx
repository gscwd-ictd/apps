/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import BadgePill from '../../components/modular/badges/BadgePill';

function UseRenderPassSlipStatus(status: PassSlipStatus) {
  return (
    <BadgePill
      variant={
        status === PassSlipStatus.APPROVED
          ? 'success'
          : status === PassSlipStatus.DISAPPROVED
          ? 'error'
          : status === PassSlipStatus.ONGOING
          ? 'warning'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
            status === PassSlipStatus.FOR_HRMO_APPROVAL ||
            status === PassSlipStatus.FOR_DISPUTE
          ? 'warning'
          : status === PassSlipStatus.CANCELLED
          ? 'default'
          : status === PassSlipStatus.USED
          ? 'default'
          : null
      }
      label={
        status === PassSlipStatus.APPROVED
          ? 'Approved'
          : status === PassSlipStatus.DISAPPROVED
          ? 'Disapproved'
          : status === PassSlipStatus.ONGOING
          ? 'Ongoing'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
          ? 'For Supervisor Approval'
          : status === PassSlipStatus.FOR_HRMO_APPROVAL
          ? 'For HRMO Approval'
          : status === PassSlipStatus.FOR_DISPUTE
          ? 'For Dispute'
          : status === PassSlipStatus.CANCELLED
          ? 'Cancelled'
          : status === PassSlipStatus.USED
          ? 'Used'
          : ''
      }
    />
  );
}

export default UseRenderPassSlipStatus;
