/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Can } from '../../context/casl/Can';
import { EmployeeWithSchedule, useScheduleSheetStore } from '../../store/schedule-sheet.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import UseConvertRestDaysToString from '../../utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from '../../utils/functions/RenderRestDays';
import AddEmpSchedModal from '../modal/employees/schedules/AddEmpSchedModal';
import DeleteEmpSchedModal from '../modal/employees/schedules/DeleteEmpSchedModal';
import { Card } from './Card';

type EmployeeInfo = {
  userId: string;
  photoUrl: string;
  companyId: string;
  fullName: string;
  isHRMPSB: number;
  assignment: {
    id: string;
    name: string;
    positionId: string;
    positionTitle: string;
  };
  userRole: string;
};

type CardEmployeeSchedulesProps = {
  employeeData: EmployeeInfo;
};

const CardEmployeeSchedules: FunctionComponent<CardEmployeeSchedulesProps> = ({ employeeData }) => {
  const [currentRowData, setCurrentRowData] = useState<EmployeeWithSchedule>({} as EmployeeWithSchedule);

  // use swr
  const {
    data: swrEmpScheds,
    isLoading: swrEsIsLoading,
    error: swrEsError,
    mutate: mutateEs,
  } = useSWR(employeeData.userId ? `/employee-schedule/${employeeData.userId}/all` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

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
    postResponse,
    deleteResponse,
    employeeSchedules,
    errorEmployeeSchedule,
    getEmployeeSchedules,
    getEmployeeSchedulesFail,
    getEmployeeSchedulesSuccess,
    clearScheduleSheet,
    emptyResponseAndErrors,
    loadingEmployeeSchedules,
    emptyErrors,
    emptyResponse,
  } = useScheduleSheetStore((state) => ({
    employeeSchedules: state.employeeSchedules,
    getEmployeeSchedules: state.getEmployeeSchedules,
    getEmployeeSchedulesSuccess: state.getEmployeeSchedulesSuccess,
    getEmployeeSchedulesFail: state.getEmployeeSchedulesFail,
    clearScheduleSheet: state.clearScheduleSheet,
    emptyResponseAndErrors: state.emptyResponseAndErrors,
    errorEmployeeSchedule: state.error.errorEmployeeSchedule,
    postResponse: state.employeeSchedule.postResponse,
    deleteResponse: state.employeeSchedule.deleteResponse,
    loadingEmployeeSchedules: state.loading.loadingEmployeeSchedules,
    emptyResponse: state.emptyResponse,
    emptyErrors: state.emptyErrors,
  }));

  // modal open
  const [addSchedModalIsOpen, setAddSchedModalIsOpen] = useState<boolean>(false);

  const openAddSchedModal = () => setAddSchedModalIsOpen(true);
  const closeAddSchedModal = () => {
    setAddSchedModalIsOpen(false);
  };

  const [deleteSchedModalIsOpen, setDeleteSchedModalIsOpen] = useState<boolean>(false);
  const openDeleteSchedModal = (rowData: EmployeeWithSchedule, employeeData: any) => {
    setCurrentRowData({
      ...rowData,
      employeeId: employeeData.userId,
    });

    setDeleteSchedModalIsOpen(true);
  };
  const closeDeleteSchedModal = () => {
    setCurrentRowData({} as EmployeeWithSchedule);
    mutateEs();
    setTimeout(() => {
      emptyResponseAndErrors();
    }, 500);
    setDeleteSchedModalIsOpen(false);
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: EmployeeWithSchedule) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteSchedModal(rowData, employeeData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </>
    );
  };

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
      cell: (info) => UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
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
      getEmployeeSchedulesSuccess(swrEmpScheds.data);
    }

    // fail
    if (!isEmpty(swrEsError)) {
      getEmployeeSchedulesFail(swrEsError.message);
    }
  }, [swrEsError, swrEmpScheds]);

  // mutate
  useEffect(() => {
    if (!isEmpty(postResponse) || !isEmpty(deleteResponse)) {
      mutateEs();
      setTimeout(() => {
        emptyResponse();
      }, 1500);
    }
  }, [postResponse, deleteResponse]);

  // clear errors
  useEffect(() => {
    if (!isEmpty(errorEmployeeSchedule)) {
      setTimeout(() => {
        emptyErrors();
      }, 1500);
    }
  }, [errorEmployeeSchedule]);

  return (
    <div className="w-full ">
      {loadingEmployeeSchedules ? <ToastNotification notifMessage="Loading Schedules" toastType="info" /> : null}

      {!isEmpty(deleteResponse) ? (
        <ToastNotification notifMessage="Successfully deleted an entry!" toastType="success" />
      ) : null}

      {!isEmpty(errorEmployeeSchedule) ? (
        <ToastNotification
          notifMessage="Something went wrong. Please try again within a few seconds"
          toastType="error"
        />
      ) : null}

      <Card title="Schedules">
        <div className="flex flex-row flex-wrap">
          <div className="flex justify-end order-2 w-1/2 pr-4 table-actions-wrapper">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
              onClick={openAddSchedModal}
            >
              <i className="bx bxs-plus-square"></i>&nbsp;{' '}
              <span className="xs:hidden sm:hidden md:hidden lg:block">Add Schedule</span>
            </button>
          </div>

          <AddEmpSchedModal
            modalState={addSchedModalIsOpen}
            setModalState={setAddSchedModalIsOpen}
            closeModalAction={closeAddSchedModal}
            employeeData={employeeData}
          />

          <DeleteEmpSchedModal
            modalState={deleteSchedModalIsOpen}
            setModalState={setDeleteSchedModalIsOpen}
            closeModalAction={closeDeleteSchedModal}
            rowData={currentRowData}
          />

          {swrEsIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <>
              <DataTable model={table} showColumnFilter={false} paginate={true} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CardEmployeeSchedules;
