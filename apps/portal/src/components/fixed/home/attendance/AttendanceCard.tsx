/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';

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
  const { windowWidth } = UseWindowDimensions();
  const now = dayjs().toDate().toDateString();
  return (
    <div className="w-full h-auto shadow rounded-md bg-white flex flex-col p-4 gap-2">
      <label className="text-2xl text-gray-600 font-bold text-center">
        {now}
      </label>
      <div className="flex flex-row justify-around items-center">
        <div className="flex flex-col justify-center items-center">
          <label
            className={`${
              windowWidth > 1024 ? 'text-xl' : 'text-sm'
            } font-bold text-gray-400 text-center`}
          >
            TIME IN
          </label>
          <label className="text-md text-green-600">
            {UseTwelveHourFormat(timeIn)}
          </label>
          {/* <label className="text-md text-green-600">-</label> */}
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`${
              windowWidth > 1024 ? 'text-xl' : 'text-sm'
            } font-bold text-gray-400 text-center`}
          >
            LUNCH OUT
          </label>
          <label className="text-md text-green-600">
            {UseTwelveHourFormat(lunchOut)}
          </label>
          {/* <label className="text-md text-green-600">-</label> */}
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`${
              windowWidth > 1024 ? 'text-xl' : 'text-sm'
            } font-bold text-gray-400 text-center`}
          >
            LUNCH IN
          </label>
          <label className="text-md text-green-600">
            {UseTwelveHourFormat(lunchIn)}
          </label>
          {/* <label className="text-md text-green-600">-</label> */}
        </div>
        <div className="flex flex-col justify-center items-center">
          <label
            className={`${
              windowWidth > 1024 ? 'text-xl' : 'text-sm'
            } font-bold text-gray-400 text-center`}
          >
            TIME OUT
          </label>
          <label className="text-md text-green-600">
            {timeOut ? UseTwelveHourFormat(timeOut) : '-'}
          </label>
          {/* <label className="text-md text-green-600">-</label> */}
        </div>
      </div>
    </div>
  );
};
