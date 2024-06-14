/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { TrainingNominationStatus } from 'libs/utils/src/lib/enums/training.enum';

function UseRenderTrainingNominationStatus(status: TrainingNominationStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === TrainingNominationStatus.NOMINATION_PENDING
          ? 'warning'
          : status === TrainingNominationStatus.NOMINATION_COMPLETED ||
            status === TrainingNominationStatus.NOMINATION_SUBMITTED
          ? 'success'
          : status === TrainingNominationStatus.NOMINATION_INELIGIBLE ||
            status === TrainingNominationStatus.NOMINATION_SKIPPED
          ? 'error'
          : 'default'
      }
      label={
        status === TrainingNominationStatus.NOMINATION_PENDING
          ? 'Pending'
          : status === TrainingNominationStatus.NOMINATION_COMPLETED ||
            status === TrainingNominationStatus.NOMINATION_SUBMITTED
          ? 'Submitted'
          : status === TrainingNominationStatus.NOMINATION_INELIGIBLE ||
            status === TrainingNominationStatus.NOMINATION_SKIPPED
          ? 'Skipped'
          : status
      }
    />
  );
}

export default UseRenderTrainingNominationStatus;
