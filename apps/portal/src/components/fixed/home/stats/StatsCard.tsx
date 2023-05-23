/* eslint-disable @nx/enforce-module-boundaries */
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineGlobe,
} from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

interface Props {
  count: number;
  name: string;
}
export const StatsCard: React.FC<Props> = ({ count, name }) => {
  const { windowWidth } = UseWindowDimensions();
  return (
    <div className="h-34 w-full shadow bg-white flex flex-col p-4 gap-2 rounded-md">
      <div className="flex flex-row justify-between">
        {name == 'Total Lates' ? (
          <HiOutlineClock className="w-8 h-8 text-indigo-500" />
        ) : name == 'Total Absents' ? (
          <HiOutlineCalendar className="w-8 h-8 text-indigo-500" />
        ) : name == 'Total Leaves' ? (
          <HiOutlineGlobe className="w-8 h-8 text-indigo-500" />
        ) : (
          ''
        )}
      </div>
      {/* <label className="text-7xl text-stone-500">{count}</label> */}
      <label className="text-7xl text-stone-500">10</label>
      {windowWidth > 1024 ? (
        <>
          <label className="text-xs text-stone-500">{name}</label>

          <div className="w-full h-3 rounded bg-stone-300">
            <div
              className={`${
                count >= 10
                  ? 'w-full'
                  : count == 9
                  ? 'w-11/12'
                  : count == 8
                  ? 'w-4/5'
                  : count == 7
                  ? 'w-9/12'
                  : count == 6
                  ? 'w-3/5'
                  : count == 5
                  ? 'w-1/2'
                  : count == 4
                  ? 'w-2/5'
                  : count == 3
                  ? 'w-1/3'
                  : count == 2
                  ? 'w-1/5'
                  : count == 1
                  ? 'w-1/12'
                  : 'w-px'
              } h-3 rounded bg-indigo-500`}
            ></div>
          </div>
        </>
      ) : null}
    </div>
  );
};
