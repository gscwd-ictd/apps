/* eslint-disable @nx/enforce-module-boundaries */

import { UndrawSelecting } from '../../undraw/Selecting';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';
import { DrcLeftAdd } from '../DrcLeftAdd';
import { DrcUpdatedSelectedCard } from './DrcUpdatedSelectedCard';

export const DrcModalAddDrc = (): JSX.Element => {
  const { tempAddedDrcs, selectedDrcType } = useUpdatedDrcStore((state) => ({
    tempAddedDrcs: state.tempAddedDrcs,
    selectedDrcType: state.selectedDrcType,
  }));

  return (
    <>
      <div className="grid grid-cols-1 mb-5 lg:grid-cols-12">
        <section className="h-full col-span-1 px-6 lg:col-span-6">
          <div className="flex justify-between px-3 mb-1 text-sm">
            <p className="font-medium text-gray-500 uppercase">{selectedDrcType}</p>
          </div>

          <DrcLeftAdd />
        </section>
        {/* RIGHT PART OF THE PAGE */}

        <section className="col-span-1 lg:col-span-6 h-[34rem] bg-opacity-50 px-5 pt-5">
          {(selectedDrcType === 'core' && tempAddedDrcs.core.length === 0) ||
          (selectedDrcType === 'support' && tempAddedDrcs.support.length === 0) ? (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                <UndrawSelecting width={250} height={250} />
                <h1 className="text-2xl text-gray-300">Add at least 1 duty & responsibility to proceed.</h1>
              </div>
            </>
          ) : (selectedDrcType === 'core' && tempAddedDrcs.core.length > 0) ||
            (selectedDrcType === 'support' && tempAddedDrcs.support.length > 0) ? (
            <>
              <div className="h-[34rem] w-full overflow-y-scroll px-1 pt-1">
                {/* <SelectedDRCard /> */}
                {/* <DrcSelectedDrcCard /> */}
                <DrcUpdatedSelectedCard />
              </div>
            </>
          ) : null}
        </section>
      </div>
    </>
  );
};
