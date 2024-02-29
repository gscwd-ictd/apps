import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { useSystemLogsStore } from 'apps/employee-monitoring/src/store/system-log.store';
import { SystemLog } from 'apps/employee-monitoring/src/utils/types/system-log.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

// modals
import ViewSystemLogModal from 'apps/employee-monitoring/src/components/modal/settings/system-logs/ViewSystemLogModal';

const Index = () => {
  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: SystemLog) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  const [currentRowData, setCurrentRowData] = useState<SystemLog>({} as SystemLog);

  // fetch data for list of user
  const {
    data: systemLogs,
    error: systemLogsError,
    isLoading: systemLogsLoading,
  } = useSWR('/user-logs', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const {
    SystemLogs,
    SetGetSystemLogs,

    ErrorSystemLogs,
    SetErrorSystemLogs,
  } = useSystemLogsStore((state) => ({
    SystemLogs: state.getSystemLogs,
    SetGetSystemLogs: state.setGetSystemLogs,

    ErrorSystemLogs: state.errorSystemLogs,
    SetErrorSystemLogs: state.setErrorSystemLogs,
  }));

  // Render row actions in the table component
  const renderRowActions = (rowData: SystemLog) => {
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
  const columnHelper = createColumnHelper<SystemLog>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userFullName', {
      enableSorting: true,
      header: () => 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateLogged', {
      enableSorting: true,
      header: () => 'Date and Time Logged',
      cell: (info) => {
        const dateLogged = info.getValue();
        const formattedDate = dayjs(dateLogged).format('MMMM DD, YYYY HH:mm A');
        return <>{formattedDate}</>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: SystemLogs,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (!isEmpty(systemLogs)) {
      SetGetSystemLogs(systemLogs.data);
    }

    if (!isEmpty(systemLogsError)) {
      SetErrorSystemLogs(systemLogsError);
    }
  }, [systemLogs, systemLogsError]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="System Logs" />
        {/* Notifications */}
        {!isEmpty(ErrorSystemLogs) ? <ToastNotification toastType="error" notifMessage={ErrorSystemLogs} /> : null}

        <Can I="access" this="System_logs">
          <div className="mx-5">
            <Card>
              {systemLogsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper"></div>
                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* View modal */}
          <ViewSystemLogModal
            modalState={viewModalIsOpen}
            setModalState={setViewModalIsOpen}
            closeModalAction={closeViewActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
