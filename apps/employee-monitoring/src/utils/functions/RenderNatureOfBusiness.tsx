/* This function is used for rendering pass slip statuses */

import { NatureOfBusiness } from 'libs/utils/src/lib/enums/pass-slip.enum';

function UseRenderNatureOfBusiness(status: NatureOfBusiness) {
  if (status === NatureOfBusiness.OFFICIAL_BUSINESS) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-400 text-white text-center">
          Official Business
        </span>
      </div>
    );
  } else if (status === NatureOfBusiness.PERSONAL_BUSINESS) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-green-500 text-white text-center">
          Personal Business
        </span>
      </div>
    );
  } else if (status === NatureOfBusiness.HALF_DAY) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] bg-red-400 rounded text-white text-center">
          Half Day
        </span>
      </div>
    );
  } else if (status === NatureOfBusiness.UNDERTIME) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-gray-400 text-white text-center">
          Undertime
        </span>
      </div>
    );
  }
}

export default UseRenderNatureOfBusiness;
