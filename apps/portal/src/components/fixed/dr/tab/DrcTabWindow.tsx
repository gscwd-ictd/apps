/* eslint-disable @nx/enforce-module-boundaries */
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { AllDrcPositionsListTab } from './AllDrcPositionsListTab';

export const DrcTabWindow = () => {
  // use position store
  const { filledPositions, unfilledPositions, filledIsLoading, unfilledIsLoading } = usePositionStore((state) => ({
    unfilledPositions: state.unfilledPositions,
    filledPositions: state.filledPositions,
    unfilledIsLoading: state.loading.loadingUnfilledPositions,
    filledIsLoading: state.loading.loadingFilledPositions,
    getFilledDrcPositions: state.getFilledDrcPositions,
    getFilledDrcPositionsSuccess: state.getFilledDrcPositionsSuccess,
    getFilledDrcPositionsFail: state.getFilledDrcPositionsFail,
    getUnfilledDrcPositions: state.getUnfilledDrcPositions,
    getUnfilledDrcPositionsSuccess: state.getUnfilledDrcPositionsSuccess,
    getUnfilledDrcPositionsFail: state.getUnfilledDrcPositionsFail,
  }));

  // use modal store
  const tab = usePositionStore((state) => state.tab);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[30rem] overflow-y-auto">
        {tab === 1 &&
          (unfilledIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <AllDrcPositionsListTab positions={unfilledPositions} tab={tab} />
          ))}
        {tab === 2 &&
          (filledIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <AllDrcPositionsListTab positions={filledPositions} tab={tab} />
          ))}
      </div>
    </>
  );
};
