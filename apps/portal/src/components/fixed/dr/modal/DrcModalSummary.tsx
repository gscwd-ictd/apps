/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import React from 'react';
import { HiBadgeCheck } from 'react-icons/hi';
import { TableConfirmation } from '../TableConfirmation';

export const DrcModalSummary = () => {
  const selectedDnrs = useDnrStore((state) => state.selectedDnrs);
  const selectedPosition = usePositionStore((state) => state.selectedPosition);

  return (
    <>
      <div className="flex flex-col w-full px-5 pt-2 mb-5 rounded">
        <div className="h-[42rem] overflow-y-hidden overflow-x-hidden">
          <div className="flex justify-between grid-cols-2 text-gray-500">
            <div className="col-span-1">
              <div className="text-xl font-semibold ">
                {selectedPosition.positionTitle}
              </div>
              <div className="text-sm font-normal ">
                {selectedPosition.itemNumber}
              </div>
            </div>
            <div className="col-span-1">
              {/* <div className="text-2xl font-normal text-gray-500">Summary</div> */}
            </div>
          </div>
          <div className="text-gray-500">
            <p className="flex items-center pb-2 font-normal mt-9 text-md">
              Core Duties & Responsibilities{' '}
              <HiBadgeCheck size={20} fill="#09800f" />
            </p>
            <div className="w-full rounded bg-slate-50 h-[14rem] border-2 border-hidden overflow-y-visible overflow-x-hidden">
              {selectedDnrs.core.length > 0 ? (
                <>
                  <TableConfirmation array={selectedDnrs.core} />
                  <div className="flex justify-center text-xl">
                    *** Nothing Follows ***
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-2xl font-normal text-gray-300">
                    No core duties, responsibilities, & competencies
                  </h1>
                </div>
              )}
            </div>

            <p className="flex items-center pb-2 font-normal mt-9 text-md">
              Support Duties & Responsibilities{' '}
              <HiBadgeCheck size={20} fill="#09800f" />
            </p>
            <div className="w-full rounded bg-slate-50 h-[14rem] border-hidden border-2 overflow-y-visible overflow-x-hidden ">
              {selectedDnrs.support.length > 0 ? (
                <>
                  <TableConfirmation array={selectedDnrs.support} />
                  <div className="flex justify-center text-xl">
                    *** Nothing Follows ***
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-2xl font-normal text-gray-300">
                    No support duties, responsibilities, & competencies
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
