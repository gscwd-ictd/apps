/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';

function UseRenderDtrCorrectionStatus(status: DtrCorrectionStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === DtrCorrectionStatus.APPROVED
          ? 'success'
          : status === DtrCorrectionStatus.DISAPPROVED
          ? 'error'
          : status === DtrCorrectionStatus.PENDING
          ? 'warning'
          : 'default'
      }
      label={
        status === DtrCorrectionStatus.APPROVED
          ? 'Approved'
          : status === DtrCorrectionStatus.DISAPPROVED
          ? 'Disapproved'
          : status === DtrCorrectionStatus.PENDING
          ? 'Pending'
          : status
      }
    />
  );
}

export default UseRenderDtrCorrectionStatus;
