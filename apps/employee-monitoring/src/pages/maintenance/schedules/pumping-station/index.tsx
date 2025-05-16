/* eslint-disable react-hooks/exhaustive-deps */
import { DataTable, useDataTable, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { createColumnHelper } from '@tanstack/react-table';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseConvertDayToTime from 'apps/employee-monitoring/src/utils/functions/ConvertDateToTime';
import UseRenderShiftType from 'apps/employee-monitoring/src/utils/functions/RenderShiftType';
import UseRenderScheduleType from 'apps/employee-monitoring/src/utils/functions/RenderScheduleType';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import EditStationSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/station/EditStationSchedModal';
import AddStationSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/station/AddStationSchedModal';
import DeleteStationSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/station/DeleteStationSchedModal';

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setAction = useScheduleStore((state) => state.setAction);
  const [currentRowData, setCurrentRowData] = useState<Schedule>({} as Schedule);

  const {
    Schedules,
    PostResponse,
    UpdateResponse,
    DeleteResponse,
    IsLoading,
    ScheduleError,
    SchedulesError,
    GetSchedules,
    GetSchedulesSuccess,
    GetSchedulesFail,
    EmptyResponse,
    EmptyErrors,
  } = useScheduleStore((state) => ({
    Schedules: state.schedules,
    PostResponse: state.schedule.postResponse,
    UpdateResponse: state.schedule.updateResponse,
    DeleteResponse: state.schedule.deleteResponse,
    IsLoading: state.loading.loadingSchedules,
    ScheduleError: state.error.errorSchedule,
    SchedulesError: state.error.errorSchedules,
    GetSchedules: state.getSchedules,
    GetSchedulesSuccess: state.getSchedulesSuccess,
    GetSchedulesFail: state.getSchedulesFail,
    EmptyResponse: state.emptyResponse,
    EmptyErrors: state.emptyErrors,
  }));

  const setModalIsOpen = useScheduleStore((state) => state.setModalIsOpen);

  // use SWR
  const {
    data: swrSchedules,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateSchedules,
  } = useSWR('/schedules?base=Pumping%20Station', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Schedule) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  // open delete action
  const openDeleteActionModal = (rowData: Schedule) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };

  // close delete action
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: Schedule) => {
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
  const columnHelper = createColumnHelper<Schedule>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      enableSorting: false,
      header: () => 'Schedule Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('scheduleType', {
      enableSorting: false,
      header: () => 'Category',
      cell: (info) => <div className="w-[6rem]">{UseRenderScheduleType(info.getValue())}</div>,
    }),
    columnHelper.accessor('timeIn', {
      enableSorting: false,
      header: () => 'Time In',
      cell: (info) => UseConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('timeOut', {
      enableSorting: false,
      header: () => 'Time Out',
      cell: (info) => UseConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('lunchOut', {
      enableSorting: false,
      header: () => 'Lunch Out',
      cell: (info) => UseConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('lunchIn', {
      enableSorting: false,
      header: () => 'Lunch In',
      cell: (info) => UseConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('shift', {
      enableSorting: false,
      header: () => 'Shift',
      cell: (info) => <div className="w-[6rem]">{UseRenderShiftType(info.getValue())}</div>,
    }),

    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: Schedules,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetSchedules();
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrSchedules)) {
      GetSchedulesSuccess(swrSchedules.data);
    }

    if (!isEmpty(swrError)) {
      GetSchedulesFail(swrError);
    }
  }, [swrSchedules, swrError]);

  // mutate from swr
  useEffect(() => {
    if (!isEmpty(PostResponse) || !isEmpty(UpdateResponse) || !isEmpty(DeleteResponse)) {
      mutateSchedules();

      setTimeout(() => {
        EmptyResponse();
        EmptyErrors();
      }, 3000);
    }
  }, [PostResponse, UpdateResponse, DeleteResponse]);

  return (
    <>
      <div>
        <BreadCrumbs
          title="Pumping Station-based Schedules"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Schedules',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Station',
              path: '',
            },
          ]}
        />

        {/* Notification error */}
        {!isEmpty(ScheduleError) ? <ToastNotification toastType="error" notifMessage={ScheduleError} /> : null}

        {/* Notification error */}
        {!isEmpty(SchedulesError) ? <ToastNotification toastType="error" notifMessage={SchedulesError} /> : null}

        {/* Notification Add Success */}
        {!isEmpty(PostResponse) ? <ToastNotification toastType="success" notifMessage="Successfully added!" /> : null}

        {/* Notification Update Success */}
        {!isEmpty(UpdateResponse) ? (
          <ToastNotification toastType="success" notifMessage="Successfully updated!" />
        ) : null}

        {/* Notification Delete Success */}
        {!isEmpty(DeleteResponse) ? (
          <ToastNotification toastType="success" notifMessage="Successfully deleted!" />
        ) : null}

        <AddStationSchedModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <EditStationSchedModal
          modalState={editModalIsOpen}
          setModalState={setEditModalIsOpen}
          closeModalAction={closeEditActionModal}
          rowData={currentRowData}
        />

        <DeleteStationSchedModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={closeDeleteActionModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Schedules">
          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              {IsLoading ? (
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
                    </button>
                  </div>

                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
