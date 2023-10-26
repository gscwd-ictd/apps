/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { EmployeeLeaveDetails, MonitoringLeave } from 'libs/utils/src/lib/types/leave-application.type';

import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, useDataTable, fuzzySort, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Card } from '../../../components/cards/Card';
import { BreadCrumbs } from '../../../components/navigations/BreadCrumbs';
import ViewLeaveApplicationModal from 'apps/employee-monitoring/src/components/modal/monitoring/leave-applications/ViewLeaveApplicationModal';
import dayjs from 'dayjs';
import UseRenderLeaveStatus from 'apps/employee-monitoring/src/utils/functions/RenderLeaveStatus';
import UseRenderLeaveType from 'apps/employee-monitoring/src/utils/functions/RenderLeaveType';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<MonitoringLeave>({} as MonitoringLeave);

  // fetch data for list of leave applications
  const {
    data: swrLeaveApplication,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateLeaveApplications,
  } = useSWR('/leave/hrmo', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: MonitoringLeave) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => {
    setViewModalIsOpen(false);
    setCurrentRowData({} as MonitoringLeave);
  };

  // Rendering of leave dates in row
  const renderRowLeaveDates = (leaveDates: Array<string>) => {
    if (leaveDates) {
      if (leaveDates.length > 4) {
        return (
          <span className="bg-gray-300 text-gray-700 text-xs font-mono px-1 py-0.5 ml-1 rounded text-center">
            {leaveDates[0]} to {leaveDates.slice(-1)}
          </span>
        );
      } else {
        return leaveDates.map((leaveDate: string, index: number) => (
          <span
            className="bg-gray-300 text-gray-700 text-xs font-mono px-1 py-0.5 ml-1 rounded text-center"
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
    // leaveId
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfFiling', {
      header: 'Date of Filing',
      filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employee.employeeName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('leaveName', {
      header: 'Leave Benefit',
      cell: (info) => UseRenderLeaveType(info.getValue()),
    }),
    columnHelper.display({
      id: 'leaveDates',
      header: 'Leave Dates',
      enableColumnFilter: false,
      cell: (props) => renderRowLeaveDates(props.row.original.leaveDates),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderLeaveStatus(info.getValue()),
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

  // Zustand initialization
  const {
    LeaveApplication,
    LeaveApplications,
    IsLoading,
    ErrorLeaveApplications,
    ErrorPatchLeaveApplication,
    ErrorLeaveApplicationDetails,
    EmptyResponseAndErrors,
    setLeaveConfirmAction,
    GetLeaveApplications,
    GetLeaveApplicationsSuccess,
    GetLeaveApplicationsFail,
    setLeaveApplicationDetails,
  } = useLeaveApplicationStore((state) => ({
    LeaveApplication: state.leaveApplication.patchResponse,
    LeaveApplications: state.leaveApplications,
    IsLoading: state.loading.loadingLeaveApplications,
    ErrorLeaveApplications: state.error.errorLeaveApplications,
    ErrorLeaveApplicationDetails: state.error.errorLeaveApplicationDetails,
    ErrorPatchLeaveApplication: state.error.errorPatchLeaveApplication,
    setLeaveApplicationDetails: state.setLeaveApplicationDetails,
    GetLeaveApplications: state.getLeaveApplications,
    GetLeaveApplicationsSuccess: state.getLeaveApplicationsSuccess,
    GetLeaveApplicationsFail: state.getLeaveApplicationsFail,
    EmptyResponseAndErrors: state.emptyResponseAndErrors,
    setLeaveConfirmAction: state.setLeaveConfirmAction,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: LeaveApplications,
    columnVisibility: { id: false, employeeId: false },
  });

  // UNCOMMENT IF leave application route is active
  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetLeaveApplications();
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveApplication)) {
      GetLeaveApplicationsSuccess(swrLeaveApplication.data);
    }

    if (!isEmpty(swrError)) {
      GetLeaveApplicationsFail(swrError.message);
    }
  }, [swrLeaveApplication, swrError]);

  // clear
  useEffect(() => {
    if (!isEmpty(LeaveApplication)) {
      setLeaveApplicationDetails({} as EmployeeLeaveDetails);
      setCurrentRowData({} as MonitoringLeave);
      setLeaveConfirmAction(null);
      closeViewActionModal();
      mutateLeaveApplications();
      setTimeout(() => {
        EmptyResponseAndErrors();
      }, 1500);
    }

    if (!isEmpty(ErrorPatchLeaveApplication)) {
      setLeaveConfirmAction(null);

      setTimeout(() => {
        EmptyResponseAndErrors();
      }, 1500);
    }
  }, [LeaveApplication]);

  return (
    <div>
      <BreadCrumbs title="Leave Applications" />

      {/* Error Notifications */}
      {!isEmpty(ErrorLeaveApplications) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve Leave Applications'} />
      ) : null}

      {/* Success Notifications */}
      {!isEmpty(LeaveApplication) ? (
        <ToastNotification toastType="success" notifMessage="Updated Leave Application successfully" />
      ) : null}

      {!isEmpty(ErrorLeaveApplicationDetails) ? (
        <ToastNotification
          toastType="error"
          notifMessage="Cannot retrieve Leave Application details, please try again later!"
        />
      ) : null}

      {!isEmpty(ErrorPatchLeaveApplication) ? (
        <ToastNotification
          toastType="error"
          notifMessage="A problem has been encountered, please try in a few seconds!"
        />
      ) : null}

      <div className="sm:px-2 md:px-2 lg:px-5">
        <Card>
          {IsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="flex flex-row flex-wrap">
              <DataTable model={table} showGlobalFilter={true} showColumnFilter={true} paginate={true} />
            </div>
          )}
        </Card>
      </div>

      {/* View modal */}
      <ViewLeaveApplicationModal
        modalState={viewModalIsOpen}
        setModalState={setViewModalIsOpen}
        closeModalAction={closeViewActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export default Index;
