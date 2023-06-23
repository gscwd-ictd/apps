/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { EmployeeWithDetails } from '../../../../../libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import { useDtrStore } from '../../store/dtr.store';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import { HolidayTypes } from '../../utils/enum/holiday-types.enum';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import EditDailySchedModal from 'apps/employee-monitoring/src/components/modal/employees/EditOfficeTimeLogModal';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

type EmployeeDtrTableProps = {
  employeeData: EmployeeWithDetails;
};

export const EmployeeDtrTable: FunctionComponent<EmployeeDtrTableProps> = ({
  employeeData,
}) => {
  // temporary, will be used if office schedules will be captured
  const [isOfficeSchedule, setIsOfficeSchedule] = useState<boolean>(true);

  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeDtrWithSchedule>(
    {} as EmployeeDtrWithSchedule
  );

  // edit modal state
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  // open edit action modal function
  const openEditActionModal = (rowData: EmployeeDtrWithSchedule) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };

  // close edit action modal function
  const closeEditActionModal = () => setEditModalIsOpen(false);

  const {
    employeeDtr,
    isDateSearched,
    selectedMonth,
    selectedYear,
    getEmployeeDtr,
    getEmployeeDtrFail,
    getEmployeeDtrSuccess,
    getIsLoading,
  } = useDtrStore((state) => ({
    date: state.date,
    employeeDtr: state.employeeDtr,
    isDateSearched: state.isDateSearched,
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    getEmployeeDtr: state.getEmployeeDtr,
    getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
    getEmployeeDtrFail: state.getEmployeeDtrFail,
    setEmployeeDtr: state.setEmployeeDtr,
    setIsDateSearched: state.setIsDateSearched,
    getIsLoading: state.loading.loadingEmployeeDtr,
  }));

  const { data: swrDtr, error: swrDtrError } = useSWR(
    isDateSearched
      ? `daily-time-record/employees/${employeeData.companyId}/${selectedYear}/${selectedMonth}`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // compare if after
  const compareIfEarly = (
    day: string,
    actualTime: string,
    scheduledTime: string
  ) => {
    return dayjs(day + ' ' + actualTime).isBefore(
      day + ' ' + scheduledTime,
      'minute'
    );
  };

  // compare if before
  const compareIfLate = (
    day: string,
    actualTime: string,
    scheduledTime: string,
    addition?: number
  ) => {
    // addition is included since we do not set the lunch in duration
    if (addition) {
      return dayjs(day + ' ' + actualTime).isAfter(
        dayjs(day + ' ' + scheduledTime)
          .add(dayjs.duration({ minutes: 29 }))
          .format('MM DD YYYY HH:mm'),
        'minutes'
      );
    } else {
      return dayjs(day + ' ' + actualTime).isAfter(
        day + ' ' + scheduledTime,
        'minute'
      );
    }
  };

  // month day and year
  const formatDateInWords = (date: string) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null || isEmpty(date)) return '';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  // if the dtr date search button is clicked
  useEffect(() => {
    if (isDateSearched) getEmployeeDtr();
  }, [isDateSearched]);

  // if a result is returned
  useEffect(() => {
    // success
    if (!isEmpty(swrDtr)) getEmployeeDtrSuccess(swrDtr.data);

    // error
    if (!isEmpty(swrDtrError)) getEmployeeDtrFail(swrDtrError.message);
  }, [swrDtr, swrDtrError]);

  return (
    <>
      <EditDailySchedModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {/* OFFICE EMPLOYEE DTR TABLE */}
      {isOfficeSchedule ? (
        <div className="flex w-full border rounded">
          <table className="w-full overflow-auto border-separate bg-slate-50 border-spacing-0">
            <thead className="border-0">
              <tr className="text-xs">
                <th className="px-6 py-2 text-center border">Date</th>
                <th className="px-5 py-2 text-center border">Time In</th>
                <th className="px-5 py-2 text-center border">Lunch Out</th>
                <th className="px-5 py-2 text-center border">Lunch In</th>
                <th className="px-5 py-2 text-center border">Time Out</th>
                <th className="px-5 py-2 text-center border">Schedule</th>
                <th className="px-5 py-2 text-center border w-[12rem]">
                  Remarks
                </th>
                <th className="px-5 py-2 text-center border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center ">
              {!getIsLoading &&
              selectedMonth !== '--' &&
              selectedYear !== '--' &&
              !isEmpty(employeeDtr) ? (
                employeeDtr.map((logs, index) => {
                  const regularHoliday = 'bg-red-400';
                  const specialHoliday = 'bg-blue-400';
                  const underTime =
                    'bg-yellow-400 font-light rounded px-2 text-black ';
                  const normal = 'text-gray-700 ';
                  let timeInColor = '';
                  let lunchOutColor = '';
                  let lunchInColor = '';
                  let timeOutColor = '';

                  // time in color
                  compareIfLate(
                    logs.day,
                    logs.dtr.timeIn,
                    logs.schedule.timeIn
                  ) === true
                    ? (timeInColor = underTime)
                    : (timeInColor = normal);

                  // lunch out color
                  compareIfEarly(
                    logs.day,
                    logs.dtr.lunchOut,
                    logs.schedule.lunchOut
                  ) ||
                  compareIfLate(
                    logs.day,
                    logs.dtr.lunchOut,
                    logs.schedule.lunchIn
                  ) === true
                    ? (lunchOutColor = underTime)
                    : (lunchOutColor = normal);

                  // lunch in color
                  compareIfEarly(
                    logs.day,
                    logs.dtr.lunchIn,
                    logs.schedule.lunchIn
                  ) ||
                  compareIfLate(
                    logs.day,
                    logs.dtr.lunchIn,
                    logs.schedule.lunchIn,
                    29 // 12:31 lunch in + 20 = 1pm
                  ) === true
                    ? (lunchInColor = underTime)
                    : (lunchInColor = normal);

                  // time out color
                  compareIfEarly(
                    logs.day,
                    logs.dtr.timeOut,
                    logs.schedule.timeOut
                  ) === true
                    ? (timeOutColor = underTime)
                    : (timeOutColor = normal);

                  return (
                    <Fragment key={index}>
                      <tr>
                        <td colSpan={8}></td>
                      </tr>
                      <tr
                        className={`text-xs ${
                          logs.holidayType === HolidayTypes.REGULAR
                            ? regularHoliday
                            : logs.holidayType === HolidayTypes.SPECIAL
                            ? specialHoliday
                            : 'bg-inherit '
                        } `}
                      >
                        <td className="py-2 text-center border max-w-[6rem]">
                          <div className="flex justify-center gap-2">
                            <span>{formatDateInWords(logs.day)}</span>
                            <span>{dayjs(logs.day).format('ddd')}</span>
                          </div>
                        </td>
                        <td className="py-2 text-center border">
                          <span className={timeInColor}>
                            {logs.dtr.timeIn
                              ? formatTime(logs.dtr.timeIn)
                              : '-'}
                          </span>
                        </td>
                        <td className="py-2 text-center border">
                          <span className={lunchOutColor}>
                            {logs.dtr.lunchOut
                              ? formatTime(logs.dtr.lunchOut)
                              : '-'}
                          </span>
                        </td>
                        <td className="py-2 text-center border">
                          <span className={lunchInColor}>
                            {logs.dtr.lunchIn
                              ? formatTime(logs.dtr.lunchIn)
                              : '-'}
                          </span>
                        </td>
                        <td className="py-2 text-center border">
                          <span className={timeOutColor}>
                            {logs.dtr.timeOut
                              ? formatTime(logs.dtr.timeOut)
                              : '-'}
                          </span>
                        </td>
                        <td className="py-2 text-center border">
                          {formatTime(logs.schedule.timeIn)} -{' '}
                          {formatTime(logs.schedule.timeOut)}
                        </td>
                        <td className="py-2 text-xs text-center break-words border">
                          {logs.dtr.remarks ? logs.dtr.remarks : '-'}
                        </td>
                        <td className="py-2 text-center border">
                          <div>
                            <button
                              className="text-green-600 disabled:text-red-600"
                              onClick={() => openEditActionModal(logs)}
                              disabled={
                                dayjs().isBefore(dayjs(logs.day)) ||
                                dayjs().isSame(dayjs(logs.day), 'day')
                                  ? true
                                  : false
                              }
                            >
                              <i className="text-xl text-inherit bx bxs-edit"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })
              ) : (
                <tr className="border-0">
                  <td colSpan={8}>NO DATA FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* MAINTENANCE or STATION EMPLOYEE DTR TABLE */}
      {!isOfficeSchedule ? (
        <>
          <section className="grid grid-cols-11 grid-rows-2 text-xs font-semibold border rounded-tl rounded-tr border-slate-300 bg-gray-50">
            <div className="col-span-2 row-span-2 border rounded-tl ">
              <span className="flex items-center justify-center w-full h-full">
                Remarks
              </span>
            </div>
            <div className="col-span-4 row-span-1 py-1 border">
              <span className="flex items-center justify-center w-full ">
                Time in
              </span>
            </div>
            <div className="col-span-4 row-span-1 py-1 border">
              <span className="flex items-center justify-center w-full ">
                Time out
              </span>
            </div>
            <div className="col-span-1 row-span-2 border rounded-tr ">
              <span className="flex items-center justify-center w-full h-full">
                Actions
              </span>
            </div>

            <div className="col-span-4 row-span-1 border">
              <div className="grid grid-cols-5 ">
                <div className="col-span-2 py-1 text-center ">Date</div>
                <div className="col-span-1 py-1 border-x"></div>
                <div className="col-span-2 py-1 text-center">Time Log</div>
              </div>
            </div>
            <div className="col-span-4 row-span-1 border">
              <div className="grid grid-cols-5">
                <div className="col-span-2 py-1 text-center">Date</div>
                <div className="col-span-1 py-1 border-x"></div>
                <div className="col-span-2 py-1 text-center">Time Log</div>
              </div>
            </div>
          </section>
          {/* Table contents */}
          {!getIsLoading &&
          selectedMonth !== '--' &&
          selectedYear !== '--' &&
          !isEmpty(employeeDtr)
            ? employeeDtr.map((logs, index) => {
                const regularHoliday = 'bg-red-400';
                const specialHoliday = 'bg-blue-400';
                const underTime =
                  'bg-yellow-400 font-light rounded px-2 text-black ';
                const normal = 'text-gray-700 ';
                let timeInColor = '';
                let lunchOutColor = '';
                let lunchInColor = '';
                let timeOutColor = '';

                // time in color
                compareIfLate(
                  logs.day,
                  logs.dtr.timeIn,
                  logs.schedule.timeIn
                ) === true
                  ? (timeInColor = underTime)
                  : (timeInColor = normal);

                // lunch out color
                compareIfEarly(
                  logs.day,
                  logs.dtr.lunchOut,
                  logs.schedule.lunchOut
                ) ||
                compareIfLate(
                  logs.day,
                  logs.dtr.lunchOut,
                  logs.schedule.lunchIn
                ) === true
                  ? (lunchOutColor = underTime)
                  : (lunchOutColor = normal);

                // lunch in color
                compareIfEarly(
                  logs.day,
                  logs.dtr.lunchIn,
                  logs.schedule.lunchIn
                ) ||
                compareIfLate(
                  logs.day,
                  logs.dtr.lunchIn,
                  logs.schedule.lunchIn,
                  29 // 12:31 lunch in + 20 = 1pm
                ) === true
                  ? (lunchInColor = underTime)
                  : (lunchInColor = normal);

                // time out color
                compareIfEarly(
                  logs.day,
                  logs.dtr.timeOut,
                  logs.schedule.timeOut
                ) === true
                  ? (timeOutColor = underTime)
                  : (timeOutColor = normal);

                return (
                  <section
                    className={`grid grid-cols-11 text-xs  border-b  border-x border-slate-300 ${
                      logs.holidayType === HolidayTypes.REGULAR
                        ? regularHoliday
                        : logs.holidayType === HolidayTypes.SPECIAL
                        ? specialHoliday
                        : 'bg-gray-50 '
                    } `}
                    key={index}
                  >
                    <div className="col-span-2 border">
                      <span className="flex items-center justify-center w-full h-full text-center break-words">
                        {logs.dtr.remarks ? logs.dtr.remarks : '-'}
                      </span>
                    </div>
                    <div className="col-span-4 border">
                      <div className="grid grid-cols-5 ">
                        <div className="col-span-2 py-3 text-center ">
                          {formatDateInWords(logs.day)}
                        </div>
                        <div className="col-span-1 py-3 text-center border-x">
                          {dayjs(logs.day).format('ddd')}
                        </div>
                        <div className="col-span-2 py-3 text-center">
                          <span className={timeInColor}>
                            {logs.dtr.timeIn
                              ? formatTime(logs.dtr.timeIn)
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-4 border">
                      <div className="grid grid-cols-5 ">
                        <div className="col-span-2 py-3 text-center ">
                          {formatDateInWords(
                            dayjs(logs.day).add(1, 'day').format('MM-DD-YYYY')
                          )}
                        </div>
                        <div className="col-span-1 py-3 text-center border-x">
                          {dayjs(logs.day).add(1, 'day').format('ddd')}
                        </div>
                        <div className="col-span-2 py-3 text-center">
                          <span className={timeOutColor}>
                            {logs.dtr.timeOut
                              ? formatTime(logs.dtr.timeOut)
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-full col-span-1 border">
                      <button
                        className="text-green-600 disabled:text-red-600"
                        onClick={() => openEditActionModal(logs)}
                        disabled={
                          dayjs().isBefore(dayjs(logs.day)) ||
                          dayjs().isSame(dayjs(logs.day), 'day')
                            ? true
                            : false
                        }
                      >
                        <i className="text-xl text-inherit bx bxs-edit"></i>
                      </button>
                    </div>
                  </section>
                );
              })
            : null}
        </>
      ) : null}
    </>
  );
};
