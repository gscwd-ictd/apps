/* This function is used for rendering pass slip valuees */

import { ObTransportation } from 'libs/utils/src/lib/enums/pass-slip.enum';

function UseRenderObTransportation(value: ObTransportation | null | '') {
  if (value === ObTransportation.OFFICE_VEHICLE) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-200 text-slate-900 text-center">
          Office
        </span>
      </div>
    );
  } else if (value === ObTransportation.PRIVATE_OR_PERSONAL_VEHICLE) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-200 text-slate-900 text-center">
          Private/Personal
        </span>
      </div>
    );
  } else if (value === ObTransportation.PUBLIC_VEHICLE) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] bg-blue-200 text-slate-900 rounded text-center">
          Public
        </span>
      </div>
    );
  } else return <span>-</span>;
}

export default UseRenderObTransportation;
