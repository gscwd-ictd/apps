/* eslint-disable react-hooks/exhaustive-deps */
import {
  DataTableHrms,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { createColumnHelper } from '@tanstack/react-table';
import useSWR from 'swr';
import AddStationSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/station/AddStationSchedModal';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { useConvertDayToTime } from 'apps/employee-monitoring/src/utils/functions/ConvertDateToTime';
import { useRenderShiftType } from 'apps/employee-monitoring/src/utils/functions/RenderShiftType';
import { useConvertRestDaysToArray } from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToArray';
import { useConvertRestDaysToString } from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToString';
import { useRenderRestDays } from 'apps/employee-monitoring/src/utils/functions/RenderRestDays';
import { useRenderScheduleType } from 'apps/employee-monitoring/src/utils/functions/RenderScheduleType';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setAction = useScheduleStore((state) => state.setAction);
  const [withLunch, setWithLunch] = useState<boolean>(true);
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

  // use SWR
  const {
    data: swrSchedules,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateSchedules,
  } = useSWR('/schedule?base=Pumping%20Station', fetcherEMS, {
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

  // when edit action is clicked
  const editAction = async (sched: Schedule, idx: number) => {
    setAction(ModalActions.UPDATE);
    setCurrentRowData(sched);
    setSelectedRestDays(useConvertRestDaysToArray(sched.restDays));
    // loadNewDefaultValues(sched);
    setModalIsOpen(true);
  };

  // run this when modal is closed
  const closeAction = () => {
    setModalIsOpen(false);
    // resetToDefaultValues();
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
      cell: (info) => useRenderScheduleType(info.getValue()),
    }),
    columnHelper.accessor('timeIn', {
      enableSorting: false,
      header: () => 'Time In',
      cell: (info) => useConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('timeOut', {
      enableSorting: false,
      header: () => 'Time Out',
      cell: (info) => useConvertDayToTime(info.getValue()),
    }),
    columnHelper.accessor('shift', {
      enableSorting: false,
      header: () => 'Shift',
      cell: (info) => useRenderShiftType(info.getValue()),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: () => 'Rest Day',
      cell: (info) =>
        useConvertRestDaysToArray(info.getValue()).length > 0 ? (
          useRenderRestDays(useConvertRestDaysToString(info.getValue()))
        ) : (
          <span className="bg-gray-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
            No rest day
          </span>
        ),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false, scheduleType: false };

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

  // // set data to state from useSWR
  // useEffect(() => {
  //   if (!isEmpty(swrSchedules)) {
  //     setSchedules(swrSchedules.data);
  //   }
  // }, [swrSchedules]);

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
        {!isEmpty(Error) ? (
          <ToastNotification toastType="error" notifMessage={Error} />
        ) : null}

        <AddStationSchedModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
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
