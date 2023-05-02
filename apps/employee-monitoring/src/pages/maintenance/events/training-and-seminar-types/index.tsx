/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useTrainingTypesStore } from '../../../../store/training-type.store';
import { TrainingType } from 'libs/utils/src/lib/types/training-type.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTable,
  useDataTable,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import AddTrainingTypeModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/training-types/AddTrainingTypeModal';
import EditTrainingTypeModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/training-types/EditTrainingTypeModal';
import DeleteTrainingTypeModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/training-types/DeleteTrainingTypeModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<TrainingType>(
    {} as TrainingType
  );

  // fetch data for list of holidays
  const {
    data: swrTrainingTypes,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateTrainings,
  } = useSWR('/trainings-seminars-types', fetcherEMS, {
    // changed from trainings-and-seminars-types
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: TrainingType) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: TrainingType) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: TrainingType) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<TrainingType>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
      enableColumnFilter: false,
    }),
  ];

  // Zustand initialization
  const {
    TrainingTypes,
    PostTrainingTypeResponse,
    UpdateTrainingTypeResponse,
    DeleteTrainingTypeResponse,

    IsLoading,
    ErrorTrainingTypes,
    ErrorTrainingType,

    GetTrainingTypes,
    GetTrainingTypesSuccess,
    GetTrainingTypesFail,

    EmptyResponse,
  } = useTrainingTypesStore((state) => ({
    TrainingTypes: state.trainingTypes,
    PostTrainingTypeResponse: state.trainingType.postResponse,
    UpdateTrainingTypeResponse: state.trainingType.updateResponse,
    DeleteTrainingTypeResponse: state.trainingType.deleteResponse,

    IsLoading: state.loading.loadingTrainingTypes,
    ErrorTrainingTypes: state.error.errorTrainingTypes,
    ErrorTrainingType: state.error.errorTrainingType,

    GetTrainingTypes: state.getTrainingTypes,
    GetTrainingTypesSuccess: state.getTrainingTypesSuccess,
    GetTrainingTypesFail: state.getTrainingTypesFail,

    EmptyResponse: state.emptyResponse,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: TrainingTypes,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetTrainingTypes(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingTypes)) {
      GetTrainingTypesSuccess(swrIsLoading, swrTrainingTypes.data);
    }

    if (!isEmpty(swrError)) {
      GetTrainingTypesFail(swrIsLoading, swrError.message);
    }
  }, [swrTrainingTypes, swrError]);

  // Get new updated data and clear responses from POST, UPDATE and DELETE
  useEffect(() => {
    if (
      !isEmpty(PostTrainingTypeResponse) ||
      !isEmpty(UpdateTrainingTypeResponse) ||
      !isEmpty(DeleteTrainingTypeResponse)
    ) {
      mutateTrainings();

      setTimeout(() => {
        EmptyResponse();
      }, 3000);
    }
  }, [
    PostTrainingTypeResponse,
    UpdateTrainingTypeResponse,
    DeleteTrainingTypeResponse,
  ]);

  return (
    <div className="w-full px-4">
      <BreadCrumbs title="Training & Seminar Types" />

      {/* Error Notifications */}
      {!isEmpty(ErrorTrainingTypes) ? (
        <ToastNotification
          toastType="error"
          notifMessage={ErrorTrainingTypes}
        />
      ) : null}
      {!isEmpty(ErrorTrainingType) ? (
        <ToastNotification toastType="error" notifMessage={ErrorTrainingType} />
      ) : null}

      {/* Success Notifications */}
      {!isEmpty(PostTrainingTypeResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Training type added successfully"
        />
      ) : null}
      {!isEmpty(UpdateTrainingTypeResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Training type updated successfully"
        />
      ) : null}
      {!isEmpty(DeleteTrainingTypeResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Training type deleted successfully"
        />
      ) : null}

      <div className="sm:mx-0 md:mx-0 lg:mx-5">
        <Card>
          {IsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="flex flex-row flex-wrap">
              <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                  onClick={openAddActionModal}
                >
                  <i className="bx bxs-plus-square"></i>&nbsp; Add Training Type
                </button>
              </div>

              <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={false}
                paginate={true}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Add modal */}
      <AddTrainingTypeModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      {/* Edit modal */}
      <EditTrainingTypeModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {/* Delete modal */}
      <DeleteTrainingTypeModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export default Index;
