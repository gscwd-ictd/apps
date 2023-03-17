/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';

export const DrcModalSetting = () => {
  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));
  const { originalPoolOfDnrs, availableDnrs } = useDnrStore((state) => ({
    originalPoolOfDnrs: state.originalPoolOfDnrs,
    availableDnrs: state.availableDnrs,
  }));

  return (
    <div className="h-auto px-5 rounded">
      <div className="flex flex-col pt-2 mb-8 font-semibold text-gray-500">
        <span className="text-xl text-slate-500">
          {selectedPosition.positionTitle}
        </span>
        <span className="text-sm font-normal">
          {selectedPosition.itemNumber}
        </span>
        {/** HERE */}
      </div>
    </div>
  );
};
