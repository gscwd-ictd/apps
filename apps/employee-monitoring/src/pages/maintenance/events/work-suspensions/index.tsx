/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import fetcherEMS from '../../../../../src/utils/fetcher/FetcherEMS';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { WorkSuspension, WorkSuspensionType } from 'apps/employee-monitoring/src/utils/types/work-suspension.type';

import { DataTable, useDataTable, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';

import WorkSuspensionFormModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/work-suspensions/WorkSuspensionFormModal';
import DeleteWorkSuspensionModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/work-suspensions/DeleteWorkSuspensionModal';

const errorByStatus = (status?: number) => {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Work suspensions not found';
    case 500:
      return 'Internal Server Error';
    default:
      return 'An error occurred. Please try again later.';
  }
};

const currentYear = dayjs().year();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + 1 - i);

const Index = () => {
  const [year, setYear] = useState<number>(currentYear);
  const [formModalIsOpen, setFormModalIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<WorkSuspension | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    data: workSuspensions,
    error: workSuspensionsError,
    isLoading: workSuspensionsLoading,
    mutate: mutateWorkSuspensions,
  } = useSWR(`/work-suspension?from=${year}-01-01&to=${year}-12-31`, fetcherEMS, {});

  const rows: Array<WorkSuspension> = useMemo(() => workSuspensions?.data ?? [], [workSuspensions]);

  useEffect(() => {
    if (workSuspensionsError)
      setToast({ type: 'error', message: errorByStatus(workSuspensionsError?.response?.status) });
  }, [workSuspensionsError]);

  // clear toast after 5 s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSuccess = (message: string) => {
    setToast({ type: 'success', message });
    mutateWorkSuspensions();
  };

  const openAdd = () => {
    setSelectedRow(null);
    setFormModalIsOpen(true);
  };
  const openEdit = (row: WorkSuspension) => {
    setSelectedRow(row);
    setFormModalIsOpen(true);
  };
  const openDelete = (row: WorkSuspension) => {
    setSelectedRow(row);
    setDeleteModalIsOpen(true);
  };

  const renderType = (row: WorkSuspension) => {
    if (row.suspensionType === WorkSuspensionType.WHOLE_DAY) return 'Whole day';
    if (row.suspensionType === WorkSuspensionType.TIME_OF_DAY) return 'Time of day';
    return `Legacy (${row.suspensionHours ?? 0} hrs)`;
  };

  const renderStatus = (row: WorkSuspension) =>
    row.isArchived ? (
      <span className="bg-gray-200 text-gray-700 text-xs font-mono px-1 py-0.5 rounded">Archived</span>
    ) : (
      <span className="bg-green-200 text-green-800 text-xs font-mono px-1 py-0.5 rounded">Active</span>
    );

  const renderRowActions = (row: WorkSuspension) =>
    row.isArchived || row.suspensionType === WorkSuspensionType.LEGACY ? (
      <span className="text-xs text-gray-400">Read-only</span>
    ) : (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openEdit(row)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>
        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDelete(row)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );

  const columnHelper = createColumnHelper<WorkSuspension>();
  const columns = [
    columnHelper.accessor('id', { cell: (info) => info.getValue() }),
    columnHelper.accessor('name', { enableSorting: true, header: () => 'Name', cell: (info) => info.getValue() }),
    columnHelper.accessor('suspensionDate', {
      enableSorting: true,
      header: () => 'Suspension Date',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('suspensionType', {
      header: () => 'Type',
      cell: (info) => renderType(info.row.original),
    }),
    columnHelper.accessor('suspensionStartTime', {
      header: () => 'Starts',
      cell: (info) =>
        info.row.original.suspensionType === WorkSuspensionType.TIME_OF_DAY && info.getValue()
          ? dayjs(`2000-01-01 ${info.getValue()}`).format('hh:mm A')
          : '-',
    }),
    columnHelper.accessor('isArchived', { header: () => 'Status', cell: (info) => renderStatus(info.row.original) }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  const { table } = useDataTable({ columns, data: rows, columnVisibility: { id: false } });

  return (
    <div className="w-full">
      <BreadCrumbs title="Work Suspensions" />
      {toast ? <ToastNotification toastType={toast.type} notifMessage={toast.message} /> : null}

      <Can I="access" this="Event_work_suspensions">
        <div className="mx-5">
          <Card>
            {workSuspensionsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="flex flex-row flex-wrap">
                {/* DataTable renders the search box as order-1 w-1/2; page actions go in the order-2 w-1/2 slot */}
                <div className="flex items-center justify-end order-2 w-1/2 gap-2 table-actions-wrapper">
                  <label htmlFor="year" className="text-sm text-gray-700">
                    Year
                  </label>
                  <select
                    id="year"
                    className="p-2 w-[10%] text-xs border border-gray-300 rounded-md"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2"
                    onClick={openAdd}
                  >
                    <i className="bx bxs-plus-square"></i>&nbsp; Add Work Suspension
                  </button>
                </div>
                <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
              </div>
            )}
          </Card>
        </div>

        <WorkSuspensionFormModal
          modalState={formModalIsOpen}
          setModalState={setFormModalIsOpen}
          closeModalAction={() => setFormModalIsOpen(false)}
          rowData={selectedRow}
          onSuccess={handleSuccess}
        />

        <DeleteWorkSuspensionModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={() => setDeleteModalIsOpen(false)}
          rowData={selectedRow}
          onSuccess={handleSuccess}
        />
      </Can>
    </div>
  );
};

export default Index;
