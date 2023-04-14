/* This function is used for rendering pass slip statuses */

import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

function UseRenderPassSlipStatus(status: PassSlipStatus) {
  if (status === PassSlipStatus.ONGOING) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-blue-400 text-white text-center">
          Ongoing
        </span>
      </div>
    );
  } else if (status === PassSlipStatus.APPROVED) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-green-500 text-white text-center">
          Approved
        </span>
      </div>
    );
  } else if (status === PassSlipStatus.DISAPPROVED) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] bg-red-400 rounded text-white text-center">
          Disapproved
        </span>
      </div>
    );
  } else if (status === PassSlipStatus.CANCELLED) {
    return (
      <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
        <span className="px-2 py-[0.2rem] rounded bg-gray-400 text-white text-center">
          Cancelled
        </span>
      </div>
    );
  }
}

export default UseRenderPassSlipStatus;
