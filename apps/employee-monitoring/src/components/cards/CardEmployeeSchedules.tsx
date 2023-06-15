/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, LoadingSpinner, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Can } from '../../context/casl/Can';
import {
  EmployeeWithSchedule,
  useScheduleSheetStore,
} from '../../store/schedule-sheet.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import UseConvertRestDaysToString from '../../utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from '../../utils/functions/RenderRestDays';
import AddEmpSchedModal from '../modal/employees/schedules/AddEmpSchedModal';
import { Card } from './Card';

type CardEmployeeSchedulesProps = {
  employeeData: any;
};

const CardEmployeeSchedules: FunctionComponent<CardEmployeeSchedulesProps> = ({
  employeeData,
}) => {
  // use swr
  const {
    data: swrEmpScheds,
    isLoading: swrEsIsLoading,
    error: swrEsError,
    mutate: mutateEs,
  } = useSWR(
    employeeData ? `/employee-schedule/${employeeData.userId}/all` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // month day and year
  const formatDateInWords = (date: string) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const {
    employeeSchedules,
    getEmployeeSchedules,
    getEmployeeSchedulesFail,
    getEmployeeSchedulesSuccess,
  } = useScheduleSheetStore((state) => ({
    employeeSchedules: state.employeeSchedules,
    getEmployeeSchedules: state.getEmployeeSchedules,
    getEmployeeSchedulesSuccess: state.getEmployeeSchedulesSuccess,
    getEmployeeSchedulesFail: state.getEmployeeSchedulesFail,
  }));

  // define table columns
  const columnHelper = createColumnHelper<EmployeeWithSchedule>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateFrom', {
      enableSorting: false,
      header: 'Date From',
      cell: (info) => formatDateInWords(info.getValue()),
    }),
    columnHelper.accessor('dateTo', {
      enableSorting: false,
      header: 'Date To',
      cell: (info) => formatDateInWords(info.getValue()),
    }),
    columnHelper.accessor('timeIn', {
      enableSorting: false,
      header: 'Time In',
      cell: (info) => formatTime(info.getValue()),
    }),
    columnHelper.accessor('lunchOut', {
      enableSorting: false,
      header: 'Lunch Out',
      cell: (info) => formatTime(info.getValue()),
    }),
    columnHelper.accessor('lunchIn', {
      enableSorting: false,
      header: 'Lunch In',
      cell: (info) => formatTime(info.getValue()),
    }),
    columnHelper.accessor('timeOut', {
      enableSorting: false,
      header: 'Time Out',
      cell: (info) => formatTime(info.getValue()),
    }),
    columnHelper.accessor('restDays', {
      enableSorting: false,
      header: 'Rest Days',
      cell: (info) =>
        UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
  ];

  // react table initialization
  const { table } = useDataTable({
    columns,
    data: employeeSchedules,
    columnVisibility: { id: false },
  });

  // loading
  useEffect(() => {
    if (swrEsIsLoading) {
      getEmployeeSchedules();
    }
  }, [swrEsIsLoading]);

  // swr success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrEmpScheds)) {
      console.log(swrEmpScheds.data);
      getEmployeeSchedulesSuccess(swrEmpScheds.data);
    }

    // fail
    if (!isEmpty(swrEsError)) {
      getEmployeeSchedulesFail(swrEsError.message);
    }
  }, [swrEsError, swrEmpScheds]);

  // modal open
  const [addSchedModalIsOpen, setAddSchedModalIsOpen] =
    useState<boolean>(false);

  const openAddSchedModal = () => setAddSchedModalIsOpen(true);
  const closeAddSchedModal = () => {
    setAddSchedModalIsOpen(false);
  };

  return (
    <div className="w-full ">
      <Can I="access" this="Employee_schedules">
        <Card title="Schedules" className="p-5">
          <div className="flex flex-row flex-wrap">
            <div className="flex justify-end order-2 w-1/2 pr-4 table-actions-wrapper">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                onClick={openAddSchedModal}
              >
                <i className="bx bxs-plus-square"></i>&nbsp;{' '}
                <span className="xs:hidden sm:hidden md:hidden lg:block">
                  Add Schedule
                </span>
              </button>
            </div>

            <AddEmpSchedModal
              modalState={addSchedModalIsOpen}
              setModalState={setAddSchedModalIsOpen}
              closeModalAction={closeAddSchedModal}
              employeeData={employeeData}
            />

            {swrEsIsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <>
                <DataTable model={table} showColumnFilter={false} />
              </>
            )}
          </div>
        </Card>
      </Can>
    </div>
  );
};

export default CardEmployeeSchedules;
