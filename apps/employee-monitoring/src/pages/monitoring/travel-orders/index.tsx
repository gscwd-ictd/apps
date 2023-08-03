/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTable,
  useDataTable,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from '../../../components/cards/Card';
import { BreadCrumbs } from '../../../components/navigations/BreadCrumbs';
import AddTravelOrderModal from 'apps/employee-monitoring/src/components/modal/monitoring/travel-orders/AddTravelOrderModal';
import DeleteTravelOrderModal from 'apps/employee-monitoring/src/components/modal/monitoring/travel-orders/DeleteTravelOrderModal';
import EditTravelOrderModal from 'apps/employee-monitoring/src/components/modal/monitoring/travel-orders/EditTravelOrderModal';
import ConvertFullMonthNameToDigit from 'apps/employee-monitoring/src/utils/functions/ConvertFullMonthNameToDigit';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<TravelOrder>(
    {} as TravelOrder
  );

  // fetch data for list of travel orders
  const {
    data: swrTravelOrder,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateTravelOrders,
  } = useSWR('/travel-order', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: TravelOrder) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: TravelOrder) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: TravelOrder) => {
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
  const columnHelper = createColumnHelper<TravelOrder>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('travelOrderNo', {
      header: 'Travel Order No.',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('employee.fullName', {
      header: 'Employee Name',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('purposeOfTravel', {
      enableSorting: false,
      header: 'Purpose of Travel',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateFrom', {
      header: 'Date From',
      cell: (info) => ConvertFullMonthNameToDigit(info.getValue()),
      enableColumnFilter: false,
    }),

    columnHelper.accessor('dateTo', {
      header: 'Date To',
      cell: (info) => ConvertFullMonthNameToDigit(info.getValue()),
      enableColumnFilter: false,
    }),
    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Zustand initialization
  const {
    TravelOrders,
    PostTravelOrderResponse,
    UpdateTravelOrderResponse,
    DeleteTravelOrderResponse,

    IsLoading,
    ErrorTravelOrders,
    ErrorTravelOrder,

    GetTravelOrders,
    GetTravelOrdersSuccess,
    GetTravelOrdersFail,

    EmptyResponse,
  } = useTravelOrderStore((state) => ({
    TravelOrders: state.travelOrders,
    PostTravelOrderResponse: state.travelOrder.postResponse,
    UpdateTravelOrderResponse: state.travelOrder.updateResponse,
    DeleteTravelOrderResponse: state.travelOrder.deleteResponse,

    IsLoading: state.loading.loadingTravelOrders,
    ErrorTravelOrders: state.error.errorTravelOrders,
    ErrorTravelOrder: state.error.errorTravelOrder,

    GetTravelOrders: state.getTravelOrders,
    GetTravelOrdersSuccess: state.getTravelOrdersSuccess,
    GetTravelOrdersFail: state.getTravelOrdersFail,

    EmptyResponse: state.emptyResponse,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    // data: TypesMockData,
    data: TravelOrders,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetTravelOrders(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTravelOrder)) {
      GetTravelOrdersSuccess(swrIsLoading, swrTravelOrder.data);
    }

    if (!isEmpty(swrError)) {
      GetTravelOrdersFail(swrIsLoading, swrError.message);
    }
  }, [swrTravelOrder, swrError]);

  // Get new list of travel orders
  useEffect(() => {
    if (
      !isEmpty(PostTravelOrderResponse) ||
      !isEmpty(UpdateTravelOrderResponse) ||
      !isEmpty(DeleteTravelOrderResponse)
    ) {
      mutateTravelOrders();

      setTimeout(() => {
        EmptyResponse();
      }, 3000);
    }
  }, [
    PostTravelOrderResponse,
    UpdateTravelOrderResponse,
    DeleteTravelOrderResponse,
  ]);

  return (
    <div>
      <BreadCrumbs title="Travel Orders" />

      {/* Error Notifications */}
      {!isEmpty(ErrorTravelOrders) ? (
        <ToastNotification toastType="error" notifMessage={ErrorTravelOrders} />
      ) : null}
      {!isEmpty(ErrorTravelOrder) ? (
        <ToastNotification toastType="error" notifMessage={ErrorTravelOrder} />
      ) : null}

      {/* Success Notifications */}
      {!isEmpty(PostTravelOrderResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Travel order added successfully"
        />
      ) : null}
      {!isEmpty(UpdateTravelOrderResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Travel order updated successfully"
        />
      ) : null}
      {!isEmpty(DeleteTravelOrderResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Travel order deleted successfully"
        />
      ) : null}

      <div className="sm:px-2 md:px-2 lg:px-5">
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
                  <i className="bx bxs-plus-square"></i>&nbsp; Add Travel Order
                </button>
              </div>

              <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={true}
                paginate={true}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Add modal */}
      <AddTravelOrderModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      {/* Edit modal */}
      <EditTravelOrderModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {/* Delete modal */}
      <DeleteTravelOrderModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export default Index;
