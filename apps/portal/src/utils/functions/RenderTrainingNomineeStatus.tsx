/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { NomineeStatus } from 'libs/utils/src/lib/enums/training.enum';

function UseRenderTrainingNomineeStatus(status: NomineeStatus, textSize?: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={status === NomineeStatus.PENDING ? 'warning' : status === NomineeStatus.ACCEPTED ? 'success' : 'error'}
      label={status === NomineeStatus.PENDING ? 'Pending' : status === NomineeStatus.ACCEPTED ? 'Accepted' : 'Declined'}
    />
  );
}

export default UseRenderTrainingNomineeStatus;
