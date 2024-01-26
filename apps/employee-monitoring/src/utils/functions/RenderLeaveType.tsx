/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { isEmpty } from 'lodash';
import BadgePill from '../../components/badges/BadgePill';

function UseRenderLeaveType(value: string | null | '') {
  if (!isEmpty(value)) {
    return <BadgePill label={value} variant="primary" />;
  } else return <span>-</span>;
}

export default UseRenderLeaveType;
