import { DataTable, LoadingSpinner, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import AddFieldSsModal from 'apps/employee-monitoring/src/components/sidebar-items/monitoring/scheduling-sheet/field/AddFieldSsModal';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import dayjs from 'dayjs';
import { useState } from 'react';

type Scheduling = {
  id: string;
  schedulingId: string;
  scheduleName: string;
  scheduleGroup: string;
  scheduleFrom: string;
  scheduleTo: string;
};

const Schedules: Array<Scheduling> = [
  {
    id: '1',
    scheduleName: 'Schedule A',
    scheduleFrom: '06/01/2023',
    scheduleGroup: 'Central',
    scheduleTo: '06/15/2023',
    schedulingId: '1',
  },
  {
    id: '2',
    scheduleName: 'Schedule B',
    scheduleFrom: '06/01/2023',
    scheduleGroup: 'Central',
    scheduleTo: '06/15/2023',
    schedulingId: '2',
  },

  {
    id: '3',
    scheduleName: 'Schedule A',
    scheduleFrom: '06/16/2023',
    scheduleGroup: 'Calumpang',
    scheduleTo: '06/30/2023',
    schedulingId: '3',
  },

  {
    id: '4',
    scheduleName: 'Schedule B',
    scheduleFrom: '06/16/2023',
    scheduleGroup: 'Calumpang',
    scheduleTo: '06/30/2023',
    schedulingId: '4',
  },
  {
    id: '5',
    scheduleName: 'Schedule A',
    scheduleFrom: '06/01/2023',
    scheduleGroup: 'Mabuhay',
    scheduleTo: '06/15/2023',
    schedulingId: '5',
  },
  {
    id: '6',
    scheduleName: 'Schedule B',
    scheduleFrom: '06/01/2023',
    scheduleGroup: 'Mabuhay',
    scheduleTo: '06/15/2023',
    schedulingId: '6',
  },
];

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setSelectedScheduleId } = useScheduleSheetStore((state) => ({
    setSelectedScheduleId: state.setSelectedScheduleId,
  }));

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
  const openEditActionModal = (rowData: Scheduling) => {
    setEditModalIsOpen(true);
  };

  // delete
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: Scheduling) => {
    setDeleteModalIsOpen(true);
  };
  const [currentRowData, setCurrentRowData] = useState<Scheduling>(
    {} as Scheduling
  );

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: Scheduling) => {
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
  const columnHelper = createColumnHelper<Scheduling>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('scheduleGroup', {
      enableSorting: false,
      header: () => 'Group',
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
        columnHelper.accessor('scheduleFrom', {
          enableSorting: true,
          header: () => <span className="w-full text-center ">Date From</span>,
          cell: (info) => (
            <div className="w-full text-center">
              {transformDate(info.getValue())}
            </div>
          ),
        }),
        columnHelper.accessor('scheduleTo', {
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
    data: Schedules,
    columnVisibility: { id: false },
  });

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
          title="Field Scheduling"
        />

        <AddFieldSsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <Can I="access" this="Schedules">
          <div className="sm:mx-0 lg:mx-5">
            <Card>
              {isLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Open
                      Scheduling Sheet
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
