/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';

import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';

interface Props {
  timeLogData: EmployeeDtrWithSchedule;
}
export const AttendanceCard: React.FC<Props> = ({ timeLogData }) => {
  const now = dayjs().toDate().toDateString();
  const isLate = UseLateChecker(
    timeLogData?.dtr?.timeIn,
    timeLogData?.schedule?.timeIn
  ); //change to scheduled timeIn prop when ready
  const isUnderTime = UseUndertimeChecker(
    timeLogData?.dtr?.timeOut,
    timeLogData?.schedule?.timeOut
  ); //change to scheduled timeOut prop when ready

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
              isLate &&
              timeLogData?.dtr?.timeIn &&
              timeLogData?.dtr?.timeIn != null
                ? 'text-red-600'
                : 'text-green-600'
            } text-md `}
          >
            {timeLogData?.dtr?.timeIn && timeLogData?.dtr?.timeIn != null
              ? UseTwelveHourFormat(timeLogData?.dtr?.timeIn)
              : '-'}
          </label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            LUNCH OUT
          </label>
          <label className="text-md text-green-600">
            {timeLogData?.dtr?.lunchOut && timeLogData?.dtr?.lunchOut != null
              ? UseTwelveHourFormat(timeLogData?.dtr?.lunchOut)
              : '-'}
          </label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}
          >
            LUNCH IN
          </label>
          <label className="text-md text-green-600">
            {timeLogData?.dtr?.lunchIn && timeLogData?.dtr?.lunchIn != null
              ? UseTwelveHourFormat(timeLogData?.dtr?.lunchIn)
              : '-'}
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
              isUnderTime &&
              timeLogData?.dtr?.timeOut &&
              timeLogData?.dtr?.timeOut != null
                ? 'text-red-600'
                : 'text-green-600'
            } text-md `}
          >
            {timeLogData?.dtr?.timeOut && timeLogData?.dtr?.timeOut != null
              ? UseTwelveHourFormat(timeLogData?.dtr?.timeOut)
              : '-'}
          </label>
        </div>
      </div>
    </div>
  );
};
