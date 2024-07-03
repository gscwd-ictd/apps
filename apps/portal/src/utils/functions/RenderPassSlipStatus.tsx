/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';

function UseRenderPassSlipStatus(status: PassSlipStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === PassSlipStatus.APPROVED
          ? 'success'
          : status === PassSlipStatus.DISAPPROVED || status === PassSlipStatus.DISAPPROVED_BY_HRMO
          ? 'error'
          : status === PassSlipStatus.ONGOING
          ? 'warning'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
            status === PassSlipStatus.FOR_HRMO_APPROVAL ||
            status === PassSlipStatus.FOR_DISPUTE ||
            status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE
          ? 'warning'
          : status === PassSlipStatus.CANCELLED
          ? 'default'
          : status === PassSlipStatus.USED || status === PassSlipStatus.UNUSED
          ? 'default'
          : 'default'
      }
      label={
        status === PassSlipStatus.APPROVED
          ? 'Approved'
          : status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE
          ? 'Awaiting Medical Certificate'
          : status === PassSlipStatus.DISAPPROVED
          ? 'Disapproved'
          : status === PassSlipStatus.DISAPPROVED_BY_HRMO
          ? 'Disapproved by HRMO'
          : status === PassSlipStatus.ONGOING
          ? 'Ongoing'
          : status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
          ? 'For Supervisor Review'
          : status === PassSlipStatus.FOR_HRMO_APPROVAL
          ? 'For HRMO Review'
          : status === PassSlipStatus.FOR_DISPUTE
          ? 'For Dispute'
          : status === PassSlipStatus.CANCELLED
          ? 'Cancelled'
          : status === PassSlipStatus.USED
          ? 'Used'
          : status === PassSlipStatus.UNUSED
          ? 'Unused'
          : status
      }
    />
  );
}

export default UseRenderPassSlipStatus;
