import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { HiOutlinePencil, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { ForApprovalPrf } from '../../../../types/prf.types';
import { usePrfStore } from 'apps/portal/src/store/prf.store';

type ForApprovalPrfCardProps = {
  prf: Array<ForApprovalPrf>;
};

export const ForApprovalPrfCard: FunctionComponent<ForApprovalPrfCardProps> = ({ prf }) => {
  const router = useRouter();

  const { selectedPrfId, setSelectedPrfId, setForApprovalPrfModalIsOpen } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    setSelectedPrfId: state.setSelectedPrfId,
    setForApprovalPrfModalIsOpen: state.setForApprovalPrfModalIsOpen,
  }));

  return (
    <>
      {prf.map((forApproval: ForApprovalPrf, index: number) => {
        return (
          <React.Fragment key={index}>
            <div
              onClick={
                () => {
                  setSelectedPrfId(forApproval.prfDetailsId);
                  setForApprovalPrfModalIsOpen(true);
                }
                // router.push(
                //   `/${router.query.id}/prf/for-approval/${forApproval.prfDetailsId}`
                // )
              }
              className="scale-95 bg-white shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200 rounded-md bg-opacity-50 hover:scale-105 transition-all border-b border-b-gray-100 cursor-pointer p-8"
            >
              <header>
                <h3 className="text-lg font-semibold text-gray-600">{forApproval.prfNo}</h3>
                <p className="text-xs text-gray-500 w-[16rem] truncate">{forApproval.designation}</p>
              </header>

              <main className="mt-4">
                <div className="flex items-center gap-2">
                  <HiOutlineDocumentDuplicate className="text-gray-600" />
                  <p className="text-sm text-gray-600 w-[15rem] truncate">{forApproval.requestedBy}</p>
                </div>
                {forApproval.status ? (
                  <div className="flex items-center gap-2">
                    <HiOutlinePencil className="text-gray-600" />
                    <p className="text-sm text-indigo-700">{forApproval.status ?? 'N/A'}</p>
                  </div>
                ) : null}
              </main>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
