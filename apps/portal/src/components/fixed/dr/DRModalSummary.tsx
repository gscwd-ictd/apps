import React, { useContext } from 'react';
import { HiBadgeCheck, HiPuzzle } from 'react-icons/hi';
import { DRContext } from '../../../context/contexts';
import { useDrStore } from '../../../store/dr.store';
import { TableConfirmation } from './TableConfirmation';

export const DRModalSummary = () => {
  // get the values from context
  // const { selectedPosition, selectedDRCs } = useContext(DRContext);
  const selectedPosition = useDrStore((state) => state.selectedPosition)
  const selectedDRCs = useDrStore((state) => state.selectedDRCs)


  return (
    <>
      <div className="flex flex-col w-full px-5 pt-2 rounded mb-5">
        <div className="h-[42rem] overflow-y-hidden overflow-x-hidden">
          <div className='flex grid-cols-2 justify-between text-gray-500'>
            <div className='col-span-1'>
              <div className="text-xl font-semibold ">{selectedPosition.positionTitle}</div>
              <div className="font-normal text-sm ">{selectedPosition.itemNumber}</div>
            </div>
            <div className='col-span-1'>
              {/* <div className="text-2xl font-normal text-gray-500">Summary</div> */}
            </div>
          </div>
          <div className='text-gray-500'>
            <p className="mt-9 font-normal text-md  flex items-center pb-2">Core Duties & Responsibilities <HiBadgeCheck size={20} fill='#09800f' /></p>
            <div className="w-full rounded bg-slate-50 h-[14rem] border-2 border-hidden overflow-y-visible overflow-x-hidden">
              {selectedDRCs.core.length > 0 ? <><TableConfirmation array={selectedDRCs.core} /><div className='flex justify-center text-xl'>*** Nothing Follows ***</div></> : <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl font-normal text-gray-300">No core duties & responsibilities</h1>
              </div>}

            </div>

            <p className="mt-9 font-normal text-md  flex items-center pb-2">Support Duties & Responsibilities <HiBadgeCheck size={20} fill='#09800f' /></p>
            <div className="w-full rounded bg-slate-50 h-[14rem] border-hidden border-2 overflow-y-visible overflow-x-hidden ">
              {selectedDRCs.support.length > 0 ? <><TableConfirmation array={selectedDRCs.support} /><div className='flex justify-center text-xl'>*** Nothing Follows ***</div></> : <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl font-normal text-gray-300">No support duties & responsibilities</h1>
              </div>}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
