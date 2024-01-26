/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { NatureOfBusiness } from 'libs/utils/src/lib/enums/pass-slip.enum';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderNatureOfBusiness(value: NatureOfBusiness) {
  return (
    <BadgePill
      variant="primary"
      label={
        value === NatureOfBusiness.OFFICIAL_BUSINESS
          ? 'Official Business'
          : value === NatureOfBusiness.PERSONAL_BUSINESS
          ? 'Personal Business'
          : value === NatureOfBusiness.HALF_DAY
          ? 'Half Day'
          : value === NatureOfBusiness.UNDERTIME
          ? 'Undertime'
          : null
      }
    />
  );
}

export default UseRenderNatureOfBusiness;
