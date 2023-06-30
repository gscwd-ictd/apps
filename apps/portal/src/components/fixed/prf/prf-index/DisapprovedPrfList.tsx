import { FunctionComponent } from 'react';
import { usePrfStore } from '../../../../store/prf.store';
import { PendingPrfCard } from './PendingPrfCard';
import { DisapprovedPrfCard } from './DisapprovedPrfCard';

type DisapprovedPrfListProps = {
  // list: Array<PendingPrf>;
};

export const DisapprovedPrfList: FunctionComponent<
  DisapprovedPrfListProps
> = () => {
  // access pending prf from store
  const disapprovedPrfs = usePrfStore((state) => state.disapprovedPrfs);

  return (
    <div className="w-full h-[33rem] overflow-y-scroll rounded-lg px-5">
      {disapprovedPrfs.length === 0 ? (
        <>
          <div className="flex h-full justify-center pt-32 w-full px-[18%]">
            <p className="text-4xl text-center font-bold text-gray-300">
              No disapproved requests at the moment
            </p>
          </div>
        </>
      ) : (
        <>
          <header className="px-5 mb-5">
            <h3 className="font-medium text-gray-600 pt-3">
              Disapproved Requests
            </h3>
            <p className="text-sm text-gray-500">
              Click on each request item to view its current status.
            </p>
          </header>
          <main className="scale-95 grid grid-cols-2 gap-6">
            <DisapprovedPrfCard prf={disapprovedPrfs} />
          </main>
        </>
      )}
    </div>
  );
};
