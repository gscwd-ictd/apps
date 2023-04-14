/* This function is used for rendering pass slip valuees */

import { NatureOfBusiness } from 'libs/utils/src/lib/enums/pass-slip.enum';

function UseRenderNatureOfBusiness(value: NatureOfBusiness) {
  if (value === NatureOfBusiness.OFFICIAL_BUSINESS) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-200 text-slate-900 text-center">
          Official Business
        </span>
      </div>
    );
  } else if (value === NatureOfBusiness.PERSONAL_BUSINESS) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-200 text-slate-900 text-center">
          Personal Business
        </span>
      </div>
    );
  } else if (value === NatureOfBusiness.HALF_DAY) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] bg-blue-200 text-slate-900 rounded text-center">
          Half Day
        </span>
      </div>
    );
  } else if (value === NatureOfBusiness.UNDERTIME) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-200 text-slate-900 text-center">
          Undertime
        </span>
      </div>
    );
  }
}

export default UseRenderNatureOfBusiness;
