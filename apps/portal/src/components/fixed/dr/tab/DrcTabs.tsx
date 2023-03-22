/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { HiCheck, HiOutlineCheckCircle } from 'react-icons/hi';
import { TabHeader } from '../../tab/TabHeader';

export const DrcTabs = () => {
  // const setTab = useDrStore((state) => state.setTab);

  const { tab, setTab } = usePositionStore((state) => ({
    tab: state.tab,
    setTab: state.setTab,
  }));

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

  useEffect(() => {
    console.log(filledPositions);
  }, [filledPositions]);

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
                !isEmpty(unfilledPositions) ? unfilledPositions.length : 0
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
              notificationCount={
                !isEmpty(filledPositions) ? filledPositions.length : 0
              }
              className="bg-gray-500"
            />
          )}
        </ul>
      </div>
    </>
  );
};
