/* This function is used for rendering pass slip valuees */

import { ObTransportation } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { isEmpty } from 'lodash';
import CustomBadgePill from '../../components/badges/CustomBadgePill';

function UseRenderObTransportation(value: ObTransportation | null | '') {
  if (!isEmpty(value)) {
    return (
      <CustomBadgePill
        label={
          value === ObTransportation.PUBLIC_VEHICLE
            ? 'Public Vehicle'
            : value === ObTransportation.OFFICE_VEHICLE
            ? 'Office Vehicle'
            : value === ObTransportation.PRIVATE_OR_PERSONAL_VEHICLE
            ? 'Private/Personal'
            : null
        }
        textColor="text-black"
        bgColor="bg-blue-300"
      />
    );
  } else return <span>-</span>;
}

export default UseRenderObTransportation;
