/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import ViewTimeLogCorrectionModal from 'apps/employee-monitoring/src/components/modal/monitoring/time-log-corrections/ViewTimeLogCorrectionModal';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import RenderTimeLogCorrectionStatus from 'apps/employee-monitoring/src/utils/functions/RenderTimeLogCorrectionStatus';
import { TimeLogCorrection } from 'apps/employee-monitoring/src/utils/types/time-log-correction.type';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const STATUSES = [
  { label: 'All', value: '' },
  { label: 'For Approval', value: 'for approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Disapproved', value: 'disapproved' },
];

/** Monitoring > Time Log Corrections: every TLC request filed by employees (view only). */
export default function Index() {
  const [dateFrom, setDateFrom] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [status, setStatus] = useState<string>('');
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const [currentRowData, setCurrentRowData] = useState<TimeLogCorrection>({} as TimeLogCorrection);

  const { data, error, isLoading } = useSWR(
    `/dtr-correction/hr?date_from=${dateFrom}&date_to=${dateTo}&status=${encodeURIComponent(status)}`,
    fetcherEMS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );
  const rows: Array<TimeLogCorrection> = useMemo(() => (isEmpty(data?.data) ? [] : data.data), [data]);

  const openViewModal = (rowData: TimeLogCorrection) => {
    setCurrentRowData(rowData);
    setViewModalIsOpen(true);
  };
  const closeViewModal = () => setViewModalIsOpen(false);

  const columnHelper = createColumnHelper<TimeLogCorrection>();
  const columns = [
    columnHelper.accessor('id', { cell: (info) => info.getValue() }),
    columnHelper.accessor('employeeFullName', {
      header: 'Employee',
      cell: (info) => info.getValue() ?? '-',
    }),
    columnHelper.accessor('assignment', {
      header: 'Assignment',
      cell: (info) => info.getValue() ?? '-',
    }),
    columnHelper.accessor('dtrDate', {
      header: 'DTR Date',
      cell: (info) => dayjs(info.getValue()).format('MMM DD, YYYY'),
    }),
    columnHelper.accessor('dateFiled', {
      header: 'Date Filed',
      cell: (info) => (info.getValue() ? dayjs(info.getValue()).format('MMM DD, YYYY hh:mm A') : '-'),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'equals',
      cell: (info) => RenderTimeLogCorrectionStatus(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      enableColumnFilter: false,
      cell: (props) => (
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
          onClick={() => openViewModal(props.row.original)}
        >
          <i className="bx bx-show"></i>
        </button>
      ),
    }),
  ];

  const { table } = useDataTable({ columns, data: rows, columnVisibility: { id: false } });

  return (
    <>
      <Can I="access" this="Time_log_corrections">
        <div className="w-full">
          <BreadCrumbs
            title="Time Log Corrections"
            crumbs={[
              { layerNo: 1, layerText: 'Monitoring', path: '' },
              { layerNo: 2, layerText: 'Time Log Corrections', path: '' },
            ]}
          />

          {!isEmpty(error) ? (
            <ToastNotification
              toastType="error"
              notifMessage={`Failed to load time log corrections: ${error.message}`}
            />
          ) : null}

          {!isEmpty(currentRowData) ? (
            <ViewTimeLogCorrectionModal
              rowData={currentRowData}
              modalState={viewModalIsOpen}
              setModalState={setViewModalIsOpen}
              closeModalAction={closeViewModal}
            />
          ) : null}

          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              <div className="flex flex-wrap items-end gap-3 mb-4 text-sm">
                <label className="flex flex-col">
                  <span className="text-gray-500">DTR date from</span>
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-gray-500">DTR date to</span>
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-gray-500">Status</span>
                  <select
                    className="border rounded px-2 py-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="ml-auto text-gray-500">{rows.length} request(s)</span>
              </div>

              {isLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
              )}
            </Card>
          </div>
        </div>
      </Can>

      <Can not I="access" this="Time_log_corrections">
        <Navigate to="/page-404" />
      </Can>
    </>
  );
}
