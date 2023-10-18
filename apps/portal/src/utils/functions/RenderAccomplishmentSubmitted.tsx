/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip statuses */

import BadgePill from '../../components/modular/badges/BadgePill';

function UseRenderAccomplishmentSubmitted(status: boolean) {
  return (
    <BadgePill
      variant={status == true ? 'success' : status == false ? 'warning' : 'default'}
      label={status == true ? 'Submitted' : status == false ? 'Not Submitted' : 'N/A'}
    />
  );
}

export default UseRenderAccomplishmentSubmitted;
