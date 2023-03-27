// Render badge pill design

import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

function UseRenderShiftType(shiftType: ScheduleShifts | null) {
  if (shiftType === ScheduleShifts.MORNING) {
    return (
      <div className="bg-red-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded text-center w-[12rem]">
        Morning
      </div>
    );
  } else if (shiftType === ScheduleShifts.NIGHT) {
    return (
      <div className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded text-center w-[12rem]">
        Night
      </div>
    );
  } else {
    return <></>;
  }
}
export default UseRenderShiftType;
