/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { ObTransportation } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { isEmpty } from 'lodash';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderObTransportation(value: ObTransportation | null | '') {
  if (!isEmpty(value)) {
    return (
      <BadgePill
        label={
          value === ObTransportation.PUBLIC_VEHICLE
            ? 'Public Vehicle'
            : value === ObTransportation.OFFICE_VEHICLE
            ? 'Office Vehicle'
            : value === ObTransportation.PRIVATE_OR_PERSONAL_VEHICLE
            ? 'Private/Personal'
            : null
        }
        variant={'primary'}
      />
    );
  } else return <span>-</span>;
}

export default UseRenderObTransportation;
