/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DataTableHrms, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { SchedulesPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Footer';
import { SchedulesPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/schedules/Header';
import { Schedule } from '../../../../../../../libs/utils/src/lib/types/schedule.type';
import React, { useEffect, useState } from 'react';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectOption } from '../../../../../../../libs/utils/src/lib/types/select.type';
import { listOfRestDays } from '../../../../../../../libs/utils/src/lib/constants/rest-days.const';
import Toggle from 'apps/employee-monitoring/src/components/switch/Toggle';
import { isEmpty } from 'lodash';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { Categories } from 'libs/utils/src/lib/enums/category.enum';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { capitalizer } from 'apps/employee-monitoring/src/utils/functions/capitalizer';
import { createColumnHelper } from '@tanstack/react-table';
import AddOfficeSchedModal from 'apps/employee-monitoring/src/components/modal/maintenance/schedules/office/AddOfficeSchedModal';

const listOfSchedules: Array<Schedule> = [
  {
    name: 'Regular Time Clock',
    category: Categories.REGULAR,
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
    category: Categories.FLEXIBLE,
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
    category: Categories.FLEXIBLE,
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

  const modalIsOpen = useScheduleStore((state) => state.modalIsOpen);
  const setModalIsOpen = useScheduleStore((state) => state.setModalIsOpen);

  const schedules = useScheduleStore((state) => state.schedules);
  const setSchedules = useScheduleStore((state) => state.setSchedules);

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
  const openDeleteActionModal = (rowData: Schedule) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // when edit action is clicked
  // const editAction = async (employee: Schedule, idx: number) => {
  //   // setAction(ModalActions.UPDATE);/
  //   // setScheduleForEdit(sched);
  //   // setSelectedRestDays(await transformRestDays(sched.restDays));
  //   // loadNewDefaultValues(sched);
  //   setModalIsOpen(true);
  // };

  const {
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<Schedule>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      category: Categories.REGULAR,
      timeIn: '',
      timeOut: '',
      withLunch: true,
      lunchIn: null,
      lunchOut: null,
      name: '',
      restDays: [],
      shift: ScheduleShifts.MORNING,
    },
  });

  // transforms the array of numbers(rest days) to array of key value pair
  const transformRestDays = async (restDays: Array<number>) => {
    const tempRestDays = restDays.map((day: number) => {
      return { ...listOfRestDays.find((tempDay) => tempDay.value === day) };
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
    setSelectedRestDays(await transformRestDays(sched.restDays));
    loadNewDefaultValues(sched);
    setModalIsOpen(true);
  };

  // loads the default values, utilizes react hook forms
  const loadNewDefaultValues = (sched: Schedule) => {
    setValue('id', sched.id);
    setValue('name', sched.name);
    setValue('category', sched.category);
    setValue('timeIn', sched.timeIn);
    setValue('timeOut', sched.timeOut);
    setValue('withLunch', sched.withLunch);
    setWithLunch(sched.withLunch);
    setValue('lunchIn', sched.lunchIn);
    setValue('lunchOut', sched.lunchOut);
    setValue('shift', sched.shift);
  };

  // run this when modal is closed
  const closeAction = () => {
    setModalIsOpen(false);
    resetToDefaultValues();
  };

  // reset all values
  const resetToDefaultValues = () => {
    reset();
    setSelectedRestDays([]);
    setWithLunch(true);
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
    columnHelper.accessor('category', {
      enableSorting: false,
      header: () => 'Category',
      cell: (info) => renderCategoryType(info.getValue()),
    }),
    columnHelper.accessor('timeIn', {
      enableSorting: false,
      header: () => 'Time In',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('timeOut', {
      enableSorting: false,
      header: () => 'Time Out',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lunchIn', {
      enableSorting: false,
      header: () => 'Lunch In',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lunchOut', {
      enableSorting: false,
      header: () => 'Lunch Out',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('shift', {
      enableSorting: false,
      header: () => 'Shift',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: () => 'Rest Day',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

  // Render badge pill design
  const renderCategoryType = (categoryType: Categories) => {
    if (categoryType === Categories.REGULAR) {
      return (
        <span className="bg-red-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
          Regular
        </span>
      );
    } else if (categoryType === Categories.FLEXIBLE) {
      return (
        <span className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
          Flexible
        </span>
      );
    } else if (categoryType === Categories.OPERATOR1) {
      return (
        <span className="bg-green-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
          OPERATOR A
        </span>
      );
    } else {
      return;
    }
  };

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

  //! this must be replaced with fetch
  useEffect(() => {
    setSchedules(listOfSchedules);
    setSelectedRestDays([]);
  }, []);

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchIn'))) setValue('lunchIn', null);
  }, [watch('lunchIn')]);

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchOut'))) setValue('lunchOut', null);
  }, [watch('lunchOut')]);

  // with lunch in/out listener
  useEffect(() => {
    if (withLunch) setValue('withLunch', true);
    else if (!withLunch) setValue('withLunch', false);
  }, [withLunch]);

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
