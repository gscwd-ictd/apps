import { Button, DataTableHrms, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import AddTrainingsModal from 'apps/employee-monitoring/src/components/modal/monitoring/trainings-and-seminars/AddTrainingsModal';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import React from 'react';
import { useEffect, useState } from 'react';
import { Training } from '../../../../../../libs/utils/src/lib/types/training.type';

export default function Index() {
  const [currentRowData, setCurrentRowData] = useState<Training>(
    {} as Training
  );

  // add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Training) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: Training) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  return (
    <>
      <div className="min-h-[100%] w-full">
        <BreadCrumbs
          title="Trainings & Seminars"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Trainings & Seminars',
              path: '',
            },
          ]}
        />

        <AddTrainingsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <Can I="access" this="monitoring_trainings_and_seminars">
          <div className="mx-5">
            <Card>
              <div className="flex flex-row flex-wrap">
                <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                    onClick={openAddActionModal}
                  >
                    <i className="bx bxs-plus-square"></i>&nbsp; Add Trainings &
                    Seminars
                  </button>
                </div>

                {/* <DataTableHrms
                data={leaveBenefits}
                columns={columns}
                columnVisibility={columnVisibility}
                paginate
                showGlobalFilter
              /> */}
              </div>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
