/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import BadgePill from '../../components/modular/badges/BadgePill';

function UseRenderAccomplishmentSubmitted(status: boolean, textSize: TextSize) {
  return (
    <BadgePill
      textSize={textSize}
      variant={status == true ? 'success' : status == false ? 'warning' : 'default'}
      label={status == true ? 'Submitted' : status == false ? 'Not Submitted' : 'N/A'}
    />
  );
}

export default UseRenderAccomplishmentSubmitted;
