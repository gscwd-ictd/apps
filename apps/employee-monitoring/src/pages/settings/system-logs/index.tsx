import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
// import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
// import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { useSystemLogsStore } from 'apps/employee-monitoring/src/store/system-logs.store';
import { SystemLog } from 'apps/employee-monitoring/src/utils/types/system-logs.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

// modals
// import AddOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/AddOfficerOfTheDayModal';
// import DeleteOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/DeleteOfficerOfTheDayModal';
import ViewSystemLogModal from 'apps/employee-monitoring/src/components/modal/settings/system-logs/ViewSystemLogModal';

// sample static data
const SystemLogs: SystemLog[] = [
  { _id: '2001', userName: 'Jeric', dateLogged: '2000-05-13', timeLogged: '12:00 PM', method: 'GET', route: '/api/logs', body: {} },
  { _id: '2002', userName: 'Lloyd', dateLogged: '2001-05-13', timeLogged: '12:00 PM', method: '', route: '', body: {} },
];

const Index = () => {
  // Current row data in the table that has been clicked
  //   const [currentRowData, setCurrentRowData] = useState<OfficerOfTheDay>({} as OfficerOfTheDay);

  // fetch data for list of officer of the day
  const {
    data: swrSystemLogs,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateOfficersOfTheDay,
  } = useSWR('/system-logs', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: SystemLog) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  // Delete modal function
  // const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  // open delete action
  // const openDeleteActionModal = (rowData: SystemLog) => {
  //   setDeleteModalIsOpen(true);
  //   setCurrentRowData(rowData);
  // };

  // close delete action
  // const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  const [currentRowData, setCurrentRowData] = useState<SystemLog>({} as SystemLog);

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

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
    columnHelper.accessor('_id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userName', {
      enableSorting: true,
      header: () => 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateLogged', {
      enableSorting: true,
      header: () => 'Date and Time Logged',
      cell: (info: any) => {
        const dateLogged = info.row.original.dateLogged;
        const timeLogged = info.row.original.timeLogged;
        return (
          <>
            {transformDate(dateLogged)} {timeLogged}
          </>
        );
      },
    }),

    // columnHelper.accessor('dateLogged', {
    //   enableSorting: true,
    //   header: () => <span className="w-full text-center">Date Logged</span>,
    //   cell: (info) => <div className="w-full text-center">{transformDate(info.getValue())}</div>,
    // }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];

  // Zustand initialization

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: SystemLogs,
    columnVisibility: { _id: false },
  });

  // Reset responses on load of page

  // Initial zustand state update

  // Upon success/fail of swr request, zustand state will be updated

  // Reset responses from all modal actions

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="System Logs" />
        <Can I="access" this="Officer_of_the_day">
          <div className="mx-5">
            <Card>
              {swrIsLoading ? (
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
