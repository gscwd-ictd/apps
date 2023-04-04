/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';
import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTableHrms,
  LoadingSpinner,
  ToastNotification,
  Dropdown,
} from '@gscwd-apps/oneui';
import { Card } from '../../../components/cards/Card';
import { BreadCrumbs } from '../../../components/navigations/BreadCrumbs';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';

// Mock Data REMOVE later
const TypesMockData: Array<TravelOrder> = [
  {
    id: 'travelorder001',
    employee: {
      employeeId: '001',
      fullName: 'Employee 1',
    },
    travelOrderNo: '2023-001',
    purposeOfTravel: 'Sample purpose of travel',
    dateRequested: '2023-04-10',
    itineraryOfTravel: [
      {
        id: 'itinerary001',
        scheduledDate: '2023-04-20',
        scheduledPlace: 'Place 1',
      },
    ],
  },
  {
    id: 'travelorder002',
    employee: {
      employeeId: '002',
      fullName: 'Employee 2',
    },
    travelOrderNo: '2023-002',
    purposeOfTravel: 'Sample purpose of travel',
    dateRequested: '2023-04-11',
    itineraryOfTravel: [
      {
        id: 'itinerary001',
        scheduledDate: '2023-04-21',
        scheduledPlace: 'Place 1',
      },
      {
        id: 'itinerary002',
        scheduledDate: '2023-04-22',
        scheduledPlace: 'Place 2',
      },
    ],
  },
  {
    id: 'travelorder003',
    employee: {
      employeeId: '003',
      fullName: 'Employee 3',
    },
    travelOrderNo: '2023-003',
    purposeOfTravel: 'Sample purpose of travel',
    dateRequested: '2023-04-11',
    itineraryOfTravel: [
      {
        id: 'itinerary001',
        scheduledDate: '2023-04-21',
        scheduledPlace: 'Place 1',
      },
      {
        id: 'itinerary002',
        scheduledDate: '2023-04-22',
        scheduledPlace: 'Place 2',
      },
    ],
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<TravelOrder>(
    {} as TravelOrder
  );

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

  // Define table columns
  const columnHelper = createColumnHelper<TravelOrder>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('travelOrderNo', {
      header: () => 'Travel Order No.',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employee', {
      header: () => 'Employee Name',
      cell: (info) => info.getValue().fullName,
    }),
    columnHelper.accessor('dateRequested', {
      header: () => 'Date',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

  // Render row actions in the table component
  const renderRowActions = (rowData: TravelOrder) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          // onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          // onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // fetch data for list of travel orders
  const {
    data: swrTrainingTypes,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateTravelOrders,
  } = useSWR('/travel-order', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const {
    TravelOrders,
    IsLoading,
    Error,

    GetTravelOrders,
    GetTravelOrdersSuccess,
    GetTravelOrdersFail,

    EmptyResponse,
  } = useTravelOrderStore((state) => ({
    TravelOrders: state.travelOrders,
    IsLoading: state.loading.loadingTravelOrders,
    Error: state.error.errorTravelOrders,

    GetTravelOrders: state.getTravelOrders,
    GetTravelOrdersSuccess: state.getTravelOrdersSuccess,
    GetTravelOrdersFail: state.getTravelOrdersFail,

    EmptyResponse: state.emptyResponse,
  }));

  // Initial zustand state update
  useEffect(() => {
    EmptyResponse();
    if (swrIsLoading) {
      GetTravelOrders(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingTypes)) {
      GetTravelOrdersSuccess(swrIsLoading, swrTrainingTypes.data);
    }

    if (!isEmpty(swrError)) {
      GetTravelOrdersFail(swrIsLoading, swrError);
    }
  }, [swrTrainingTypes, swrError]);

  // useEffect(() => {
  //   if (
  //     !isEmpty(PostTravelOrderResponse) ||
  //     !isEmpty(UpdateTravelOrderResponse) ||
  //     !isEmpty(DeleteTravelOrderResponse)
  //   ) {
  //     mutateTravelOrders();
  //   }
  // }, [
  //   PostTravelOrderResponse,
  //   UpdateTravelOrderResponse,
  //   DeleteTravelOrderResponse,
  // ]);

  return (
    <div className="min-h-[100%] min-w-full px-4">
      <BreadCrumbs title="Travel Orders" />

      {/* Error Notifications */}
      {!isEmpty(Error) ? (
        <ToastNotification toastType="error" notifMessage={Error} />
      ) : null}

      {/* Success Notifications */}
      {/* {!isEmpty(PostTravelOrderResponse) ? (
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
      ) : null} */}

      <Card>
        <div className="flex flex-row flex-wrap">
          <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
              // onClick={openAddActionModal}
            >
              <i className="bx bxs-plus-square"></i>&nbsp; Add Travel Order
            </button>
          </div>

          <DataTableHrms
            data={TypesMockData}
            // data={TrainingTypes}
            columns={columns}
            columnVisibility={columnVisibility}
            paginate
            showGlobalFilter
          />
        </div>

        {/* {IsLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="flex flex-row flex-wrap">
            <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                // onClick={openAddActionModal}
              >
                <i className="bx bxs-plus-square"></i>&nbsp; Add Training Type
              </button>
            </div>

            <DataTableHrms
              data={TypesMockData}
              // data={TrainingTypes}
              columns={columns}
              columnVisibility={columnVisibility}
              paginate
              showGlobalFilter
            />
          </div>
        )} */}
      </Card>

      {/* Add modal */}
      {/* <AddTrainingTypeModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      /> */}

      {/* Edit modal */}
      {/* <EditTrainingTypeModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      /> */}

      {/* Delete modal */}
      {/* <DeleteTrainingTypeModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      /> */}
    </div>
  );
};

export default Index;
