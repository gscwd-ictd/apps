// Render badge pill design

import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';

export const renderShiftType = (shiftType: ScheduleShifts | null) => {
  if (shiftType === ScheduleShifts.MORNING) {
    return (
      <span className="bg-red-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
        Morning
      </span>
    );
  } else if (shiftType === ScheduleShifts.NIGHT) {
    return (
      <span className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
        Night
      </span>
    );
  } else {
    return <></>;
  }
};
