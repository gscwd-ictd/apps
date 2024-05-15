/* eslint-disable @nx/enforce-module-boundaries */
import { FinishedPosition } from 'apps/portal/src/store/dr.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Position } from 'apps/portal/src/types/position.type';
import dayjs from 'dayjs';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import BadgePill from '../../../modular/badges/BadgePill';

type AllDrcPositionsListTabProps = {
  positions: Array<FinishedPosition>;
  tab: number;
};

export const AllDrcPositionsListTab = ({ positions, tab }: AllDrcPositionsListTabProps): JSX.Element => {
  // get all related state from dr context

  const filteredPositions = usePositionStore((state) => state.filteredPositions);

  const modal = useModalStore((state) => state.modal);

  const setSelectedPosition = usePositionStore((state) => state.setSelectedPosition);

  const setModal = useModalStore((state) => state.setModal);

  const setAction = useModalStore((state) => state.setAction);

  const onSelect = (position: Position, tab: number) => {
    let action: Actions = null;
    if (tab === 1 && position.hasEmployee === 0) action = Actions.CREATE;
    else if (tab === 1 && position.hasEmployee === 1) action = Actions.VIEW;
    else if (tab === 2 && position.hasEmployee === 0) action = Actions.UPDATE;
    else if (tab === 2 && position.hasEmployee === 1) action = Actions.VIEW;

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
                  className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-tr-none rounded-bl-none cursor-pointer rounded-xl border-b-gray-200 hover:bg-indigo-50"
                >
                  {/* <div>{position.hasOnGoingPrf == 0 ? 'ZERO' : `${position.hasOnGoingPrf.toString()}`}</div> */}
                  <div className="w-full px-1 py-2">
                    <div className="flex items-center w-full gap-2">
                      <div className="text-xl font-medium text-gray-600">{position.positionTitle}</div>
                      {tab === 1 ? (
                        <div>
                          <BadgePill label="Vacant" variant="primary" />
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {position.employeeName == null && (
                            <div>
                              <BadgePill label="Vacant" variant="primary" />
                            </div>
                          )}
                          {position.hasOngoingPrf === 1 ? (
                            <div>
                              <BadgePill label="Ongoing PRF" variant="warning" />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-gray-600 text-md">{position.itemNumber}</div>
                    <div className="text-xs text-gray-500">{position.designation}</div>
                    {position.employeeName != null && (
                      <div className="text-sm text-green-700">{position.employeeName}</div>
                    )}
                    {tab === 1 && (
                      <p className="text-sm text-indigo-500 mt-4">No duties, responsibilities, and competencies</p>
                    )}
                    {tab === 2 && (
                      <p className="text-sm text-indigo-500 mt-4">
                        Updated at {DateFormatter(position.updatedAt, 'MMMM DD, YYYY')}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No {tab === 1 ? 'positions with no DRCs' : tab === 2 ? 'positions with DRCs' : ''} at the moment
          </h1>
        </div>
      )}
    </>
  );
};
