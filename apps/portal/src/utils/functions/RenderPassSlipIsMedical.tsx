/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';

function UseRenderPassSlipIsMedical(status: boolean, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={status === true ? 'success' : 'default'}
      label={status === true ? 'Yes' : 'No'}
    />
  );
}

export default UseRenderPassSlipIsMedical;
