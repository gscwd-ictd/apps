/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { MonitoringLeave } from 'libs/utils/src/lib/types/leave-application.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTable,
  useDataTable,
  fuzzySort,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from '../../../components/cards/Card';
import { BreadCrumbs } from '../../../components/navigations/BreadCrumbs';

// Mock Data REMOVE later
const TypesMockData: Array<MonitoringLeave> = [
  {
    employeeId: 'emp-id-001',
    fullName: 'Allyn Cubero',
    id: 'leave-id-001',
    leaveName: 'Vacation Leave',
    dateOfFiling: '2023-04-12',
    leaveDates: ['2023-05-01', '2023-05-02'],
    status: 'ongoing',
  },
  {
    employeeId: 'emp-id-001',
    fullName: 'Allyn Cubero',
    id: 'leave-id-002',
    leaveName: 'Sick Leave',
    dateOfFiling: '2023-04-13',
    leaveDates: ['2023-04-12'],
    status: 'approved',
  },
  {
    employeeId: 'emp-id-002',
    fullName: 'RV Kuku Cated',
    id: 'leave-id-003',
    leaveName: 'Forced Leave',
    dateOfFiling: '2023-04-14',
    leaveDates: ['2023-04-28', '2023-04-29'],
    status: 'disapproved',
  },
  {
    employeeId: 'emp-id-003',
    fullName: 'Papa Toya Ting',
    id: 'leave-id-004',
    leaveName: 'Paternity Leave',
    dateOfFiling: '2023-04-14',
    leaveDates: [
      '2023-04-24',
      '2023-04-25',
      '2023-04-26',
      '2023-04-27',
      '2023-04-28',
    ],
    status: 'disapproved',
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<MonitoringLeave>(
    {} as MonitoringLeave
  );

  // fetch data for list of leave applications
  const {
    data: swrLeaveApplication,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateLeaveApplications,
  } = useSWR('/leave-applications', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: MonitoringLeave) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  // Rendering of leave dates in row
  const renderRowLeaveDates = (leaveDates: Array<string>) => {
    if (leaveDates) {
      if (leaveDates.length > 4) {
        return (
          <span className="bg-gray-500 text-white text-xs font-medium px-1 py-0.5 ml-1 rounded text-center">
            {leaveDates[0]} TO {leaveDates.slice(-1)}
          </span>
        );
      } else {
        return leaveDates.map((leaveDate: string, index: number) => (
          <span
            className="bg-gray-500 text-white text-xs font-medium px-1 py-0.5 ml-1 rounded text-center"
            key={index}
          >
            {leaveDate}
          </span>
        ));
      }
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: MonitoringLeave) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openViewActionModal(rowData)}
        >
          <i className="bx bx-show"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<MonitoringLeave>();
  const columns = [
    columnHelper.accessor('dateOfFiling', {
      header: 'Date of Filing',
      filterFn: 'equalsString',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    // leaveId
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('leaveName', {
      header: 'Leave Benefit',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'leaveDates',
      header: 'Leave Dates',
      enableColumnFilter: false,
      cell: (props) => renderRowLeaveDates(props.row.original.leaveDates),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <p className="capitalize">{info.getValue()}</p>,
    }),
    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: TypesMockData,
    columnVisibility: { id: false, employeeId: false },
  });

  // Zustand initialization
  const {
    LeaveApplications,
    IsLoading,
    ErrorLeaveApplications,

    GetLeaveApplications,
    GetLeaveApplicationsSuccess,
    GetLeaveApplicationsFail,
  } = useLeaveApplicationStore((state) => ({
    LeaveApplications: state.leaveApplications,
    IsLoading: state.loading.loadingLeaveApplications,
    ErrorLeaveApplications: state.error.errorLeaveApplications,

    GetLeaveApplications: state.getLeaveApplications,
    GetLeaveApplicationsSuccess: state.getLeaveApplicationsSuccess,
    GetLeaveApplicationsFail: state.getLeaveApplicationsFail,
  }));

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetLeaveApplications(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveApplication)) {
      GetLeaveApplicationsSuccess(swrIsLoading, swrLeaveApplication.data);
    }

    if (!isEmpty(swrError)) {
      GetLeaveApplicationsFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaveApplication, swrError]);

  return (
    <div className="w-full px-4">
      <BreadCrumbs title="Leave Applications" />

      {/* Error Notifications */}
      {!isEmpty(ErrorLeaveApplications) ? (
        <ToastNotification
          toastType="error"
          notifMessage={ErrorLeaveApplications}
        />
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
        {IsLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="flex flex-row flex-wrap">
            {/* <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                onClick={openAddActionModal}
              >
                <i className="bx bxs-plus-square"></i>&nbsp; Add Travel Order
              </button>
            </div> */}

            <DataTable
              model={table}
              showGlobalFilter={true}
              showColumnFilter={true}
              paginate={true}
            />
          </div>
        )}
      </Card>

      {/* Add modal */}
      {/* <AddTravelOrderModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      /> */}

      {/* Edit modal */}
      {/* <EditTravelOrderModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      /> */}

      {/* Delete modal */}
      {/* <DeleteTravelOrderModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      /> */}
    </div>
  );
};

export default Index;
