import { useEffect, useMemo, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { useSystemLogsStore } from 'apps/employee-monitoring/src/store/system-log.store';
import { SystemLog } from 'apps/employee-monitoring/src/utils/types/system-log.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

// modals
import ViewSystemLogModal from 'apps/employee-monitoring/src/components/modal/settings/system-logs/ViewSystemLogModal';

const formatLogged = (dateLogged: string) => (dateLogged ? dayjs(dateLogged).format('MMMM DD, YYYY hh:mm A') : '');

/** System Logs: who did what and when. Filters: date from / to (default: the last 30 days) and name. */
const Index = () => {
  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const [currentRowData, setCurrentRowData] = useState<SystemLog>({} as SystemLog);
  const openViewActionModal = (rowData: SystemLog) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  // filters
  const [dateFrom, setDateFrom] = useState<string>(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const validRange = !!dateFrom && !!dateTo && dateFrom <= dateTo;

  // fetch system logs of the date range
  const {
    data: systemLogs,
    error: systemLogsError,
    isLoading: systemLogsLoading,
  } = useSWR(validRange ? `/user-logs?date_from=${dateFrom}&date_to=${dateTo}` : null, fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const { SystemLogs, SetGetSystemLogs, ErrorSystemLogs, SetErrorSystemLogs } = useSystemLogsStore((state) => ({
    SystemLogs: state.getSystemLogs,
    SetGetSystemLogs: state.setGetSystemLogs,
    ErrorSystemLogs: state.errorSystemLogs,
    SetErrorSystemLogs: state.setErrorSystemLogs,
  }));

  const logs = useMemo(() => (Array.isArray(SystemLogs) ? SystemLogs : []), [SystemLogs]);

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
      cell: (info) => formatLogged(info.getValue()),
    }),
    columnHelper.accessor('action', {
      enableSorting: true,
      header: () => 'Actions',
      cell: (props) => (
        <div className="flex items-center justify-between gap-3">
          <span>{props.getValue()}</span>
          <button
            type="button"
            title="View details"
            className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
            onClick={() => openViewActionModal(props.row.original)}
          >
            <i className="bx bx-show"></i>
          </button>
        </div>
      ),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: logs,
    columnVisibility: { id: false },
  });

  const downloadExcel = () => {
    const search = String(table.getState().globalFilter ?? '').trim();
    const rows = table.getPrePaginationRowModel().rows.map((row) => row.original);
    const aoa = [
      ['SYSTEM LOGS'],
      [
        `${dayjs(dateFrom).format('MMMM DD, YYYY')} - ${dayjs(dateTo).format('MMMM DD, YYYY')}${
          search ? ` | Search: ${search}` : ''
        }`,
      ],
      [],
      ['No.', 'Name', 'Date and Time Logged', 'Actions'],
      ...rows.map((log, index) => [index + 1, log.userFullName, formatLogged(log.dateLogged), log.action]),
    ];
    const sheet = XLSX.utils.aoa_to_sheet(aoa);
    sheet['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 28 }, { wch: 70 }];
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'System Logs');
    XLSX.writeFile(book, `System Logs ${dateFrom} to ${dateTo}.xlsx`);
  };

  // Initial zustand state update
  useEffect(() => {
    if (systemLogs) {
      SetGetSystemLogs(systemLogs.data ?? []);
    }

    if (!isEmpty(systemLogsError)) {
      switch (systemLogsError?.response?.status) {
        case 400:
          SetErrorSystemLogs('Bad Request');
          break;
        case 401:
          SetErrorSystemLogs('Unauthorized');
          break;
        case 403:
          SetErrorSystemLogs('Forbidden');
          break;
        case 404:
          SetErrorSystemLogs('System logs not found');
          break;
        case 500:
          SetErrorSystemLogs('Internal Server Error');
          break;
        default:
          SetErrorSystemLogs('An error occurred. Please try again later.');
          break;
      }
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
              {/* Date filter (top right, like the other EMS pages); name search is the table search box */}
              <div className="flex flex-row flex-wrap items-end justify-end gap-2 mb-2">
                <LabelInput
                  id="dateFrom"
                  label="Date from"
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <LabelInput
                  id="dateTo"
                  label="Date to"
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  max={dayjs().format('YYYY-MM-DD')}
                  onChange={(e) => setDateTo(e.target.value)}
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={logs.length === 0}
                  onClick={downloadExcel}
                >
                  <i className="bx bxs-file-export"></i>
                  Download Excel
                </button>
              </div>

              {!validRange ? (
                <p className="text-sm text-red-500">Date from must be on or before date to.</p>
              ) : systemLogsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
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
