import { FormEvent, FunctionComponent } from 'react';
import { Position } from '../../../../types/prf.types';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { CloseButton } from '../../../modular/forms/buttons/CloseButton';
import { usePrfStore } from '../../../../store/prf.store';
import { TextButton } from '../../../modular/forms/TextButton';

type PositionCardProps = {
  position: Position;
};

export const PositionCard: FunctionComponent<PositionCardProps> = ({
  position,
}) => {
  // access current value of all positions
  const positions = usePrfStore((state) => state.positions);

  // access current value of selected positions
  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  // access function to update fields from positions array
  const updatePositions = usePrfStore((state) => state.updatePositions);

  // access function to set value for selected positions
  const setSelectedPositions = usePrfStore(
    (state) => state.setSelectedPositions
  );

  const setError = usePrfStore((state) => state.setError);

  // handle changes on remarks
  const onRemarksChange = (
    selectedId: string,
    event: FormEvent<HTMLInputElement>
  ) => {
    // create a copy of selected positions
    const updatedWithRemarks = [...selectedPositions];

    // loop through the copy of selected positions
    updatedWithRemarks.map((position: Position) => {
      // check if position remarks index is the current index of this loop
      if (position.positionId === selectedId)
        position.remarks = event.currentTarget.value;
    });

    // set the new value of selected positions
    setSelectedPositions(updatedWithRemarks);
  };

  // define function to remove a position from selected positions
  const handleRemove = (sequenceNo: number) => {
    // change the isSelected value of a position based on its sequence number
    updatePositions(positions, sequenceNo);

    // set the new value for selected positions
    setSelectedPositions(positions);
  };

  return (
    <>
      <div className="scale-90 transition-all shadow-2xl shadow-slate-100 bg-white bg-opacity-40 p-5 rounded">
        <div className="flex">
          <div className="shrink-0 w-full lg:w-[calc(100%-2rem)] space-y-3">
            <p className="text-gray-600 text-xs ml-1">{position.itemNumber}</p>

            <div className="flex gap-3">
              <section className="flex h-10 w-12 items-center justify-center rounded bg-indigo-50">
                <HiOutlineDocumentDuplicate className="h-6 w-6 text-indigo-500" />
              </section>

              <div>
                <h3 className="md:truncate">{position.positionTitle}</h3>
                <p className="text-sm text-gray-400 md:truncate w-full lg:w-[30rem]">
                  {position.designation}
                </p>
              </div>
            </div>
          </div>

          <section className="w-full">
            <CloseButton onClick={() => handleRemove(position.sequenceNo)} />
          </section>
        </div>

        <section className="my-2">
          <TextButton
            btnLabel="add remarks"
            value={position.remarks}
            placeholder="please specify..."
            onChange={(e) => onRemarksChange(position.positionId, e)}
          />
        </section>
      </div>
    </>
  );
};
