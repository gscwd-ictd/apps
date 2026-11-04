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
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
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
              {isLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap justify-between">
                  {/* filters: same input style and position as the Travel Orders page */}
                  <div className="flex items-center justify-end order-2 w-1/2 gap-2 table-actions-wrapper">
                    <LabelInput
                      id="dateFrom"
                      type="date"
                      title="DTR date from"
                      value={dateFrom}
                      max={dateTo}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <LabelInput
                      id="dateTo"
                      type="date"
                      title="DTR date to"
                      value={dateTo}
                      min={dateFrom}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                    <select
                      id="status"
                      title="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="rounded-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:cursor-pointer outline-none text-xs text-gray-900 h-[2.5rem] p-2.5"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label === 'All' ? 'All Status' : s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
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