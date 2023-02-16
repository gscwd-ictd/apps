import { useContext, FormEvent, useEffect, useState, useRef, MutableRefObject } from 'react';
import { HiOutlineSearch, HiOutlineXCircle, HiSearch, HiXCircle } from 'react-icons/hi';
import { PrfContext } from '../../../context/contexts';
import { Position } from '../../../types/position.type';
import { PositionRequest } from '../../../types/prf.type';
import { UndrawInboxCleanup } from '../undraw/InboxCleanup';
import { UndrawOnlinePayments } from '../undraw/OnlinePayments';
import { UndrawSelecting } from '../undraw/Selecting';
import { AllPositionsList } from './AllPositionsList';
import { SelectedPositionCard } from './SelectedPositionCard';

type SelectPositionsProps = {
  allPositions: Array<Position>;
};

export const PrfModalSelectPositions = ({ allPositions }: SelectPositionsProps) => {
  // initialize state for positions
  const {
    error,
    selectedPositions,
    prfDetails,
    filteredPositions,
    searchValue,
    setSearchValue,
    setFilteredPositions,
    setPrfDetails,
    setError,
  } = useContext<PositionRequest>(PrfContext);

  // initialze ref for search input
  const searchRef = useRef(null) as unknown as MutableRefObject<HTMLInputElement>;

  // initialize ref for date needed input
  const dateRef = useRef(null) as unknown as MutableRefObject<HTMLInputElement>;

  // set focus whenever filtered positions change
  useEffect(() => searchRef.current.focus(), [filteredPositions]);

  useEffect(() => {
    error.errorMessage === 'Please specify the date needed' && dateRef.current.focus();
  }, [error]);

  useEffect(() => {
    if (selectedPositions.length === 0) setPrfDetails({ dateNeeded: '', isExamRequired: false });
  }, [selectedPositions]);

  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    var filteredResult: Array<Position> = [];

    // loop through positions array and filter according to position title
    allPositions.filter((position: Position) => {
      // check if there is a match
      if (position.positionTitle.match(new RegExp(value, 'i'))) {
        // insert the matching position inside filtered result
        filteredResult.push(position);
      }
    });

    // set search value to current value of the search input
    setSearchValue(value);

    // update the state of the filtered positions
    setFilteredPositions(filteredResult);
  };

  const onClearSearch = () => {
    // set focus on the search input
    searchRef.current.focus();

    // set the search value back to default
    setSearchValue('');

    // set filtered positions back to default
    setFilteredPositions(allPositions);
  };

  return (
    <>
      <div className="grid grid-cols-5 mb-5">
        <section className="col-span-2">
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {selectedPositions.length} out of {allPositions.length} positions selected
            </p>
          </div>
          <div className="relative px-3 mt-2 mb-5">
            <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
            <input
              ref={searchRef}
              value={searchValue}
              onChange={(event) => onSearch(event)}
              type="text"
              className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
              placeholder="Search for a position"
            ></input>
            {searchValue !== '' ? (
              <>
                <button className="absolute -right-0 mr-7 focus:outline-none" onClick={onClearSearch}>
                  <HiXCircle className="w-6 h-6 mt-3 transition-colors ease-in-out text-slate-300 hover:text-slate-400" />
                </button>
              </>
            ) : null}
          </div>

          <div className="h-[28rem] overflow-y-scroll">
            {filteredPositions.length === 0 ? (
              <div className="flex justify-center h-full pt-5 text-center">
                <h5 className="text-2xl font-medium text-gray-300">No results found for "{searchValue}"</h5>
              </div>
            ) : (
              <AllPositionsList />
            )}
          </div>
        </section>

        <section className="col-span-3 max-h-[34rem] bg-slate-50 bg-opacity-50 px-5 pt-5">
          {selectedPositions.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                <UndrawOnlinePayments width={250} height={250} />
                <h1 className="text-2xl text-gray-300">Select at least 1 position to proceed.</h1>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-10 mb-5">
              <div>
                <label htmlFor="date-needed" className={`mr-2 ${error.isError ? 'text-red-600' : 'text-gray-800'}`}>
                  {error.isError ? `${error.errorMessage}:` : 'Date Needed:'}
                </label>
                <input
                  ref={dateRef}
                  id="date-needed"
                  value={prfDetails.dateNeeded}
                  onChange={(e) => {
                    setPrfDetails({ ...prfDetails, dateNeeded: e.target.value });
                    setError({ isError: false, errorMessage: '' });
                  }}
                  type="date"
                  placeholder="Date needed:"
                  className={`${
                    error.isError ? 'border-red-500 focus:border-red-500 focus:ring focus:ring-red-100' : 'border-gray-200'
                  } cursor-pointer rounded py-1 text-gray-700`}
                ></input>
              </div>

              <div>
                <input
                  checked={prfDetails.isExamRequired}
                  onChange={() => setPrfDetails({ ...prfDetails, isExamRequired: !prfDetails.isExamRequired })}
                  type="checkbox"
                  id="remember-me"
                  className="p-2 transition-colors border-2 border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
                ></input>
                <label className="ml-2 text-gray-800 cursor-pointer select-none border-gray" htmlFor="remember-me">
                  with examination
                </label>
              </div>
            </div>
          )}
          {selectedPositions.length > 0 && (
            <div className="h-[28rem] w-full overflow-y-scroll px-2 pt-1">
              <SelectedPositionCard />
            </div>
          )}
        </section>
      </div>
    </>
  );
};
