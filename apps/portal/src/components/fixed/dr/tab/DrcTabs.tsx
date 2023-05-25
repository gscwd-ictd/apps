/* eslint-disable @nx/enforce-module-boundaries */
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Position } from 'apps/portal/src/types/position.type';
import { isEmpty } from 'lodash';
import { HiCheck, HiOutlineCheckCircle } from 'react-icons/hi';
import { TabHeader } from '../../tab/TabHeader';

type Positions = {
  filled: Array<Position>;
  unfilled: Array<Position>;
};

type DrcTabsProps = {
  positions: Positions;
};

export const DrcTabs = ({ positions }: DrcTabsProps) => {
  const { tab, setTab } = usePositionStore((state) => ({
    tab: state.tab,
    setTab: state.setTab,
  }));

  return (
    <>
      <div
        className={`lg:h-auto lg:pt-0 lg:pb-10 max-h-[44rem] py-4 w-full px-5 overflow-y-auto`}
      >
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="Unfilled Positions"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all positions that are for DRC setting"
            notificationCount={
              !isEmpty(positions.unfilled) ? positions.unfilled.length : 0
            }
            className="bg-red-500"
          />

          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              setTab(2);
            }}
            title="Filled positions"
            icon={<HiCheck size={26} />}
            subtitle="Show all filled positions with DRCs"
            notificationCount={
              !isEmpty(positions.filled) ? positions.filled.length : 0
            }
            className="bg-gray-500"
          />
        </ul>
      </div>
    </>
  );
};
