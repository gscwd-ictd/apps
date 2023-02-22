import dayjs from 'dayjs';
import { FinishedPosition, useDrStore } from '../../../store/dr.store';
import { Position } from '../../../types/position.type';

type AllDrcPositionsListTabProps = {
  positions: Array<FinishedPosition>;
  tab: number;
};

export const AllDrcPositionsListTab = ({ positions, tab }: AllDrcPositionsListTabProps): JSX.Element => {
  // get all related state from dr context

  const filteredPositions = useDrStore((state) => state.filteredPositions);

  const modal = useDrStore((state) => state.modal);

  const setSelectedPosition = useDrStore((state) => state.setSelectedPosition);

  const setModal = useDrStore((state) => state.setModal);

  const setAction = useDrStore((state) => state.setAction);

  const onSelect = (position: Position, tab: number) => {
    let action = '';
    if (tab === 1) {
      action = 'create';
    } else if (tab === 2) {
      action = 'update';
    }

    // set action whether create or update
    setAction(action);

    // set the selected position based on index
    setSelectedPosition(position);

    // set the modal state
    setModal({ ...modal, page: 2, isOpen: true });
  };

  return (
    <>
      {positions && positions.length > 0 ? (
        <ul>
          {positions &&
            positions.map((position: FinishedPosition, index: number) => {
              return (
                <li
                  key={index}
                  onClick={() => onSelect(position, tab)}
                  className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
                >
                  <div className='w-full py-2 px-1'>
                    <h1 className="font-medium text-xl text-gray-600">{position.positionTitle}</h1>
                    <p className="text-sm text-gray-500">{position.itemNumber}</p>
                    {tab === 1 && <p className="text-sm text-indigo-500">No duties, responsibilities, and competencies</p>}
                    {tab === 2 && <p className="text-sm text-indigo-500">Updated at {dayjs(position.updatedAt).format('MMMM d, YYYY')}</p>}
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">No {tab === 1 ? 'positions with no DRCs' : tab === 2 ? 'positions with DRCs' : ''} at the moment</h1>
        </div>
      )}
    </>
  );
};
