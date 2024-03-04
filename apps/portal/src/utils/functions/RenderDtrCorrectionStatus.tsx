/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { DtrCorrectionApproval } from 'libs/utils/src/lib/enums/approval.enum';

function UseRenderDtrCorrectionStatus(status: DtrCorrectionApproval, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === DtrCorrectionApproval.APPROVED
          ? 'success'
          : status === DtrCorrectionApproval.DISAPPROVED
          ? 'error'
          : status === DtrCorrectionApproval.PENDING
          ? 'warning'
          : 'default'
      }
      label={
        status === DtrCorrectionApproval.APPROVED
          ? 'Approved'
          : status === DtrCorrectionApproval.DISAPPROVED
          ? 'Disapproved'
          : status === DtrCorrectionApproval.PENDING
          ? 'Pending'
          : status
      }
    />
  );
}

export default UseRenderDtrCorrectionStatus;
