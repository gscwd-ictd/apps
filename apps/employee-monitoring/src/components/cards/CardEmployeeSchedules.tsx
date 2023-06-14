import { DataTable, LoadingSpinner, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { FunctionComponent } from 'react';
import useSWR from 'swr';
import { Can } from '../../context/casl/Can';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { Card } from './Card';

type CardEmployeeSchedulesProps = {
  employeeId: string;
};

type EmployeeWithSchedule = {
  id: string;
  employeeId: string;
  dateFrom: string;
  dateTo: string;
  schedule: Schedule;
  restDays?: Array<number>;
};

const CardEmployeeSchedules: FunctionComponent<CardEmployeeSchedulesProps> = ({
  employeeId,
}) => {
  // use swr
  const {
    data: swrEmpScheds,
    isLoading: swrEsIsLoading,
    error: swrEsError,
    mutate: mutateEs,
  } = useSWR(
    employeeId ? `/employee-schedule/${employeeId}/all` : null,
    fetcherEMS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // define table columns
  const columnHelper = createColumnHelper<EmployeeWithSchedule>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateFrom', {
      enableSorting: false,
      header: 'Date From',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateTo', {
      enableSorting: false,
      header: 'Date To',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('schedule.timeIn', {
      enableSorting: false,
      header: 'Time In',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('schedule.lunchIn', {
      enableSorting: false,
      header: 'Lunch In',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('schedule.lunchOut', {
      enableSorting: false,
      header: 'Lunch Out',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('schedule.timeOut', {
      enableSorting: false,
      header: 'Time Out',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: 'Rest Days',
      cell: (info) => info.getValue(),
    }),
  ];

  // react table initialization
  const { table } = useDataTable({
    columns,
    data: [],
    columnVisibility: { id: false },
  });

  return (
    <div className="w-[80%] ">
      <Can I="access" this="Employee_schedules">
        <Card>
          {swrEsIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="flex flex-row flex-wrap">
              <div className="flex justify-end order-2 w-1/2 pr-4 table-actions-wrapper">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                  //   onClick={openAddActionModal}
                >
                  <i className="bx bxs-plus-square"></i>&nbsp;{' '}
                  <span className="xs:hidden sm:hidden md:hidden lg:block">
                    Add Schedule
                  </span>
                </button>
              </div>

              {/* <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={false}
                paginate={true}
              /> */}
            </div>
          )}
        </Card>
      </Can>
    </div>
  );
};

export default CardEmployeeSchedules;
