/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { LeaveCancellationDetails } from 'libs/utils/src/lib/types/leave-application.type';

import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, useDataTable, fuzzySort, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import dayjs from 'dayjs';
import UseRenderLeaveCancellationStatus from 'apps/employee-monitoring/src/utils/functions/RenderLeaveCancellationStatus';
import UseRenderLeaveType from 'apps/employee-monitoring/src/utils/functions/RenderLeaveType';
import ViewLeaveCancellationModal from 'apps/employee-monitoring/src/components/modal/monitoring/leave-cancellations/ViewLeaveCancellationModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<LeaveCancellationDetails>({} as LeaveCancellationDetails);

  // fetch data for list of leave cancellations
  const {
    data: swrLeaveCancellations,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateLeaveApplications,
  } = useSWR('/leave-application-dates/for-cancellation', fetcherEMS);

  // Zustand initialization
  const {
    LeaveCancellations,
    SetLeaveCancellations,

    ErrorLeaveCancellations,
    SetErrorLeaveCancellations,

    ApproveLeaveCancellation,
    ErrorApproveLeaveCancellation,
  } = useLeaveApplicationStore((state) => ({
    LeaveCancellations: state.leaveCancellations,
    SetLeaveCancellations: state.setLeaveCancellations,

    ErrorLeaveCancellations: state.errorLeaveCancellations,
    SetErrorLeaveCancellations: state.setErrorLeaveCancellations,

    ApproveLeaveCancellation: state.approveLeaveCancellation,
    ErrorApproveLeaveCancellation: state.errorApproveLeaveCancellation,
  }));

  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: LeaveCancellationDetails) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => {
    setViewModalIsOpen(false);
    setCurrentRowData({} as LeaveCancellationDetails);
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: LeaveCancellationDetails) => {
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
  const columnHelper = createColumnHelper<LeaveCancellationDetails>();
  const columns = [
    columnHelper.accessor('leaveApplicationId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfFiling', {
      header: 'Date of Filing',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employeeDetails.employeeName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('leaveName', {
      header: 'Leave Benefit',
      cell: (info) => UseRenderLeaveType(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderLeaveCancellationStatus(info.getValue()),
      filterFn: 'equals',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableColumnFilter: false,
      cell: (props) => (
        <div className="flex justify-start place-items-start">{renderRowActions(props.row.original)}</div>
      ),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: LeaveCancellations,
    columnVisibility: { leaveApplicationId: false },
  });

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveCancellations)) {
      SetLeaveCancellations(swrLeaveCancellations.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorLeaveCancellations(swrError.message);
    }
  }, [swrLeaveCancellations, swrError]);

  // clear
  useEffect(() => {
    if (!isEmpty(ApproveLeaveCancellation)) {
      mutateLeaveApplications();
      // setLeaveApplicationDetails({} as EmployeeLeaveDetails);
      // setCurrentRowData({} as MonitoringLeave);
      // setLeaveConfirmAction(null);
      // closeViewActionModal();
      // mutateLeaveApplications();
      // setTimeout(() => {
      //   EmptyResponseAndErrors();
      // }, 1500);
    }

    // if (!isEmpty(ErrorPatchLeaveApplication)) {
    //   setLeaveConfirmAction(null);

    //   setTimeout(() => {
    //     EmptyResponseAndErrors();
    //   }, 1500);
    // }
  }, [ApproveLeaveCancellation]);

  // useEffect(() => {
  //   console.log(LeaveCancellations);
  // }, [LeaveCancellations]);

  return (
    <div>
      <BreadCrumbs title="Leave Cancellations" />

      {/* Notifications */}
      {!isEmpty(ErrorLeaveCancellations) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve Leave Cancellations'} />
      ) : null}

      {!isEmpty(ApproveLeaveCancellation) ? (
        <ToastNotification toastType="success" notifMessage="Leave cancellation approved" />
      ) : null}

      {!isEmpty(ErrorApproveLeaveCancellation) ? (
        <ToastNotification toastType="error" notifMessage={ErrorApproveLeaveCancellation} />
      ) : null}

      <div className="sm:px-2 md:px-2 lg:px-5">
        <Card>
          {swrIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="flex flex-row flex-wrap">
              <DataTable model={table} showGlobalFilter={true} showColumnFilter={true} paginate={true} />
            </div>
          )}
        </Card>
      </div>

      {/* View modal */}
      <ViewLeaveCancellationModal
        modalState={viewModalIsOpen}
        setModalState={setViewModalIsOpen}
        closeModalAction={closeViewActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export default Index;
