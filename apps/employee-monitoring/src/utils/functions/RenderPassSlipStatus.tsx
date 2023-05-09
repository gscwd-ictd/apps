/* This function is used for rendering pass slip statuses */

import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import BadgePill from '../../components/badges/BadgePill';

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
          : status === PassSlipStatus.FOR_APPROVAL
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
          : status === PassSlipStatus.FOR_APPROVAL
          ? 'For Approval'
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
