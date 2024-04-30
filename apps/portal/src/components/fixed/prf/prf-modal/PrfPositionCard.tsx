import { Position } from 'apps/portal/src/types/prf.types';
import { FunctionComponent } from 'react';
import { ViewPositionModal } from '../prf-view-position/ViewPositionModal';
import { usePrfStore } from 'apps/portal/src/store/prf.store';

type PrfPositionCardProps = {
  position: Position;
  onClick?: () => void;
};

export const PrfPositionCard: FunctionComponent<PrfPositionCardProps> = ({ position, onClick }) => {
  const viewPositionModalIsOpen = usePrfStore((state) => state.viewPositionModalIsOpen);
  const setViewPositionModalIsOpen = usePrfStore((state) => state.setViewPositionModalIsOpen);
  const setSelectedPosition = usePrfStore((state) => state.setSelectedPosition);

  return (
    <>
      {/* <ViewPositionModal
        modalState={viewPositionModalIsOpen}
        setModalState={setViewPositionModalIsOpen}
        position={position}
        closeModalAction={() => setSelectedPosition({} as Position)}
      /> */}

      <button
        type="button"
        onClick={onClick}
        className={`${
          position.remarks ? 'hover:border-l-green-600' : 'hover:border-l-red-500'
        } border w-full min-h-[8rem] rounded cursor-pointer hover:shadow-slate-200 mb-4 flex items-center justify-between border-l-4 py-3 px-5 border-gray-200 shadow-2xl shadow-slate-100 transition-all`}
      >
        <section className="flex flex-col w-full">
          <div className="flex justify-between">
            <div className="text-lg font-medium text-gray-600">{position.positionTitle}</div>
            <div className="text-sm text-gray-600">{position.itemNumber}</div>
          </div>
          <div className="text-sm text-left text-gray-400">{position.designation}</div>

          <div>
            {position.remarks ? (
              <section className="flex items-center gap-2">
                <p className="text-emerald-600">{position.remarks}</p>
              </section>
            ) : (
              <section className="flex items-center gap-2">
                <p className="text-red-400">No remarks set for this position.</p>
              </section>
            )}
          </div>
        </section>
      </button>
    </>
  );
};
