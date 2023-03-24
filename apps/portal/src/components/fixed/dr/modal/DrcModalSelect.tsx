/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { DutyResponsibility } from 'apps/portal/src/types/dr.type';
import { FormEvent, MutableRefObject, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';
import { UndrawSelecting } from '../../undraw/Selecting';
import { DrcAllDrcsList } from './DrcAllDrcsList';
import { DrcSelectedDrcCard } from './DrcSelectedDrcCard';

export const DrcModalSelect = (): JSX.Element => {
  const {
    availableDnrs,
    filteredAvailableDnrs,
    filteredDnrValue,
    checkedDnrs,
    selectedDrcType,
    setAvailableDnrs,
    setFilteredAvailableDnrs,
    setFilteredDnrValue,
  } = useDnrStore((state) => ({
    availableDnrs: state.availableDnrs,
    filteredDnrValue: state.filteredDnrValue,
    filteredAvailableDnrs: state.filteredAvailableDnrs,
    checkedDnrs: state.checkedDnrs,
    setAvailableDnrs: state.setAvailableDnrs,
    setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
    setFilteredDnrValue: state.setFilteredDnrValue,
    selectedDrcType: state.selectedDrcType,
  }));

  // initialize ref for search input
  const searchValueRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  // set focus whenever filtered drs change
  useEffect(() => {
    searchValueRef.current.focus();
  }, [filteredAvailableDnrs]);

  // search
  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<DutyResponsibility> = [];

    // loop through dr array and filter according to dr description
    availableDnrs.filter((dr: DutyResponsibility) => {
      // check if there is a match
      if (dr.description.match(new RegExp(value, 'i'))) {
        // insert the matching description inside the filtered result
        filteredResult.push(dr);
      }
    });
    // set search value to current value of the search input
    setFilteredDnrValue(value);

    // update the state of the filtered DRs
    setFilteredAvailableDnrs(filteredResult);
  };

  const onClearSearch = () => {
    // set focus on the search input
    searchValueRef.current.focus();

    // set the search value back to default
    setFilteredDnrValue('');

    // set filtered dr back to the current core pool
    setFilteredAvailableDnrs(availableDnrs);
  };

  useEffect(() => {
    searchValueRef.current.value = filteredDnrValue;
  }, [filteredAvailableDnrs]);

  useEffect(() => {
    setFilteredDnrValue('');
  }, []);

  return (
    <>
      <div className="grid grid-cols-5 mb-5">
        <section className="col-span-2">
          <div className="flex justify-between px-3 mb-1 text-sm">
            <p className="font-medium text-gray-500 uppercase">
              {selectedDrcType}
            </p>
            {selectedDrcType === 'core' && (
              <p className="text-gray-600">
                {checkedDnrs.core.length} out of {availableDnrs.length} items
                selected
              </p>
            )}
            {selectedDrcType === 'support' && (
              <p className="text-gray-600">
                {checkedDnrs.support.length} out of {availableDnrs.length} items
                selected
              </p>
            )}
          </div>
          <div className="relative px-3 mt-2 mb-5">
            <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
            <input
              ref={searchValueRef}
              value={filteredDnrValue}
              onChange={(event) => onSearch(event)}
              type="text"
              className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
              placeholder="Search for a position"
            ></input>
            {filteredDnrValue !== '' ? (
              <>
                <button
                  className="absolute -right-0 mr-7 focus:outline-none"
                  onClick={onClearSearch}
                >
                  <HiXCircle className="w-6 h-6 mt-3 transition-colors ease-in-out text-slate-300 hover:text-slate-400" />
                </button>
              </>
            ) : null}
          </div>

          <div className="h-[28rem] overflow-y-auto">
            {filteredAvailableDnrs.length === 0 ? (
              <div className="flex justify-center h-full pt-5 text-center">
                <h5 className="text-2xl font-medium text-gray-300">{`No results found for '${filteredDnrValue}'`}</h5>
              </div>
            ) : (
              <DrcAllDrcsList />
            )}
          </div>
        </section>
        <section className="col-span-3 h-[34rem] bg-slate-50 bg-opacity-50 px-5 pt-5">
          {(selectedDrcType === 'core' && checkedDnrs.core.length === 0) ||
          (selectedDrcType === 'support' &&
            checkedDnrs.support.length === 0) ? (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                <UndrawSelecting width={250} height={250} />
                <h1 className="text-2xl text-gray-300">
                  Select at least 1 duty & responsibility to proceed.
                </h1>
              </div>
            </>
          ) : (selectedDrcType === 'core' && checkedDnrs.core.length > 0) ||
            (selectedDrcType === 'support' &&
              checkedDnrs.support.length > 0) ? (
            <>
              <div className="h-[34rem] w-full overflow-y-auto px-2 pt-1">
                {/* <SelectedDRCard /> */}
                <DrcSelectedDrcCard />
              </div>
            </>
          ) : null}
        </section>
      </div>
    </>
  );
};
