import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import AddCustomGroupModal from 'apps/employee-monitoring/src/components/modal/settings/custom-groups/AddCustomGroupModal';
import DeleteCustomGroupModal from 'apps/employee-monitoring/src/components/modal/settings/custom-groups/DeleteCustomGroupModal';
import EditCustomGroupModal from 'apps/employee-monitoring/src/components/modal/settings/custom-groups/EditCustomGroupModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<CustomGroup>(
    {} as CustomGroup
  );

  // fetch data for list of custom groups
  const {
    data: swrCustomGroups,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateCustomGroups,
  } = useSWR('/custom-groups', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: CustomGroup) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: CustomGroup) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: CustomGroup) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          // onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-group"></i>
        </button>

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
  const columnHelper = createColumnHelper<CustomGroup>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Zustand initialization
  const {
    CustomGroups,
    PostCustomGroupResponse,
    UpdateCustomGroupResponse,
    DeleteCustomGroupResponse,

    IsLoading,
    ErrorCustomGroups,
    ErrorCustomGroup,

    GetCustomGroups,
    GetCustomGroupsSuccess,
    GetCustomGroupsFail,

    EmptyResponse,
  } = useCustomGroupStore((state) => ({
    CustomGroups: state.customGroups,
    PostCustomGroupResponse: state.customGroup.postResponse,
    UpdateCustomGroupResponse: state.customGroup.updateResponse,
    DeleteCustomGroupResponse: state.customGroup.deleteResponse,

    IsLoading: state.loading.loadingCustomGroups,
    ErrorCustomGroups: state.error.errorCustomGroups,
    ErrorCustomGroup: state.error.errorCustomGroup,

    GetCustomGroups: state.getCustomGroups,
    GetCustomGroupsSuccess: state.getCustomGroupsSuccess,
    GetCustomGroupsFail: state.getCustomGroupsFail,

    EmptyResponse: state.emptyResponse,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: CustomGroups,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetCustomGroups(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrCustomGroups)) {
      GetCustomGroupsSuccess(swrIsLoading, swrCustomGroups.data);
    }

    if (!isEmpty(swrError)) {
      GetCustomGroupsFail(swrIsLoading, swrError.message);
    }
  }, [swrCustomGroups, swrError]);

  // Reset responses from all modal actions
  useEffect(() => {
    if (
      !isEmpty(PostCustomGroupResponse) ||
      !isEmpty(UpdateCustomGroupResponse) ||
      !isEmpty(DeleteCustomGroupResponse)
    ) {
      mutateCustomGroups();

      setTimeout(() => {
        EmptyResponse();
      }, 3000);
    }
  }, [
    PostCustomGroupResponse,
    UpdateCustomGroupResponse,
    DeleteCustomGroupResponse,
  ]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Custom Groups" />
        {/* Error Notifications */}
        {!isEmpty(ErrorCustomGroups) ? (
          <ToastNotification
            toastType="error"
            notifMessage={ErrorCustomGroups}
          />
        ) : null}
        {!isEmpty(ErrorCustomGroup) ? (
          <ToastNotification
            toastType="error"
            notifMessage={ErrorCustomGroup}
          />
        ) : null}

        {/* Success Notifications */}
        {!isEmpty(PostCustomGroupResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Custom group added successfully"
          />
        ) : null}
        {!isEmpty(UpdateCustomGroupResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Custom group details updated successfully"
          />
        ) : null}
        {!isEmpty(DeleteCustomGroupResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Custom group successfully deleted"
          />
        ) : null}

        <Can I="access" this="Custom Groups">
          <div className="mx-5">
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
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Custom
                      Group Order
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
          <AddCustomGroupModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Edit modal */}
          <EditCustomGroupModal
            modalState={editModalIsOpen}
            setModalState={setEditModalIsOpen}
            closeModalAction={closeEditActionModal}
            rowData={currentRowData}
          />

          {/* Delete modal */}
          <DeleteCustomGroupModal
            modalState={deleteModalIsOpen}
            setModalState={setDeleteModalIsOpen}
            closeModalAction={closeDeleteActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
