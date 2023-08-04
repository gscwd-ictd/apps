/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering schedule shifts */
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

function UseRenderShiftType(shiftType: ScheduleShifts | null) {
  if (shiftType === ScheduleShifts.DAY) {
    return (
      <div className="bg-red-200 text-red-800 text-xs font-mono py-0.5 rounded text-center">
        Day
      </div>
    );
  } else if (shiftType === ScheduleShifts.NIGHT) {
    return (
      <div className="bg-blue-200 text-blue-800 text-xs font-mono py-0.5 rounded text-center ">
        Night
      </div>
    );
  } else {
    return <></>;
  }
}
export default UseRenderShiftType;
