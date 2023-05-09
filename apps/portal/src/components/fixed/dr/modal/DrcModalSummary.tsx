/* eslint-disable @nx/enforce-module-boundaries */
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
        <div className="min-h-[42rem]">
          <section className="flex justify-between grid-cols-2 text-gray-500">
            <div className="col-span-1">
              <div className="text-xl font-semibold ">
                {selectedPosition.positionTitle}
              </div>
              <div className="text-sm font-normal ">
                {selectedPosition.itemNumber}
              </div>
            </div>
          </section>
          <section className="text-gray-500">
            <p className="flex items-center pb-2 font-normal mt-9 text-md">
              Core Duties, Responsibilities, & Competencies
              <HiBadgeCheck size={20} fill="#09800f" />
            </p>
            <div className="flex justify-center rounded bg-slate-50 min-h-[14rem]">
              {selectedDnrs.core.length > 0 ? (
                <div className="flex flex-col justify-between w-full">
                  <TableConfirmation array={selectedDnrs.core} />
                  <div className="flex justify-center text-xl">
                    *** Nothing Follows ***
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-normal text-gray-300">
                    No core duties, responsibilities, & competencies
                  </h1>
                </div>
              )}
            </div>
          </section>
          <section className="text-gray-500">
            <p className="flex items-center pb-2 font-normal mt-9 text-md">
              Support Duties, Responsibilities, & Competencies
              <HiBadgeCheck size={20} fill="#09800f" />
            </p>
            <div className="flex flex-wrap justify-center rounded bg-slate-50 min-h-[14rem]">
              {selectedDnrs.support.length > 0 ? (
                <div className="flex flex-col justify-between w-full">
                  <TableConfirmation array={selectedDnrs.support} />
                  <div className="flex justify-center text-xl">
                    *** Nothing Follows ***
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-normal text-gray-300">
                    No support duties, responsibilities, & competencies
                  </h1>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
