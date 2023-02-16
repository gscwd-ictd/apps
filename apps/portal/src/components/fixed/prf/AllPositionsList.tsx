import { useContext } from 'react';
import { PrfContext } from '../../../context/contexts';
import { Position } from '../../../types/position.type';

export const AllPositionsList = (): JSX.Element => {
  // get all related state from prf context
  const { allPositions, prfDetails, selectedPositions, filteredPositions, setAllPositions, setSelectedPositions, setError } = useContext(PrfContext);

  const onSelect = (index: number | undefined) => {
    // copy the current state of positions
    const updatedPositions = [...allPositions];

    // loop through all the positions
    updatedPositions.map((position: Position, positionIndex: number) => {
      // check if a particular position's index is selected
      if (index === positionIndex) {
        // reverse the current value of the position state
        position.state = !position.state;

        // if state is false, set remarks to empty
        if (!position.state) position.remarks = '';
      }
    });

    // set error message to empty
    if (prfDetails.dateNeeded !== '' || selectedPositions.length === 0) setError({ isError: false, errorMessage: '' });

    //  set positions state
    setAllPositions(updatedPositions);

    // select this position if it is checked
    addToSelectedPositions();
  };

  const addToSelectedPositions = () => {
    // create an empty array of positions
    const selectedPositions: Array<Position> = [];

    // map all positions
    allPositions.map((position: Position) => {
      // add this position if it is checked
      position.state && selectedPositions.push(position);
    });

    // set selected positions state
    setSelectedPositions(selectedPositions);
  };

  return (
    <>
      <ul>
        {filteredPositions &&
          filteredPositions.map((position: Position, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(position.sequenceNo)}
                className="flex cursor-pointer items-center justify-between border-b border-l-[5px] border-b-gray-100 border-l-transparent p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <h1 className="font-medium text-gray-600">{position.positionTitle}</h1>
                  <p className="text-sm text-gray-500">{position.itemNumber}</p>
                  {/* <p className="text-sm text-gray-400">{position.designation}</p> */}
                </div>

                <input
                  checked={position.state}
                  onChange={() => (position: Position) => {
                    position.state;
                    setError({ isError: false, errorMessage: '' });
                    addToSelectedPositions();
                  }}
                  type="checkbox"
                  className="mr-2 cursor-pointer rounded-sm border-2 border-gray-300 p-2 transition-colors checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
                ></input>
                {/* <p className="text-xs text-gray-600">{position.itemNumber}</p> */}
              </li>
            );
          })}
      </ul>
    </>
  );
};
