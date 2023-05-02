/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../../../src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { useHolidaysStore } from '../../../../../src/store/holidays.store';

import { Holiday } from '../../../../utils/types/holiday.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTable,
  useDataTable,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import AddHolidayModal from '../../../../components/modal/maintenance/events/holidays/AddHolidayModal';
import EditHolidayModal from '../../../../components/modal/maintenance/events/holidays/EditHolidayModal';
import DeleteHolidayModal from '../../../../components/modal/maintenance/events/holidays/DeleteHolidayModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Holiday>({} as Holiday);

  // fetch data for list of holidays
  const {
    data: swrHolidays,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateHolidays,
  } = useSWR('/holidays', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Holiday) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: Holiday) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render badge pill design
  const renderHolidayType = (holidayType: string) => {
    if (holidayType === 'regular') {
      return (
        <span className="bg-red-400 text-white text-xs font-medium px-1 py-0.5 rounded text-center">
          Regular
        </span>
      );
    } else if (holidayType === 'special') {
      return (
        <span className="bg-blue-400 text-white text-xs font-medium px-1 py-0.5 rounded text-center">
          Special
        </span>
      );
    } else {
      return;
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: Holiday) => {
    return (
      <div className="text-center">
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
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<Holiday>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Event',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('holidayDate', {
      header: 'Holiday Date',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => renderHolidayType(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Zustand initialization
  const {
    Holidays,
    PostHolidayResponse,
    UpdateHolidayResponse,
    DeleteHolidayResponse,

    IsLoading,
    ErrorHolidays,
    ErrorHoliday,

    GetHolidays,
    GetHolidaysSuccess,
    GetHolidaysFail,

    EmptyResponse,
  } = useHolidaysStore((state) => ({
    Holidays: state.holidays,
    PostHolidayResponse: state.holiday.postResponse,
    UpdateHolidayResponse: state.holiday.updateResponse,
    DeleteHolidayResponse: state.holiday.deleteResponse,

    IsLoading: state.loading.loadingHolidays,
    ErrorHolidays: state.error.errorHolidays,
    ErrorHoliday: state.error.errorHoliday,

    GetHolidays: state.getHolidays,
    GetHolidaysSuccess: state.getHolidaysSuccess,
    GetHolidaysFail: state.getHolidaysFail,

    EmptyResponse: state.emptyResponse,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: Holidays,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetHolidays(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrHolidays)) {
      GetHolidaysSuccess(swrIsLoading, swrHolidays.data);
    }

    if (!isEmpty(swrError)) {
      GetHolidaysFail(swrIsLoading, swrError.message);
    }
  }, [swrHolidays, swrError]);

  useEffect(() => {
    if (
      !isEmpty(PostHolidayResponse) ||
      !isEmpty(UpdateHolidayResponse) ||
      !isEmpty(DeleteHolidayResponse)
    ) {
      mutateHolidays();

      setTimeout(() => {
        EmptyResponse();
      }, 3000);
    }
  }, [PostHolidayResponse, UpdateHolidayResponse, DeleteHolidayResponse]);

  return (
    <div className="w-full px-4">
      <BreadCrumbs title="Holidays" />

      {/* Error Notifications */}
      {!isEmpty(ErrorHolidays) ? (
        <ToastNotification toastType="error" notifMessage={ErrorHolidays} />
      ) : null}
      {!isEmpty(ErrorHoliday) ? (
        <ToastNotification toastType="error" notifMessage={ErrorHoliday} />
      ) : null}

      {/* Success Notifications */}
      {!isEmpty(PostHolidayResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Holiday added successfully"
        />
      ) : null}
      {!isEmpty(UpdateHolidayResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Holiday updated successfully"
        />
      ) : null}
      {!isEmpty(DeleteHolidayResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Holiday deleted successfully"
        />
      ) : null}

      <div className="sm:mx-0 md:mx-0 lg:mx-5">
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
                  <i className="bx bxs-plus-square"></i>&nbsp; Add Holiday
                </button>
              </div>

              <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={true}
                paginate={true}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Add modal */}
      <AddHolidayModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      {/* Edit modal */}
      <EditHolidayModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {/* Delete modal */}
      <DeleteHolidayModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export default Index;
