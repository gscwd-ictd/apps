import { FunctionComponent } from 'react';
import { usePrfStore } from '../../../../store/prf.store';
import { CancelledPrfCard } from './CancelledPrfCard';

export const CancelledPrfList: FunctionComponent = () => {
  // access pending prf from store
  const cancelledPrfs = usePrfStore((state) => state.cancelledPrfs);

  return (
    <div className="w-full h-[30rem] overflow-y-scroll rounded-lg px-5">
      {cancelledPrfs.length === 0 ? (
        <>
          <div className="flex h-full justify-center pt-32 w-full px-[18%]">
            <p className="text-4xl font-bold text-center text-gray-300">No cancelled requests at the moment</p>
          </div>
        </>
      ) : (
        <>
          <header className="px-5 mb-5">
            <h3 className="pt-3 font-medium text-gray-600">Cancelled Requests</h3>
            <p className="text-sm text-gray-500">Click on each request item to view its current status.</p>
          </header>
          <main className="grid grid-cols-2 gap-6">
            <CancelledPrfCard prf={cancelledPrfs} />
          </main>
        </>
      )}
    </div>
  );
};
