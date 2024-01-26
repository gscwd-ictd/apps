/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { TrainingPreparationStatus } from 'libs/utils/src/lib/enums/training.enum';

function UseRenderTrainingPreparationStatus(status: TrainingPreparationStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={status === TrainingPreparationStatus.ON_GOING_NOMINATION ? 'warning' : 'default'}
      label={status === TrainingPreparationStatus.ON_GOING_NOMINATION ? 'On Going Nomination' : 'N/A'}
    />
  );
}

export default UseRenderTrainingPreparationStatus;
