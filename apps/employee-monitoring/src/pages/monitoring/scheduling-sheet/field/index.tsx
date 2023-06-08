import { DataTable, LoadingSpinner, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import AddFieldSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/field/AddFieldSsModal';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import {
  ScheduleSheet,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

export default function Index() {
  const {
    scheduleSheets,
    setSelectedScheduleId,
    getScheduleSheetsSuccess,
    getScheduleSheetsFail,
    getScheduleSheets,
  } = useScheduleSheetStore((state) => ({
    scheduleSheets: state.scheduleSheets,
    getScheduleSheetsSuccess: state.getScheduleSheetsSuccess,
    getScheduleSheetsFail: state.getScheduleSheetsFail,
    setSelectedScheduleId: state.setSelectedScheduleId,
    getScheduleSheets: state.getScheduleSheets,
  }));

  const {
    data: swrGroupSchedules,
    isLoading: swrGsIsLoading,
    error: swrGsError,
  } = useSWR(`/custom-groups/schedule-sheets`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  // add
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => {
    setAddModalIsOpen(true);
  };
  const closeAddActionModal = () => {
    setSelectedScheduleId('');
    setAddModalIsOpen(false);
  };

  // edit
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: ScheduleSheet) => {
    setEditModalIsOpen(true);
  };

  // delete
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: ScheduleSheet) => {
    setDeleteModalIsOpen(true);
  };
  const [currentRowData, setCurrentRowData] = useState<ScheduleSheet>(
    {} as ScheduleSheet
  );

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: ScheduleSheet) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </>
    );
  };

  // define table columns
  const columnHelper = createColumnHelper<ScheduleSheet>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('customGroupName', {
      enableSorting: false,
      header: () => 'Group Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('scheduleName', {
      enableSorting: false,
      header: () => 'Schedule Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.group({
      id: 'effectivityDate',
      header: () => (
        <span className="w-full text-center underline">Effectivity Date</span>
      ),

      columns: [
        columnHelper.accessor('dateFrom', {
          enableSorting: true,
          header: () => <span className="w-full text-center ">Date From</span>,
          cell: (info) => (
            <div className="w-full text-center">
              {transformDate(info.getValue())}
            </div>
          ),
        }),
        columnHelper.accessor('dateTo', {
          enableSorting: true,
          header: () => <span className="w-full text-center ">Date To</span>,
          cell: (info) => (
            <div className="w-full text-center">
              {transformDate(info.getValue())}
            </div>
          ),
        }),
      ],
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => (
        <div className="w-full text-center">
          {renderRowActions(props.row.original)}
        </div>
      ),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: swrGsIsLoading ? null : scheduleSheets,
    columnVisibility: { id: false },
  });

  // swr is loading
  useEffect(() => {
    if (swrGsIsLoading) {
      getScheduleSheets();
    }
  }, [swrGsIsLoading]);

  // success or fail gs
  useEffect(() => {
    // success
    if (!isEmpty(swrGroupSchedules)) {
      getScheduleSheetsSuccess(swrGroupSchedules.data);
    }

    // fail
    if (!isEmpty(swrGsError)) getScheduleSheetsFail(swrGsError);
  }, [swrGroupSchedules, swrGsError]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Schedule Sheet',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Field',
              path: '',
            },
          ]}
          title="Field Schedule Sheet"
        />

        <AddFieldSsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <Can I="access" this="Schedules">
          <div className="sm:mx-0 lg:mx-5">
            <Card>
              {swrGsIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Schedule
                      Sheet
                    </button>
                  </div>

                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={false}
                    paginate={true}
                  />
                </div>
              )}
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
