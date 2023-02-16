import { FormEvent, useContext } from 'react';
import { HiOutlineDocumentDuplicate, HiOutlineX } from 'react-icons/hi';
import { PrfContext } from '../../../context/contexts';
import { Position } from '../../../types/position.type';
import { RemarksMenuDropdown } from './RemarksMenuDropdown';

export const SelectedPositionCard = (): JSX.Element => {
  const { selectedPositions, setSelectedPositions } = useContext(PrfContext);

  const handleRemove = (positionIndexToRemove: number) => {
    // create a copy of selected positions
    const updatedSelectedPositions = [...selectedPositions];

    // loop through the copy of selected positions
    updatedSelectedPositions.map((position: Position, index: number) => {
      // set the state of selected position to remove into false
      if (index === positionIndexToRemove) {
        // set state value to default
        position.state = false;

        // set remarks value to default
        position.remarks = '';
      }
    });

    // remove the selected position
    updatedSelectedPositions.splice(positionIndexToRemove, 1);

    // set the new value of selected positions
    setSelectedPositions(updatedSelectedPositions);
  };

  const handleRemarks = (event: FormEvent<HTMLInputElement>, positionRemarksIndex: number) => {
    // create a copy of selected positions
    var updatedSelectedPositions = [...selectedPositions];

    // loop through the copy of selected positions
    updatedSelectedPositions.map((position: Position, index: number) => {
      // check if position remarks index is the current index of this loop
      if (index === positionRemarksIndex) position.remarks = event.currentTarget.value;
    });

    // set the new value of selected positions
    setSelectedPositions(updatedSelectedPositions);
  };

  return (
    <>
      {selectedPositions &&
        selectedPositions.map((position: Position, index: number) => {
          return (
            <div className="p-5 mb-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100" key={index}>
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                  <HiOutlineDocumentDuplicate className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h5 className="text-lg">{position.positionTitle}</h5>
                    <p className="text-sm text-gray-500 upperca">{position.designation}</p>
                  </div>
                  <div
                    onClick={() => handleRemove(index)}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors ease-in-out rounded-full cursor-pointer hover:bg-gray-100"
                  >
                    <HiOutlineX />
                  </div>
                </div>
              </div>

              <div className="flex items-center my-5">
                <RemarksMenuDropdown index={index} />
                <input
                  onChange={(event) => handleRemarks(event, index)}
                  value={position.remarks}
                  type="text"
                  placeholder="add remarks..."
                  className="w-full py-2 border-2 border-gray-200"
                ></input>
              </div>

              <div className="flex justify-start pl-1">
                <p className="text-xs text-gray-500">{position.itemNumber}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};
