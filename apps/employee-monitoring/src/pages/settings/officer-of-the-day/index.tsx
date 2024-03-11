import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

// modals
import AddOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/AddOfficerOfTheDayModal';
import DeleteOfficerOfTheDayModal from 'apps/employee-monitoring/src/components/modal/settings/officer-of-the-day/DeleteOfficerOfTheDayModal';

const Index = () => {
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

  // fetch data for list of user
  const {
    data: officersOfTheDay,
    error: officersOfTheDayError,
    isLoading: officersOfTheDayLoading,
    mutate: mutateOfficersOfTheDay,
  } = useSWR('/officer-of-the-day', fetcherEMS);

  // Zustand initialization
  const {
    OfficersOfTheDay,
    SetGetOfficersOfTheDay,

    PostOfficerOfTheDay,
    SetPostOfficerOfTheDay,

    DeleteOfficerOfTheDay,
    SetDeleteOfficerOfTheDay,

    ErrorOfficerOfTheDay,
    SetErrorOfficerOfTheDay,

    ErrorOfficersOfTheDay,
    SetErrorOfficersOfTheDay,

    EmptyResponse,
  } = useOfficerOfTheDayStore((state) => ({
    OfficersOfTheDay: state.getOfficersOfTheDay,
    SetGetOfficersOfTheDay: state.setGetOfficersOfTheDay,

    PostOfficerOfTheDay: state.postOfficerOfTheDay,
    SetPostOfficerOfTheDay: state.setPostOfficerOfTheDay,

    DeleteOfficerOfTheDay: state.deleteOfficerOfTheDay,
    SetDeleteOfficerOfTheDay: state.setDeleteOfficerOfTheDay,

    ErrorOfficerOfTheDay: state.errorOfficerOfTheDay,
    SetErrorOfficerOfTheDay: state.setErrorOfficerOfTheDay,

    ErrorOfficersOfTheDay: state.errorOfficersOfTheDay,
    SetErrorOfficersOfTheDay: state.setErrorOfficersOfTheDay,

    EmptyResponse: state.emptyResponse,
  }));

  // Render row actions in the table component
  const renderRowActions = (rowData: OfficerOfTheDay) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
          aria-label="Delete"
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<OfficerOfTheDay>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employeeName', {
      enableSorting: true,
      header: () => 'Employee Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('orgName', {
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
          header: () => <span className="w-full text-center">Date To</span>,
          cell: (info) => <div className="w-full text-center">{transformDate(info.getValue())}</div>,
        }),
      ],
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: OfficersOfTheDay,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (!isEmpty(officersOfTheDay)) {
      SetGetOfficersOfTheDay(officersOfTheDay.data);
    }

    if (!isEmpty(officersOfTheDayError)) {
      switch (officersOfTheDayError?.response?.status) {
        case 400:
          SetErrorOfficersOfTheDay('Bad Request');
          break;
        case 401:
          SetErrorOfficersOfTheDay('Unauthorized');
          break;
        case 403:
          SetErrorOfficersOfTheDay('Forbidden');
          break;
        case 404:
          SetErrorOfficersOfTheDay('Officers of the day not found');
          break;
        case 500:
          SetErrorOfficersOfTheDay('Internal Server Error');
          break;
        default:
          SetErrorOfficersOfTheDay('An error occurred. Please try again later.');
          break;
      }
    }
  }, [officersOfTheDay, officersOfTheDayError]);

  useEffect(() => {
    if (
      !isEmpty(PostOfficerOfTheDay) ||
      !isEmpty(DeleteOfficerOfTheDay) ||
      !isEmpty(ErrorOfficerOfTheDay) ||
      !isEmpty(ErrorOfficersOfTheDay)
    ) {
      mutateOfficersOfTheDay();

      setTimeout(() => {
        EmptyResponse();
      }, 5000);
    }
  }, [PostOfficerOfTheDay, DeleteOfficerOfTheDay, ErrorOfficerOfTheDay, ErrorOfficersOfTheDay]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Officer of the Day" />
        {/* Notifications */}
        {!isEmpty(ErrorOfficersOfTheDay) ? (
          <ToastNotification toastType="error" notifMessage={ErrorOfficersOfTheDay} />
        ) : null}
        <Can I="access" this="Officer_of_the_day">
          <div className="mx-5">
            <Card>
              {officersOfTheDayLoading ? (
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
