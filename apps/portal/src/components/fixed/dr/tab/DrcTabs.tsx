/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { HiCheck, HiOutlineCheckCircle } from 'react-icons/hi';
import { TabHeader } from '../../tab/TabHeader';

type DrcTabsProps = {
  tab: number;
};

export const DrcTabs = ({ tab }: DrcTabsProps) => {
  // const setTab = useDrStore((state) => state.setTab);

  const setTab = usePositionStore((state) => state.setTab);

  const {
    unfilledPositions,
    filledPositions,
    loadingFilledPositions,
    loadingUnfilledPositions,
  } = usePositionStore((state) => ({
    filledPositions: state.unfilledPositions,
    unfilledPositions: state.unfilledPositions,
    loadingUnfilledPositions: state.loading.loadingUnfilledPositions,
    loadingFilledPositions: state.loading.loadingFilledPositions,
  }));

  return (
    <>
      <div className="w-full h-[44rem] px-5 overflow-y-auto">
        <ul className="flex flex-col text-gray-500">
          {loadingUnfilledPositions ? (
            <LoadingSpinner size="md" />
          ) : (
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
                unfilledPositions ? unfilledPositions.length : 0
              }
              className="bg-red-500"
            />
          )}
          {loadingFilledPositions ? (
            <LoadingSpinner size="md" />
          ) : (
            <TabHeader
              tab={tab}
              tabIndex={2}
              onClick={() => {
                setTab(2);
              }}
              title="Filled positions"
              icon={<HiCheck size={26} />}
              subtitle="Show all filled positions with DRCs"
              notificationCount={filledPositions ? filledPositions.length : 0}
              className="bg-gray-500"
            />
          )}
        </ul>
      </div>
    </>
  );
};
