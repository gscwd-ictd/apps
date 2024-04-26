/* eslint-disable @nx/enforce-module-boundaries */

import { UndrawSelecting } from '../../undraw/Selecting';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';
import { DrcLeftAdd } from '../DrcLeftAdd';
import { DrcUpdatedSelectedCard } from './DrcUpdatedSelectedCard';

export const DrcModalAddDrc = (): JSX.Element => {
  // const {
  //   availableDnrs,
  //   filteredAvailableDnrs,
  //   filteredDnrValue,
  //   checkedDnrs,
  //   selectedDrcType,
  //   setAvailableDnrs,
  //   setFilteredAvailableDnrs,
  //   setFilteredDnrValue,
  // } = useDnrStore((state) => ({
  //   availableDnrs: state.availableDnrs,
  //   filteredDnrValue: state.filteredDnrValue,
  //   filteredAvailableDnrs: state.filteredAvailableDnrs,
  //   checkedDnrs: state.checkedDnrs,
  //   setAvailableDnrs: state.setAvailableDnrs,
  //   setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
  //   setFilteredDnrValue: state.setFilteredDnrValue,
  //   selectedDrcType: state.selectedDrcType,
  // }));

  const { tempAddedDrcs, selectedDrcType } = useUpdatedDrcStore((state) => ({
    tempAddedDrcs: state.tempAddedDrcs,
    selectedDrcType: state.selectedDrcType,
  }));

  // initialize ref for search input
  // const searchValueRef = useRef(null) as unknown as MutableRefObject<HTMLInputElement>;

  // set focus whenever filtered drs change
  // useEffect(() => {
  //   searchValueRef.current.focus();
  // }, [filteredAvailableDnrs]);

  return (
    <>
      <div className="grid grid-cols-1 mb-5 lg:grid-cols-6">
        <section className="h-full col-span-1 px-5 lg:col-span-3">
          <div className="flex justify-between px-3 mb-1 text-sm">
            <p className="font-medium text-gray-500 uppercase">{selectedDrcType}</p>
            {/* {selectedDrcType === 'core' && (
              <p className="text-gray-600">
                {checkedDnrs.core.length} out of {availableDnrs.length} items
              </p>
            )}
            {selectedDrcType === 'support' && (
              <p className="text-gray-600">
                {checkedDnrs.support.length} out of {availableDnrs.length} items
              </p>
            )} */}
          </div>
          {/* SEARCH BAR */}
          {/* <div className="relative px-3 mt-2 mb-5">
            <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
            <input
              ref={searchValueRef}
              value={filteredDnrValue}
              onChange={(event) => onSearch(event)}
              type="text"
              className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
              placeholder="Search for duties and responsibilities"
            ></input>
            {filteredDnrValue !== '' ? (
              <>
                <button className="absolute -right-0 mr-7 focus:outline-none" onClick={onClearSearch}>
                  <HiXCircle className="w-6 h-6 mt-3 transition-colors ease-in-out text-slate-300 hover:text-slate-400" />
                </button>
              </>
            ) : null}
          </div> */}
          {/* <div className="h-auto lg:h-[28rem] w-full overflow-y-auto">
            {filteredAvailableDnrs.length === 0 ? (
              <div className="flex justify-center h-full pt-5 text-center">
                <h5 className="text-2xl font-medium text-gray-300">{`No results found for '${filteredDnrValue}'`}</h5>
              </div>
            ) : (
              <DrcAllDrcsList />
            )}
          </div> */}
          <DrcLeftAdd />
        </section>
        {/* RIGHT PART OF THE PAGE */}

        <section className="col-span-1 lg:col-span-3 h-[34rem] bg-opacity-50 px-5 pt-5">
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
              <div className="h-[34rem] w-full overflow-y-scroll px-2 pt-1">
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
