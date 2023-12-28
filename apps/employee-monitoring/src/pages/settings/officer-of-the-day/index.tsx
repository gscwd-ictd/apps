import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
// import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

// modals
import AddOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/AddOfficerOfTheDayModal';
import DeleteOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/DeleteOfficerOfTheDayModal';

// sample static data
const OfficersOfTheDay: OfficerOfTheDay[] = [
  { _id: '2001', name: 'Jeric', assignment: 'Secret', dateFrom: '2000-05-13', dateTo: '2000-05-13' },
  { _id: '2002', name: 'Lloyd', assignment: 'Secret', dateFrom: '2001-05-13', dateTo: '2001-05-13' },
];

// use /maintenance/schedules/pumping-station as example for adding and deleting OD

const Index = () => {
  // Current row data in the table that has been clicked
  //   const [currentRowData, setCurrentRowData] = useState<OfficerOfTheDay>({} as OfficerOfTheDay);

  // fetch data for list of officer of the day
  const {
    data: swrOfficerOfTheDay,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateOfficersOfTheDay,
  } = useSWR('/officers-of-the-day', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  // open delete action
  const openDeleteActionModal = (rowData: OfficerOfTheDay) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };

  // close delete action
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  const [currentRowData, setCurrentRowData] = useState<OfficerOfTheDay>({} as OfficerOfTheDay);

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: OfficerOfTheDay) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<OfficerOfTheDay>();
  const columns = [
    columnHelper.accessor('_id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      enableSorting: true,
      header: () => 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment', {
      enableSorting: true,
      header: () => 'Assignment',
      cell: (info) => info.getValue(),
    }),
    columnHelper.group({
      id: 'effectivityDate',
      header: () => <span className="w-full text-center underline">Effectivity Date</span>,

      columns: [
        columnHelper.accessor('dateFrom', {
          enableSorting: true,
          header: () => <span className="w-full text-center">Date From</span>,
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

  // Zustand initialization

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: OfficersOfTheDay,
    columnVisibility: { _id: false },
  });

  // Reset responses on load of page

  // Initial zustand state update

  // Upon success/fail of swr request, zustand state will be updated

  // Reset responses from all modal actions

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Officer of the Day" />
        {/* Error Notifications */}

        {/* Success Notifications */}

        <Can I="access" this="Officer_of_the_day">
          <div className="mx-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Officer Of The Day
                    </button>
                  </div>
                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* Add modal */}
          <AddOfficerOfTheDayModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Delete modal */}
          <DeleteOfficerOfTheDayModal
            modalState={deleteModalIsOpen}
            setModalState={setDeleteModalIsOpen}
            closeModalAction={closeDeleteActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
