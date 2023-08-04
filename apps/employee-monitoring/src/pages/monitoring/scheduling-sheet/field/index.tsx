import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
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
import ViewFieldSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/field/ViewFieldSsModal';
import DeleteFieldSsModal from 'apps/employee-monitoring/src/components/modal/monitoring/scheduling-sheet/field/DeleteFieldSsModal';

export default function Index() {
  const {
    postResponse,
    deleteResponse,
    updateResponse,
    scheduleSheets,
    getScheduleSheets,
    setSelectedScheduleId,
    getScheduleSheetsFail,
    emptyResponseAndErrors,
    getScheduleSheetsSuccess,
    errorScheduleSheets,
  } = useScheduleSheetStore((state) => ({
    scheduleSheets: state.scheduleSheets,
    postResponse: state.scheduleSheet.postResponse,
    updateResponse: state.scheduleSheet.updateResponse,
    deleteResponse: state.scheduleSheet.deleteResponse,
    getScheduleSheets: state.getScheduleSheets,
    getScheduleSheetsFail: state.getScheduleSheetsFail,
    setSelectedScheduleId: state.setSelectedScheduleId,
    emptyResponseAndErrors: state.emptyResponseAndErrors,
    getScheduleSheetsSuccess: state.getScheduleSheetsSuccess,
    errorScheduleSheets: state.error.errorScheduleSheets,
  }));

  const {
    data: swrGroupSchedules,
    isLoading: swrGsIsLoading,
    error: swrGsError,
    mutate: swrMutate,
  } = useSWR(`/custom-groups/schedule-sheets`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  // add
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => {
    setSelectedScheduleId('');
    setAddModalIsOpen(false);
  };

  // view
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
    } as ScheduleSheet);
    setViewModalIsOpen(false);
  };

  // delete
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  // open delete action
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

  // close delete action
  const closeDeleteActionModal = () => {
    setCurrentRowData({
      customGroupId: '',
      dateFrom: '',
      dateTo: '',
      scheduleId: '',
      customGroupName: '',
      scheduleName: '',
    } as ScheduleSheet);
    setDeleteModalIsOpen(false);
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
          onClick={() => openViewActionModal(rowData)}
        >
          <i className="bx bx-show"></i>
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

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: swrGsIsLoading ? null : scheduleSheets,
    columnVisibility: { id: false },
  });

  // response listener
  useEffect(() => {
    if (
      !isEmpty(postResponse) ||
      !isEmpty(updateResponse) ||
      !isEmpty(deleteResponse) ||
      !isEmpty(errorScheduleSheets)
    ) {
      swrMutate();
      setTimeout(() => {
        emptyResponseAndErrors();
      }, 1000);
    }
  }, [postResponse, updateResponse, deleteResponse, errorScheduleSheets]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Scheduling Sheet',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Field',
              path: '',
            },
          ]}
          title="Field Scheduling Sheet"
        />

        {!isEmpty(swrGsError) ? (
          <ToastNotification
            toastType="error"
            notifMessage={swrGsError.message}
          />
        ) : null}

        {!isEmpty(postResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully Added a Scheduling Sheet!"
          />
        ) : null}

        {!isEmpty(updateResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully Updated the Scheduling Sheet!"
          />
        ) : null}

        {!isEmpty(deleteResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully deleted the Scheduling Sheet!"
          />
        ) : null}

        <AddFieldSsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <ViewFieldSsModal
          modalState={viewModalIsOpen}
          setModalState={setViewModalIsOpen}
          closeModalAction={closeViewActionModal}
          rowData={currentRowData}
        />

        <DeleteFieldSsModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={closeDeleteActionModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Schedules">
          <div className="sm:px-2 md:px-2 lg:px-5">
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
                      <i className="bx bxs-plus-square"></i>&nbsp; Add
                      Scheduling Sheet
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
