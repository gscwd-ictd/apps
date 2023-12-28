import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import AddStationSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/station/AddStationSsModal.tsx';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import {
  CurrentScheduleSheet,
  ScheduleSheet,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import ViewStationSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/station/ViewStationSsModal';
import DeleteStationSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/station/DeleteStationSsModal';

export default function Index() {
  const {
    scheduleSheets,
    postScheduleSheets,
    deleteScheduleSheets,

    getScheduleSheets,
    setSelectedScheduleId,
    getScheduleSheetsFail,
    emptyResponseAndErrors,
    getScheduleSheetsSuccess,
    errorScheduleSheets,
  } = useScheduleSheetStore((state) => ({
    scheduleSheets: state.scheduleSheets,
    postScheduleSheets: state.postScheduleSheetResponse,
    deleteScheduleSheets: state.deleteScheduleSheetResponse,

    getScheduleSheets: state.getScheduleSheets,
    getScheduleSheetsFail: state.getScheduleSheetsFail,
    setSelectedScheduleId: state.setSelectedScheduleId,
    emptyResponseAndErrors: state.emptyResponseAndErrors,
    getScheduleSheetsSuccess: state.getScheduleSheetsSuccess,
    errorScheduleSheets: state.error.errorScheduleSheets,
  }));

  const {
    data: swrSchedulingSheets,
    isLoading: swrSchedulingSheetsIsLoading,
    error: swrSchedulingSheetsError,
    mutate: swrMutateSchedulingSheets,
  } = useSWR(`/custom-groups/schedule-sheets?schedule_base=pumping station`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => {
    setSelectedScheduleId('');
    setAddModalIsOpen(false);
  };

  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: ScheduleSheet) => {
    setCurrentRowData({
      ...currentRowData,
      customGroupId: rowData.id,
      customGroupName: rowData.customGroupName,
      dateFrom: rowData.dateFrom,
      dateTo: rowData.dateTo,
      scheduleId: rowData.scheduleId,
      scheduleName: rowData.scheduleName,
    });
    setViewModalIsOpen(true);
  };
  const closeViewActionModal = () => {
    setCurrentRowData({
      customGroupId: '',
      dateFrom: '',
      dateTo: '',

      scheduleId: '',
      customGroupName: '',
      scheduleName: '',
    } as CurrentScheduleSheet);
    setViewModalIsOpen(false);
  };

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: ScheduleSheet) => {
    setCurrentRowData({
      ...currentRowData,
      customGroupId: rowData.id,
      customGroupName: rowData.customGroupName,
      dateFrom: rowData.dateFrom,
      dateTo: rowData.dateTo,
      scheduleId: rowData.scheduleId,
      scheduleName: rowData.scheduleName,
    });
    setDeleteModalIsOpen(true);
  };
  const closeDeleteActionModal = () => {
    setCurrentRowData({
      customGroupId: '',
      dateFrom: '',
      dateTo: '',
      scheduleId: '',
      customGroupName: '',
      scheduleName: '',
    } as CurrentScheduleSheet);
    setDeleteModalIsOpen(false);
  };

  const [currentRowData, setCurrentRowData] = useState<CurrentScheduleSheet>({} as CurrentScheduleSheet);

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
          onClick={() => openViewActionModal(rowData)}
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
      header: () => <span className="w-full text-center underline">Effectivity Date</span>,

      columns: [
        columnHelper.accessor('dateFrom', {
          enableSorting: true,
          header: () => <span className="w-full text-center ">Date From</span>,
          cell: (info) => <div className="w-full text-center">{transformDate(info.getValue())}</div>,
        }),
        columnHelper.accessor('dateTo', {
          enableSorting: true,
          header: () => <span className="w-full text-center ">Date To</span>,
          cell: (info) => <div className="w-full text-center">{transformDate(info.getValue())}</div>,
        }),
      ],
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];

  // swr is loading
  useEffect(() => {
    if (swrSchedulingSheetsIsLoading) {
      getScheduleSheets();
    }
  }, [swrSchedulingSheetsIsLoading]);

  // success or fail gs
  useEffect(() => {
    // success
    if (!isEmpty(swrSchedulingSheets)) {
      getScheduleSheetsSuccess(swrSchedulingSheets.data);
    }

    // fail
    if (!isEmpty(swrSchedulingSheetsError)) getScheduleSheetsFail(swrSchedulingSheetsError);
  }, [swrSchedulingSheets, swrSchedulingSheetsError]);

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: swrSchedulingSheetsIsLoading ? null : scheduleSheets,
    columnVisibility: { id: false },
  });

  // response listener
  useEffect(() => {
    if (!isEmpty(postScheduleSheets) || !isEmpty(deleteScheduleSheets) || !isEmpty(errorScheduleSheets)) {
      swrMutateSchedulingSheets();
      setTimeout(() => {
        emptyResponseAndErrors();
      }, 2500);
    }
  }, [postScheduleSheets, deleteScheduleSheets, errorScheduleSheets]);

  return (
    <>
      <div>
        <BreadCrumbs
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Scheduling Sheet',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Station',
              path: '',
            },
          ]}
          title="Station Scheduling Sheet"
        />

        {!isEmpty(swrSchedulingSheetsError) ? (
          <ToastNotification toastType="error" notifMessage={swrSchedulingSheetsError.message} />
        ) : null}

        {!isEmpty(postScheduleSheets) ? (
          <ToastNotification toastType="success" notifMessage="Successfully Added a Scheduling Sheet!" />
        ) : null}

        {!isEmpty(deleteScheduleSheets) ? (
          <ToastNotification toastType="success" notifMessage="Successfully deleted the Scheduling Sheet!" />
        ) : null}

        <AddStationSsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <ViewStationSsModal
          modalState={viewModalIsOpen}
          setModalState={setViewModalIsOpen}
          closeModalAction={closeViewActionModal}
          rowData={currentRowData}
        />

        <DeleteStationSsModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={closeDeleteActionModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Schedules">
          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              {swrSchedulingSheetsIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Scheduling Sheet
                    </button>
                  </div>

                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={false}
                    paginate={!isEmpty(scheduleSheets) ? true : false}
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
