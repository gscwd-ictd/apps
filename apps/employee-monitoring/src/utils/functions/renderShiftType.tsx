/* This function is used for rendering schedule shifts */

import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

function UseRenderShiftType(shiftType: ScheduleShifts | null) {
  if (shiftType === ScheduleShifts.MORNING) {
    return (
      <div className="bg-red-400 text-white text-xs font-medium py-0.5 rounded text-center">
        Morning
      </div>
    );
  } else if (shiftType === ScheduleShifts.NIGHT) {
    return (
      <div className="bg-blue-400 text-white text-xs font-medium py-0.5 rounded text-center ">
        Night
      </div>
    );
  } else {
    return <></>;
  }
}
export default UseRenderShiftType;
