/* eslint-disable @nx/enforce-module-boundaries */
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Position } from 'apps/portal/src/types/position.type';
import { HiEye, HiPencilAlt, HiPlusCircle } from 'react-icons/hi';
import { Button } from '../../../modular/common/forms/Button';
import BadgePill from '../../../modular/badges/BadgePill';

export const DrcAllPositionsList = (): JSX.Element => {
  // get all related state from dr context

  const filteredPositions = usePositionStore((state) => state.filteredPositions);

  const modal = useModalStore((state) => state.modal);

  const setSelectedPosition = usePositionStore((state) => state.setSelectedPosition);

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
                <div className="w-full">
                  <div className="flex items-center justify-start w-full gap-2 ">
                    <div className="font-medium text-gray-600 ">{position.positionTitle}</div>
                    <div className="flex gap-2 ">
                      {position.employeeName == null && (
                        <div>
                          <BadgePill label="Vacant" variant="primary" />
                        </div>
                      )}
                      {position.hasOngoingPrf === 1 && (
                        <div>
                          <BadgePill label="Ongoing PRF" variant="warning" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-black ">{position.itemNumber}</div>
                  <div className="text-xs text-gray-500">{position.designation}</div>
                  {position.employeeName != null && (
                    <div className="text-green-700 text-sm">{position.employeeName}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  {position.hasDuties === 0 && position.hasEmployee === 0 && (
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

                  {position.hasDuties === 0 && position.hasEmployee === 1 && (
                    <Button
                      btnLabel="VIEW"
                      btnVariant="white"
                      icon={<HiEye size={20} />}
                      iconPlacement="start"
                      onClick={() => onSelect(position, Actions.VIEW)}
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
