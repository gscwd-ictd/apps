import React, {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePrfStore } from '../../../../store/prf.store';
import { Position } from '../../../../types/prf.types';
import { Checkbox } from '../../../modular/forms/Checkbox';
import { TextField } from '../../../modular/forms/TextField';
import { List } from '../../../modular/html/List';

import { PositionCounter } from './PositionCounter';

type FilteredListProps = {
  positions: Array<Position>;
  filteredPositions: Array<Position>;
};

type EmptySearchResultProps = {
  searchValue: string;
};

export const PositionsList: FunctionComponent = () => {
  // set local state to hold the value of current search value
  const [searchValue, setSearchValue] = useState('');

  // access positions array fom store
  const positions = usePrfStore((state) => state.positions);

  // access selected positions array from store
  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  // access filtered positions array from store
  const filteredPositions = usePrfStore((state) => state.filteredPositions);

  // access function to set selected positions in the store
  const setSelectedPositions = usePrfStore(
    (state) => state.setSelectedPositions
  );

  // access function to set filtered positions in the store
  const setFilteredPositions = usePrfStore(
    (state) => state.setFilteredPositions
  );

  // update selected positions
  useEffect(() => setSelectedPositions(positions), [positions]);

  const onSearch = (searchValue: string) => {
    // create an array that will contain the search results
    const filteredResult: Array<Position> = [];

    // loop through positions array and filter according to position title
    positions.filter((position: Position) => {
      // check if there is a match
      if (position.positionTitle.match(new RegExp(searchValue, 'i')))
        filteredResult.push(position);
    });

    // set search value to current value of the search input
    setSearchValue(searchValue);

    // update the state of the filtered poisitions
    setFilteredPositions(filteredResult);
  };

  return (
    <>
      <div className="flex flex-col h-full gap-3">
        <div className="px-4 space-y-1">
          <section className="flex justify-end">
            <PositionCounter
              positions={positions}
              selectedPositions={selectedPositions}
            />
          </section>

          <section>
            <TextField
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </section>
        </div>

        {filteredPositions.length === 0 ? (
          <EmptySearchResult searchValue={searchValue} />
        ) : (
          <FilteredList
            positions={positions}
            filteredPositions={filteredPositions}
          />
        )}
      </div>
    </>
  );
};

const FilteredList: FunctionComponent<FilteredListProps> = ({
  positions,
  filteredPositions,
}) => {
  // access function to update positions in the store
  const updatePositions = usePrfStore((state) => state.updatePositions);

  return (
    <div className="overflow-y-scroll">
      <ul>
        {filteredPositions.map((position: Position, index: number) => {
          return (
            <React.Fragment key={index}>
              <div
                onClick={() => updatePositions(positions, position.sequenceNo)}
                className="hover:bg-slate-50 rounded-md px-5 flex items-center justify-between cursor-pointer border-b border-b-gray-100"
              >
                <List
                  title={`${position.positionTitle}`}
                  subtitle={`${position.designation}`}
                />
                <Checkbox
                  checkboxId={`position-${index}`}
                  checked={position.isSelected}
                  onChange={() => null}
                />
              </div>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

const EmptySearchResult: FunctionComponent<EmptySearchResultProps> = ({
  searchValue,
}) => {
  return (
    <>
      <div className="flex justify-center text-center w-full h-full overflow-x-hidden px-10">
        {/*eslint-disable-next-line react/no-unescaped-entities*/}
        <h3 className="text-gray-300 font-semibold text-lg">
          No search result found for {searchValue}
        </h3>
      </div>
    </>
  );
};
