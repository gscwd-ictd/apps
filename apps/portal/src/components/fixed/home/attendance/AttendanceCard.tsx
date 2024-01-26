/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';

import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

interface Props {
  timeLogData: EmployeeDtrWithSchedule;
  swrFaceScanIsLoading: boolean;
}
export const AttendanceCard: React.FC<Props> = ({ timeLogData, swrFaceScanIsLoading }) => {
  const now = dayjs().toDate().toDateString();
  const isLate = UseLateChecker(timeLogData?.dtr?.timeIn, timeLogData?.schedule?.timeIn); //change to scheduled timeIn prop when ready
  const isUnderTime = UseUndertimeChecker(timeLogData?.dtr?.timeOut, timeLogData?.schedule?.timeOut); //change to scheduled timeOut prop when ready

  const { windowHeight } = UseWindowDimensions();

  return (
    <div
      className={`w-full ${
        windowHeight > 820 ? 'h-52' : 'h-full'
      }  shadow rounded-md bg-white flex flex-col justify-center p-4 gap-2`}
    >
      {swrFaceScanIsLoading ? (
        <>
          <Skeleton count={4} />
        </>
      ) : (
        <>
          <label className="text-2xl text-gray-600 font-bold text-center">{now}</label>
          <div className="flex flex-row justify-around items-center">
            <div className="flex flex-col justify-center items-center">
              <label className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}>TIME IN</label>
              {timeLogData?.schedule?.scheduleBase === 'Office' ? (
                //if user is Office, include late checker
                <label
                  className={`${
                    isLate && timeLogData?.dtr?.timeIn && timeLogData?.dtr?.timeIn != null
                      ? 'text-red-600'
                      : 'text-green-600'
                  } text-md `}
                >
                  {timeLogData?.dtr?.timeIn && timeLogData?.dtr?.timeIn != null
                    ? UseTwelveHourFormat(timeLogData?.dtr?.timeIn)
                    : '-'}
                </label>
              ) : (
                //else display timeIn with no late checker
                <label className={`text-md text-gray-600`}>
                  {timeLogData?.dtr?.timeIn && timeLogData?.dtr?.timeIn != null
                    ? UseTwelveHourFormat(timeLogData?.dtr?.timeIn)
                    : '-'}
                </label>
              )}
            </div>
            {timeLogData?.schedule?.scheduleBase === 'Office' ? (
              <>
                <div className="flex flex-col justify-center items-center">
                  <label className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}>
                    LUNCH OUT
                  </label>
                  <label className="text-md text-green-600">
                    {timeLogData?.dtr?.lunchOut && timeLogData?.dtr?.lunchOut != null
                      ? UseTwelveHourFormat(timeLogData?.dtr?.lunchOut)
                      : '-'}
                  </label>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <label className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}>
                    LUNCH IN
                  </label>
                  <label className="text-md text-green-600">
                    {timeLogData?.dtr?.lunchIn && timeLogData?.dtr?.lunchIn != null
                      ? UseTwelveHourFormat(timeLogData?.dtr?.lunchIn)
                      : '-'}
                  </label>
                </div>
              </>
            ) : null}

            <div className="flex flex-col justify-center items-center">
              <label className={`text-sm md:text-md lg:text-lg font-bold text-gray-400 text-center`}>TIME OUT</label>
              {timeLogData?.schedule?.scheduleBase === 'Office' ? (
                //if user is Office, include late checker
                <label
                  className={`${
                    isUnderTime && timeLogData?.dtr?.timeOut && timeLogData?.dtr?.timeOut != null
                      ? 'text-red-600'
                      : 'text-green-600'
                  } text-md `}
                >
                  {timeLogData?.dtr?.timeOut && timeLogData?.dtr?.timeOut != null
                    ? UseTwelveHourFormat(timeLogData?.dtr?.timeOut)
                    : '-'}
                </label>
              ) : (
                //else display timeIn with no undertime checker
                <label className={`text-md text-gray-600`}>
                  {timeLogData?.dtr?.timeOut && timeLogData?.dtr?.timeOut != null
                    ? UseTwelveHourFormat(timeLogData?.dtr?.timeOut)
                    : '-'}
                </label>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
