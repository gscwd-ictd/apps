import { FormEvent, MutableRefObject, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';
import { useDrStore } from '../../../store/dr.store';
import { Position } from '../../../types/position.type';
import { AllDRPositionsList } from './AllDRPositionsList';

type SelectPositionsProps = {
  allPositions: Array<Position>;
};

export const DRModalSelectPositions = ({
  allPositions,
}: SelectPositionsProps): JSX.Element => {
  const filteredPositions = useDrStore((state) => state.filteredPositions);
  const searchValue = useDrStore((state) => state.searchValue);
  const setDrcPoolIsEmpty = useDrStore((state) => state.setDrcPoolIsEmpty);
  const setDRCIsLoaded = useDrStore((state) => state.setDRCisLoaded);
  const setOriginalPool = useDrStore((state) => state.setOriginalPool);
  // const setAction = useDrStore((state) => state.setAction);
  const setFilteredPositions = useDrStore(
    (state) => state.setFilteredPositions
  );
  const setSearchValue = useDrStore((state) => state.setSearchValue);

  // initialize ref for search input
  const searchRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  // set focus whenever filtered positions change
  useEffect(() => searchRef.current.focus(), [filteredPositions]);

  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<Position> = [];

    // loop through positions array and filter according to position title
    allPositions.filter((position: Position) => {
      // check if there is a match
      if (position.positionTitle!.match(new RegExp(value, 'i'))) {
        // insert the matching position inside the filtered result
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

    // set the filtered positions back to default
    setFilteredPositions(allPositions);
  };

  useEffect(() => {
    // set search value to default
    setSearchValue('');

    // set drc is loaded to false
    setDRCIsLoaded(false);

    // set pool is empty to default
    setDrcPoolIsEmpty(false);

    // set original pool to zero
    setOriginalPool([]);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full mb-5">
        <section>
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {allPositions.length} pending{' '}
              {allPositions.length < 1 ? 'position' : 'positions'}
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
            />
            {searchValue !== '' ? (
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

          <div className="h-[28rem] overflow-y-scroll">
            {filteredPositions.length === 0 ? (
              <div className="flex justify-center h-full pt-5 text-center">
                <h5 className="text-2xl font-medium text-gray-300">{`No results found for '${searchValue}'`}</h5>
              </div>
            ) : (
              <AllDRPositionsList />
            )}
          </div>
        </section>
      </div>
    </>
  );
};
