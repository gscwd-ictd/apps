import React, { FunctionComponent } from 'react';
import { usePrfStore } from '../../../../store';
import { Position } from '../../../../types/prf.types';
import { Checkbox } from '../../../modular/forms/Checkbox';
import { PositionCard } from './PositionCard';

type SelectionsProps = {
  positions: Array<Position>;
};

export const SelectedPositions = () => {
  // access current value of selected positions
  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  return (
    <>
      <div className="bg-slate-50 bg-opacity-50 w-full h-full pb-5">
        {selectedPositions.length === 0 ? <EmptySelection /> : <Selections positions={selectedPositions} />}
      </div>
    </>
  );
};

const Selections: FunctionComponent<SelectionsProps> = ({ positions }) => {
  // access with exam from store
  const withExam = usePrfStore((state) => state.withExam);

  // access function setWithExam from store to control the value
  const setWithExam = usePrfStore((state) => state.setWithExam);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end px-10 my-2">
        <Checkbox
          checkboxId="with-exam"
          label="Require examination"
          checked={withExam}
          onChange={() => setWithExam(!withExam)}
        />
      </div>
      <div className="overflow-y-auto overflow-x-auto w-full h-full">
        {positions.map((position: Position, index: number) => {
          return (
            <React.Fragment key={index}>
              <PositionCard position={position} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const EmptySelection: FunctionComponent = () => {
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <h1 className="text-3xl font-bold text-gray-300">No requested position</h1>
      </div>
    </>
  );
};
