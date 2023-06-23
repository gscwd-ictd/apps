import { HiPencil, HiPencilAlt, HiPlusCircle } from 'react-icons/hi';
import { useDrStore } from '../../../store/dr.store';
import { Position } from '../../../types/position.type';
import { Button } from '../../modular/common/forms/Button';

export const AllDRPositionsList = (): JSX.Element => {
  // get all related state from dr context
  // const { filteredPositions, modal, setSelectedPosition, setModal, setAction } = useContext(DRContext);

  const filteredPositions = useDrStore((state) => state.filteredPositions);

  const modal = useDrStore((state) => state.modal);

  const setSelectedPosition = useDrStore((state) => state.setSelectedPosition);

  const setModal = useDrStore((state) => state.setModal);

  const setAction = useDrStore((state) => state.setAction);

  const onSelect = (position: Position, action: string) => {
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
                className="flex items-center justify-between p-5 transition-colors ease-in-out hover:border-l-indigo-500 hover:bg-indigo-50"
              >
                <div>
                  <h1 className="font-medium text-gray-600">
                    {position.positionTitle}
                  </h1>
                  <p className="text-sm text-gray-500">{position.itemNumber}</p>
                </div>

                <div className="flex gap-2">
                  {position.hasDuties === 0 && (
                    <Button
                      btnLabel="SET"
                      icon={<HiPlusCircle size={20} />}
                      iconPlacement="start"
                      onClick={() => onSelect(position, 'create')}
                      className="flex justify-center w-28"
                      light
                      shadow
                    />
                  )}

                  {position.hasDuties === 1 && (
                    <Button
                      btnLabel="UPDATE"
                      icon={<HiPencilAlt size={20} />}
                      iconPlacement="start"
                      onClick={() => onSelect(position, 'update')}
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
