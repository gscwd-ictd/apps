/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';

function UseRenderTrainingPreparationStatus(status: TrainingStatus, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={
        status === TrainingStatus.ON_GOING_NOMINATION
          ? 'warning'
          : status === TrainingStatus.NOMINATION_DONE
          ? 'default'
          : status === TrainingStatus.PDC_SECRETARY_APPROVAL
          ? 'warning'
          : status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
          ? 'warning'
          : status === TrainingStatus.PDC_CHAIRMAN_DECLINED
          ? 'error'
          : status === TrainingStatus.PDC_SECRETARY_DECLINED
          ? 'error'
          : status === TrainingStatus.GM_APPROVAL
          ? 'warning'
          : status === TrainingStatus.GM_DECLINED
          ? 'error'
          : status === TrainingStatus.FOR_BATCHING
          ? 'default'
          : status === TrainingStatus.DONE_BATCHING
          ? 'default'
          : status === TrainingStatus.UPCOMING
          ? 'default'
          : status === TrainingStatus.ON_GOING_TRAINING
          ? 'primary'
          : status === TrainingStatus.REQUIREMENTS_SUBMISSION
          ? 'default'
          : status === TrainingStatus.PENDING
          ? 'warning'
          : status === TrainingStatus.COMPLETED
          ? 'success'
          : 'default'
      }
      label={
        status === TrainingStatus.ON_GOING_NOMINATION
          ? 'On Going Nomination'
          : status === TrainingStatus.NOMINATION_DONE
          ? 'Nomination Done'
          : status === TrainingStatus.PDC_SECRETARY_APPROVAL
          ? 'For PDC Secretary Review'
          : status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
          ? 'For PDC Chairman Review'
          : status === TrainingStatus.PDC_CHAIRMAN_DECLINED
          ? 'Disapproved by PDC Chairman'
          : status === TrainingStatus.PDC_SECRETARY_DECLINED
          ? 'Disapproved by PDC Secretary'
          : status === TrainingStatus.GM_APPROVAL
          ? 'For GM Review'
          : status === TrainingStatus.GM_DECLINED
          ? 'Disapproved by GM'
          : status === TrainingStatus.FOR_BATCHING
          ? 'On Going Batching'
          : status === TrainingStatus.DONE_BATCHING
          ? 'Done Batching'
          : status === TrainingStatus.UPCOMING
          ? 'Upcoming'
          : status === TrainingStatus.ON_GOING_TRAINING
          ? 'On Going Training'
          : status === TrainingStatus.REQUIREMENTS_SUBMISSION
          ? 'For Requirements Submission'
          : status === TrainingStatus.PENDING
          ? 'Pending'
          : status === TrainingStatus.COMPLETED
          ? 'Completed'
          : status
      }
    />
  );
}

export default UseRenderTrainingPreparationStatus;
