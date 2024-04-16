/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import fetcherEMS from '../../../../../src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useWorkSuspensionStore } from 'apps/employee-monitoring/src/store/work-suspension.store';
import { WorkSuspension } from 'apps/employee-monitoring/src/utils/types/work-suspension.type';

import { DataTable, useDataTable, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

import AddWorkSuspensionModal from 'apps/employee-monitoring/src/components/modal/maintenance/events/work-suspensions/AddWorkSuspensionModal';

const Index = () => {
  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

  // fetch data for list of user
  const {
    data: workSuspensions,
    error: workSuspensionsError,
    isLoading: workSuspensionsLoading,
    mutate: mutateWorkSuspensions,
  } = useSWR('/work-suspension', fetcherEMS);

  // Zustand initialization
  const {
    GetWorkSuspensions,
    SetGetWorkSuspensions,

    PostWorkSuspension,
    SetPostWorkSuspension,

    ErrorWorkSuspensions,
    SetErrorWorkSuspensions,

    ErrorWorkSuspension,
    SetErrorWorkSuspension,

    EmptyResponse,
  } = useWorkSuspensionStore((state) => ({
    GetWorkSuspensions: state.getWorkSuspensions,
    SetGetWorkSuspensions: state.setGetWorkSuspensions,

    PostWorkSuspension: state.postWorkSuspension,
    SetPostWorkSuspension: state.setPostWorkSuspension,

    ErrorWorkSuspensions: state.errorWorkSuspensions,
    SetErrorWorkSuspensions: state.setErrorWorkSuspensions,

    ErrorWorkSuspension: state.errorWorkSuspension,
    SetErrorWorkSuspension: state.setErrorWorkSuspension,

    EmptyResponse: state.emptyResponse,
  }));

  // Define table columns
  const columnHelper = createColumnHelper<WorkSuspension>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      enableSorting: true,
      header: () => 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('suspensionDate', {
      enableSorting: true,
      header: () => 'Suspension Date',
      cell: (info) => transformDate(info.getValue()),
    }),
    columnHelper.accessor('suspensionHours', {
      enableSorting: true,
      header: () => 'Suspension Hours',
      cell: (info) => info.getValue(),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: GetWorkSuspensions,
    columnVisibility: { id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (!isEmpty(workSuspensions)) {
      SetGetWorkSuspensions(workSuspensions.data);
    }

    if (!isEmpty(workSuspensionsError)) {
      switch (workSuspensionsError?.response?.status) {
        case 400:
          SetErrorWorkSuspensions('Bad Request');
          break;
        case 401:
          SetErrorWorkSuspensions('Unauthorized');
          break;
        case 403:
          SetErrorWorkSuspensions('Forbidden');
          break;
        case 404:
          SetErrorWorkSuspensions('Work suspensions not found');
          break;
        case 500:
          SetErrorWorkSuspensions('Internal Server Error');
          break;
        default:
          SetErrorWorkSuspensions('An error occurred. Please try again later.');
          break;
      }
    }
  }, [workSuspensions, workSuspensionsError]);

  useEffect(() => {
    if (!isEmpty(PostWorkSuspension)) {
      mutateWorkSuspensions();

      setTimeout(() => {
        EmptyResponse();
      }, 5000);
    }
  }, [PostWorkSuspension]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Work Suspensions" />
        {/* Notifications */}
        {!isEmpty(ErrorWorkSuspensions) ? (
          <ToastNotification toastType="error" notifMessage={ErrorWorkSuspensions} />
        ) : null}
        <Can I="access" this="Event_work_suspensions">
          <div className="mx-5">
            <Card>
              {workSuspensionsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Work Suspension
                    </button>
                  </div>
                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* Add modal */}
          <AddWorkSuspensionModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
