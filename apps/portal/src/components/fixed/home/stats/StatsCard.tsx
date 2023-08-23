/* eslint-disable @nx/enforce-module-boundaries */
import { HiOutlineClock, HiOutlineCalendar, HiOutlineDocument } from 'react-icons/hi';
import { LoadingSpinner } from '@gscwd-apps/oneui';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Props {
  count: number;
  name: string;
  isLoading: boolean;
  width: string;
  height: string;
  svg: any;
  svgBgColor: string;
}
export const StatsCard: React.FC<Props> = ({
  count = 0,
  name,
  isLoading,
  width = 'w-full',
  height = 'h-full',
  svg,
  svgBgColor = 'bg-white',
}) => {
  return (
    <div className={`${width} ${height} shadow bg-white flex flex-col justify-center p-4 gap-2 rounded-md`}>
      {isLoading ? (
        <>
          <Skeleton count={3} />
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <label className="text-3xl xl:text-5xl text-gray-700">{count ? count : '0'}</label>
            <div className={` ${svgBgColor} flex justify-center items-center rounded-full w-12 h-12`}>{svg}</div>
          </div>
          <label className="text-xs text-stone-500">{name}</label>
        </>
      )}
      {name === 'Lates Count' || name == 'Pass Slip Count' ? (
        <div className="w-full h-4 rounded bg-neutral-200">
          <>
            <div
              className={`${
                count >= 10
                  ? 'w-full bg-red-500'
                  : count == 9
                  ? 'w-11/12 bg-red-500'
                  : count == 8
                  ? 'w-4/5 bg-red-500'
                  : count == 7
                  ? 'w-9/12 bg-orange-500'
                  : count == 6
                  ? 'w-3/5 bg-orange-500'
                  : count == 5
                  ? 'w-1/2 bg-orange-500'
                  : count == 4
                  ? 'w-2/5 bg-indigo-500'
                  : count == 3
                  ? 'w-1/3 bg-indigo-500'
                  : count == 2
                  ? 'w-1/5 bg-indigo-500'
                  : count == 1
                  ? 'w-1/12 bg-indigo-500'
                  : 'w-0'
              } h-4 rounded transition-all duration-700 delay-200`}
            ></div>
          </>
        </div>
      ) : null}
    </div>
  );
};
