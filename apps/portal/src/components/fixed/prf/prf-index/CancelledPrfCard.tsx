import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { HiOutlinePencil, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { PrfDetails } from '../../../../types/prf.types';
import { usePrfStore } from 'apps/portal/src/store/prf.store';

type PrfCardProps = {
  prf: Array<PrfDetails>;
};

export const CancelledPrfCard: FunctionComponent<PrfCardProps> = ({ prf }) => {
  const router = useRouter();

  const { selectedPrfId, setSelectedPrfId, setCancelledPrfModalIsOpen } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    setSelectedPrfId: state.setSelectedPrfId,
    setCancelledPrfModalIsOpen: state.setCancelledPrfModalIsOpen,
  }));

  return (
    <>
      {prf.map((prf: PrfDetails, index: number) => {
        return (
          <div
            onClick={
              () => {
                setSelectedPrfId(prf._id);
                setCancelledPrfModalIsOpen(true); //open pending prf modal
              }
              // router.push(`/${router.query.id}/prf/pending/${prf._id}`)
            }
            key={index}
            className="p-8 transition-all scale-95 bg-white bg-opacity-50 border-b rounded-md shadow-xl cursor-pointer shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200 hover:scale-105 border-b-gray-100"
          >
            <div className="">
              <header>
                <h3 className="text-lg font-semibold text-gray-600">{prf.prfNo}</h3>
                <p className="text-xs text-gray-500">Requested last {dayjs(prf.createdAt).format('DD MMM, YYYY')}</p>
              </header>

              <main className="mt-4">
                <div className="flex items-center gap-2">
                  <HiOutlineDocumentDuplicate className="text-gray-600" />
                  <p className="text-sm text-gray-600">
                    {prf.prfPositions?.length} {prf.prfPositions?.length === 1 ? 'position' : 'positions'} requested
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlinePencil className="text-gray-600" />
                  {prf.withExam ? (
                    <p className="text-sm text-indigo-700">Examination is required</p>
                  ) : (
                    <p className="text-sm text-orange-600">No examination required</p>
                  )}
                </div>
              </main>
            </div>
          </div>
        );
      })}
    </>
  );
};
