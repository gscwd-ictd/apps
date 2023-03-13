/* eslint-disable react-hooks/exhaustive-deps */
import { DataTableHrms } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Schedule } from '../../../../../../../libs/utils/src/lib/types/schedule.type';
import React, { useEffect, useState } from 'react';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';
import { useForm } from 'react-hook-form';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { SelectOption } from '../../../../../../../libs/utils/src/lib/types/select.type';
import { listOfRestDays } from '../../../../../../../libs/utils/src/lib/constants/rest-days.const';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { Categories } from 'libs/utils/src/lib/enums/category.enum';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { createColumnHelper } from '@tanstack/react-table';
import useSWR from 'swr';
import AddOfficeSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/office/AddOfficeSchedModal';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { convertToTime } from 'apps/employee-monitoring/src/utils/functions/convertToTime';
import { renderShiftType } from 'apps/employee-monitoring/src/utils/functions/renderShiftType';
import { renderScheduleType } from 'apps/employee-monitoring/src/utils/functions/renderScheduleType';
import { renderRestDays } from 'apps/employee-monitoring/src/utils/functions/renderRestDays';

const listOfSchedules: Array<Schedule> = [
  {
    name: 'Regular Time Clock',
    scheduleType: Categories.REGULAR,
    timeIn: '08:00',
    timeOut: '05:00',
    lunchIn: '12:00',
    lunchOut: '12:30',
    withLunch: true,
    restDays: [6, 0],
    shift: ScheduleShifts.MORNING,
  },
  {
    name: 'Flexible Time Clock A',
    scheduleType: Categories.FLEXIBLE,
    timeIn: '07:00',
    timeOut: '04:00',
    withLunch: true,
    lunchIn: '11:00',
    lunchOut: '11:30',
    restDays: [1, 0],
    shift: ScheduleShifts.MORNING,
  },
  {
    name: 'Flexible Time Clock B',
    scheduleType: Categories.FLEXIBLE,
    timeIn: '06:00',
    timeOut: '03:00',
    withLunch: true,
    lunchIn: '10:00',
    lunchOut: '10:30',
    restDays: [1, 2],
    shift: ScheduleShifts.MORNING,
  },
];

const shiftSelection: Array<SelectOption> = [
  { label: 'Morning', value: 'morning' },
  { label: 'Night', value: 'night' },
];

const categorySelection: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Flexible', value: 'flexible' },
  { label: 'Pumping Operator AM', value: 'operator-am' },
  { label: 'Pumping Operator PM', value: 'operator-pm' },
];

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const action = useScheduleStore((state) => state.action);
  const setAction = useScheduleStore((state) => state.setAction);
  const [withLunch, setWithLunch] = useState<boolean>(true);
  const [currentRowData, setCurrentRowData] = useState<Schedule>(
    {} as Schedule
  );
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  const { Schedules, PostResponse, UpdateResponse, DeleteResponse } =
    useScheduleStore((state) => ({
      Schedules: state.schedules,
      PostResponse: state.schedule.postResponse,
      UpdateResponse: state.schedule.updateResponse,
      DeleteResponse: state.schedule.deleteResponse,
    }));

  const modalIsOpen = useScheduleStore((state) => state.modalIsOpen);
  const setModalIsOpen = useScheduleStore((state) => state.setModalIsOpen);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);

  const {
    data: swrSchedules,
    isLoading: swrIsLoading,
    error: swrIsError,
    mutate: mutateSchedules,
  } = useSWR('/schedule/', fetcherEMS, {
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

  // const {
  //   setValue,
  //   watch,
  //   reset,
  //   register,
  //   formState: { errors },
  // } = useForm<Schedule>({
  //   mode: 'onChange',
  //   defaultValues: {
  //     scheduleType: Categories.REGULAR,
  //     timeIn: '',
  //     timeOut: '',
  //     withLunch: true,
  //     lunchIn: null,
  //     lunchOut: null,
  //     name: '',
  //     restDays: [],
  //     shift: ScheduleShifts.MORNING,
  //   },
  // });

  // transforms the array of numbers(rest days) to array of key value pair
  const transformRestDays = (restDays: Array<number>) => {
    const tempRestDays = restDays.map((day: number) => {
      return listOfRestDays.find((tempDay) => tempDay.value === day);
    });
    return tempRestDays;
    // .sort((a, b) => (a.value > b.value ? 1 : -1));
  };

  // transforms the array of numbers(rest days) to array of key value pair
  const transformRestDaysLabel = (restDays: Array<number>) => {
    const tempRestDays = restDays.map((day: number) => {
      return listOfRestDays.find((tempDay) => tempDay.value === day).label;
    });
    return tempRestDays;
    // .sort((a, b) => (a.value > b.value ? 1 : -1));
  };

  // transform category string
  const transformCategory = (category: string) => {
    if (category === 'regular') return 'Regular';
    else if (category === 'flexible') return 'Flexible';
    else if (category === 'operator-am') return 'Operator AM';
    else if (category === 'operator-pm') return 'Operator PM';
    else return '';
  };

  // when edit action is clicked
  const editAction = async (sched: Schedule, idx: number) => {
    setAction(ModalActions.UPDATE);
    setCurrentRowData(sched);
    setSelectedRestDays(transformRestDays(sched.restDays));
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
      cell: (info) => renderScheduleType(info.getValue()),
    }),
    columnHelper.accessor('timeIn', {
      enableSorting: false,
      header: () => 'Time In',
      cell: (info) => convertToTime(info.getValue()),
    }),
    columnHelper.accessor('timeOut', {
      enableSorting: false,
      header: () => 'Time Out',
      cell: (info) => convertToTime(info.getValue()),
    }),
    columnHelper.accessor('lunchOut', {
      enableSorting: false,
      header: () => 'Lunch Out',
      cell: (info) => convertToTime(info.getValue()),
    }),
    columnHelper.accessor('lunchIn', {
      enableSorting: false,
      header: () => 'Lunch In',
      cell: (info) => convertToTime(info.getValue()),
    }),
    columnHelper.accessor('shift', {
      enableSorting: false,
      header: () => 'Shift',
      cell: (info) => renderShiftType(info.getValue()),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: () => 'Rest Day',
      cell: (info) =>
        transformRestDays(info.getValue()).length > 1 ? (
          renderRestDays(transformRestDaysLabel(info.getValue()))
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

  // set data to state from useSWR
  useEffect(() => {
    if (!isEmpty(swrSchedules)) {
      setSchedules(swrSchedules.data);
    }
  }, [swrSchedules]);

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

        <AddOfficeSchedModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <Can I="access" this="maintenance_schedules">
          <div className="mx-5">
            <Card>
              {/** Top Card */}
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
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
