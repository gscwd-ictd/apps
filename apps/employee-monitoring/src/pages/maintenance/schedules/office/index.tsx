/* eslint-disable react-hooks/exhaustive-deps */
import {
  DataTableHrms,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Schedule } from '../../../../../../../libs/utils/src/lib/types/schedule.type';
import React, { useEffect, useState } from 'react';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { SelectOption } from '../../../../../../../libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { createColumnHelper } from '@tanstack/react-table';
import useSWR from 'swr';
import AddOfficeSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/office/AddOfficeSchedModal';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseConvertDayToTime from 'apps/employee-monitoring/src/utils/functions/ConvertDateToTime';
import UseRenderShiftType from 'apps/employee-monitoring/src/utils/functions/RenderShiftType';
import UseConvertRestDaysToArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToArray';
import UseConvertRestDaysToString from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from 'apps/employee-monitoring/src/utils/functions/RenderRestDays';
import UseRenderScheduleType from 'apps/employee-monitoring/src/utils/functions/RenderScheduleType';
import EditOfficeSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/office/EditOfficeSchedModal';
import DeleteOfficeSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/office/DeleteOfficeSchedModal';

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setAction = useScheduleStore((state) => state.setAction);
  const [currentRowData, setCurrentRowData] = useState<Schedule>(
    {} as Schedule
  );
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  const {
    Schedules,
    PostResponse,
    UpdateResponse,
    DeleteResponse,
    IsLoading,
    Error,
    GetSchedules,
    GetSchedulesSuccess,
    GetSchedulesFail,
    EmptyResponse,
  } = useScheduleStore((state) => ({
    Schedules: state.schedules,
    PostResponse: state.schedule.postResponse,
    UpdateResponse: state.schedule.updateResponse,
    DeleteResponse: state.schedule.deleteResponse,
    IsLoading: state.loading.loadingSchedules,
    Error: state.error.errorSchedules,
    GetSchedules: state.getSchedules,
    GetSchedulesSuccess: state.getSchedulesSuccess,
    GetSchedulesFail: state.getSchedulesFail,
    EmptyResponse: state.emptyResponse,
  }));

  const modalIsOpen = useScheduleStore((state) => state.modalIsOpen);
  const setModalIsOpen = useScheduleStore((state) => state.setModalIsOpen);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);

  // `?base=office`
  // use SWR
  const {
    data: swrSchedules,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateSchedules,
  } = useSWR('/schedule?base=Office', fetcherEMS, {
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
      cell: (info) => (
        <div className="w-[6rem]">{UseRenderScheduleType(info.getValue())}</div>
      ),
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
      cell: (info) => (
        <div className="w-[6rem]">{UseRenderShiftType(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: () => 'Rest Day',
      cell: (info) =>
        UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

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
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          // onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bxs-user-plus"></i>
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

  // Initial zustand state update
  useEffect(() => {
    EmptyResponse();
    if (swrIsLoading) {
      GetSchedules(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrSchedules)) {
      GetSchedulesSuccess(swrIsLoading, swrSchedules.data);
    }

    if (!isEmpty(swrError)) {
      GetSchedulesFail(swrIsLoading, swrError);
    }
  }, [swrSchedules, swrError]);

  // mutate from swr
  useEffect(() => {
    if (
      !isEmpty(PostResponse) ||
      !isEmpty(UpdateResponse) ||
      !isEmpty(DeleteResponse)
    ) {
      mutateSchedules();
    }
  }, [PostResponse, UpdateResponse, DeleteResponse]);

  return (
    <>
      <div className="min-h-[100%] min-w-full">
        <BreadCrumbs
          title="Office-based Schedules"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Schedules',
              path: '',
            },
            {
              layerNo: 2,
              layerText: 'Office',
              path: '',
            },
          ]}
        />

        {/* Notification error */}
        {!isEmpty(Error) ? (
          <ToastNotification toastType="error" notifMessage={Error} />
        ) : null}

        {/* Notification Add Success */}
        {!isEmpty(PostResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully added!"
          />
        ) : null}

        {/* Notification Update Success */}
        {!isEmpty(UpdateResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully updated!"
          />
        ) : null}

        {/* Notification Delete Success */}
        {!isEmpty(DeleteResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully deleted!"
          />
        ) : null}

        <AddOfficeSchedModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <EditOfficeSchedModal
          modalState={editModalIsOpen}
          setModalState={setEditModalIsOpen}
          closeModalAction={closeEditActionModal}
          rowData={currentRowData}
        />

        <DeleteOfficeSchedModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={closeDeleteActionModal}
          rowData={currentRowData}
        />

        <Can I="access" this="maintenance_schedules">
          <div className="mx-5">
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

                  <DataTableHrms
                    data={schedules}
                    columns={columns}
                    columnVisibility={columnVisibility}
                    paginate
                    showGlobalFilter
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
