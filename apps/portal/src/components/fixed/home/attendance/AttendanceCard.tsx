/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';

import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';

interface Props {
  timeIn: string;
  lunchOut: string;
  lunchIn: string;
  timeOut: string;
  dateNow: string;
}
export const AttendanceCard: React.FC<Props> = ({
  timeIn,
  lunchOut,
  lunchIn,
  timeOut,
  dateNow,
}) => {
  const now = dayjs().toDate().toDateString();
  const isLate = UseLateChecker(timeIn, '08:00:00'); //change to scheduled timeIn prop when ready
  const isUnderTime = UseUndertimeChecker(timeOut, '05:00:00'); //change to scheduled timeOut prop when ready
  console.log(timeIn);
  return (
    <div className="w-full h-auto shadow rounded-md bg-white flex flex-col p-4 gap-2">
      <label className="text-2xl text-gray-600 font-bold text-center">
        {now}
      </label>
      <div className="flex flex-row justify-around items-center">
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            TIME IN
          </label>
          <label
            className={`${
              isLate && timeIn && timeIn != '-'
                ? 'text-red-600'
                : 'text-green-600'
            } text-md `}
          >
            {timeIn && timeIn != '-' ? UseTwelveHourFormat(timeIn) : '-'}
          </label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            LUNCH OUT
          </label>
          <label className="text-md text-green-600">
            {lunchOut && lunchOut != '-' ? UseTwelveHourFormat(lunchOut) : '-'}
          </label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            LUNCH IN
          </label>
          <label className="text-md text-green-600">
            {lunchIn && lunchIn != '-' ? UseTwelveHourFormat(lunchIn) : '-'}
          </label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            TIME OUT
          </label>
          <label
            className={`${
              isUnderTime && timeOut && timeOut != '-'
                ? 'text-red-600'
                : 'text-green-600'
            } text-md `}
          >
            {timeOut && timeOut != '-' ? UseTwelveHourFormat(timeOut) : '-'}
          </label>
        </div>
      </div>
    </div>
  );
};
