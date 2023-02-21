import { FunctionComponent } from 'react';
import { usePrfStore } from '../../../../store/prf.store';
import { ForApprovalPrfCard } from './ForApprovalPrfCard';

export const ForApprovalPrfList: FunctionComponent = () => {
  const forApprovalPrfs = usePrfStore((state) => state.forApprovalPrfs);

  return (
    <>
      <div className="w-full h-[33rem] overflow-y-scroll rounded-lg px-5">
        {forApprovalPrfs.length === 0 ? (
          <>
            <div className="flex h-full justify-center pt-32 w-full px-[18%]">
              <p className="text-4xl text-center font-bold text-gray-300">
                No requests awaiting your approval
              </p>
            </div>
          </>
        ) : (
          <>
            <header className="px-5 mb-5">
              <h3 className="font-medium text-gray-600 pt-3">For Approval</h3>
              <p className="text-sm text-gray-500">
                Click on each request item to view more details.
              </p>
            </header>
            <main className="scale-95 grid grid-cols-2 gap-6">
              <ForApprovalPrfCard prf={forApprovalPrfs} />
            </main>
          </>
        )}
      </div>
    </>
  );
};
