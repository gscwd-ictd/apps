/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip typees */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { NomineeType } from 'libs/utils/src/lib/enums/training.enum';

function UseRenderTrainingNomineeType(type: NomineeType, textSize?: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={type === NomineeType.NOMINEE ? 'primary' : type === NomineeType.STAND_IN ? 'default' : 'warning'}
      label={type === NomineeType.NOMINEE ? 'Nominee' : type === NomineeType.STAND_IN ? 'Stand-In' : ''}
    />
  );
}

export default UseRenderTrainingNomineeType;
