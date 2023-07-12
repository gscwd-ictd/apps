/* eslint-disable @nx/enforce-module-boundaries */
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Position } from 'apps/portal/src/types/position.type';
import { HiPencilAlt, HiPlusCircle } from 'react-icons/hi';
import { Button } from '../../../modular/common/forms/Button';

export const DrcAllPositionsList = (): JSX.Element => {
  // get all related state from dr context

  const filteredPositions = usePositionStore(
    (state) => state.filteredPositions
  );

  const modal = useModalStore((state) => state.modal);

  const setSelectedPosition = usePositionStore(
    (state) => state.setSelectedPosition
  );

  const { setModal, setAction } = useModalStore((state) => ({
    setModal: state.setModal,
    setAction: state.setAction,
  }));

  // const setAction = useDrStore((state) => state.setAction);

  const onSelect = (position: Position, action: Actions) => {
    // set action whether create or update
    setAction(action);

    // set the selected position based on index
    setSelectedPosition(position);

    // set the modal state
    setModal({ ...modal, page: 2 });
  };

  return (
    <>
      <ul>
        {filteredPositions &&
          filteredPositions.map((position: Position, index: number) => {
            return (
              <li
                key={index}
                // onClick={() => onSelect(position)}
                className="flex items-center justify-between p-5 transition-colors ease-in-out border-b hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <h1 className="font-medium text-gray-600">
                    {position.positionTitle}
                  </h1>
                  <p className="text-sm text-black font-semibold">
                    {position.itemNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {position.designation}
                  </p>
                </div>

                <div className="flex gap-2">
                  {position.hasDuties === 0 && (
                    <Button
                      btnLabel="SET"
                      btnVariant="default"
                      icon={<HiPlusCircle size={20} />}
                      iconPlacement="start"
                      onClick={() => onSelect(position, Actions.CREATE)}
                      className="flex justify-center w-28"
                      shadow
                    />
                  )}

                  {position.hasDuties === 1 && (
                    <Button
                      btnLabel="UPDATE"
                      icon={<HiPencilAlt size={20} />}
                      iconPlacement="start"
                      onClick={() => onSelect(position, Actions.UPDATE)}
                      className="flex justify-center w-28"
                      shadow
                    />
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};
