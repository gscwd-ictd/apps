import { FunctionComponent, useEffect, useState } from 'react';
import { Position } from '../../../../types/prf.types';

type PositionCounterProps = {
  positions: Array<Position>;
  selectedPositions: Array<Position>;
};

export const PositionCounter: FunctionComponent<PositionCounterProps> = ({ positions, selectedPositions }) => {
  // set state to hold the length of positions array
  const [positionsCount, setPositionsCount] = useState(0);

  // set state to hold the length of all selected positions
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    // set positions count to the length of positions array
    setPositionsCount(positions.length);

    // set selected positions count to the length of selected positions array
    setSelectedCount(selectedPositions.length);

    // set dependencies for this side effect
  }, [positions, selectedPositions]);

  return (
    <>
      <p className="text-xs text-gray-500">
        {selectedCount === 0 ? (
          'Select a position you wish to request'
        ) : (
          <>
            {selectedCount} out of {positionsCount} {positionsCount > 1 ? 'positions' : 'position'}{' '}
            {selectedCount > 1 ? 'are' : 'is'} selected
          </>
        )}
      </p>
    </>
  );
};
