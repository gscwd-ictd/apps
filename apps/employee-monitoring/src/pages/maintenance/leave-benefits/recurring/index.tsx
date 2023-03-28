import { Button, DataTableHrms, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import AddRecurringModal from 'apps/employee-monitoring/src/components/modal/maintenance/leave/recurring/AddRecurringModal';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';

// mock
// const listOfRecurringLeaves: Array<Leave> = [
//   {
//     leaveName: 'Forced Leave',
//     creditDistribution: 'Yearly',
//     accumulatedCredits: 5,
//     status: 'active',
//     canBeCarriedOver: false,
//     isMonetizable: false,
//     maximumCredits: 0,
//     actions: '',
//   },
//   {
//     leaveName: 'Special Privilege Leave',
//     canBeCarriedOver: false,
//     isMonetizable: false,
//     maximumCredits: 0,
//     creditDistribution: 'Yearly',
//     accumulatedCredits: 3,
//     status: 'active',
//     actions: '',
//   },
// ];

export default function Index() {
  const { leaveBenefits, setLeaveBenefits } = useLeaveBenefitStore((state) => ({
    leaveBenefits: state.leaveBenefits,
    setLeaveBenefits: state.setLeaveBenefits,
  }));
  const [currentRowData, setCurrentRowData] = useState<LeaveBenefit>(
    {} as LeaveBenefit
  );

  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  const editAction = (leave: LeaveBenefit) => {
    setCurrentRowData(leave);
  };

  useEffect(() => {
    setLeaveBenefits(leaveBenefits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[100%] w-full">
      <BreadCrumbs
        title="Recurring Leave"
        crumbs={[
          {
            layerNo: 1,
            layerText: 'Recurring Leave Maintenance',
            path: '',
          },
        ]}
      />

      <AddRecurringModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      <div className="sm:mx-0 lg:mx-5">
        <Card title={''}>
          {/** Top Card */}
          <div className="flex flex-row flex-wrap">
            <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                onClick={openAddActionModal}
              >
                <i className="bx bxs-plus-square"></i>&nbsp; Add Leave Benefit
              </button>
            </div>

            {/* <DataTableHrms
              data={schedules}
              columns={columns}
              columnVisibility={columnVisibility}
              paginate
              showGlobalFilter
            /> */}
          </div>
        </Card>
      </div>
    </div>
  );
}
