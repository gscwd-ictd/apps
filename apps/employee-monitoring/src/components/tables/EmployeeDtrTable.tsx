/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
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
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { ScheduleBase } from '../../utils/enum/schedule-bases.enum';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import EditRemarksModal from '../modal/employees/EditRemarksModal';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

type EmployeeDtrTableProps = {
  employeeData: EmployeeWithDetails;
};

export const EmployeeDtrTable: FunctionComponent<EmployeeDtrTableProps> = ({ employeeData }) => {
  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeDtrWithSchedule>({} as EmployeeDtrWithSchedule);

  // open edit action modal
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  const openEditActionModal = (rowData: EmployeeDtrWithSchedule) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // open remark action modal
  const [editRemarksModalIsOpen, setEditRemarksModalIsOpen] = useState<boolean>(false);

  const openEditRemarksModal = (rowData: EmployeeDtrWithSchedule) => {
    setEditRemarksModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditRemarksActionModal = () => setEditRemarksModalIsOpen(false);

  const {
    employeeDtr,
    errorEmployeeDtr,

    isDateSearched,
    setIsDateSearched,
    selectedMonth,
    selectedYear,

    getEmployeeDtr,
    getEmployeeDtrFail,
    getEmployeeDtrSuccess,

    getIsLoading,
    patchIsLoading,
    employeeDailyRecord,
  } = useDtrStore((state) => ({
    employeeDtr: state.employeeDtr,
    errorEmployeeDtr: state.error.errorEmployeeDtr,

    isDateSearched: state.isDateSearched,
    setIsDateSearched: state.setIsDateSearched,
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,

    getEmployeeDtr: state.getEmployeeDtr,
    getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
    getEmployeeDtrFail: state.getEmployeeDtrFail,

    getIsLoading: state.loading.loadingEmployeeDtr,
    patchIsLoading: state.loading.loadingUpdateEmployeeDtr,
    employeeDailyRecord: state.employeeDailyRecord,
  }));

  const {
    data: swrDtr,
    isLoading: swrDtrIsLoading,
    error: swrDtrError,
    mutate: mutateDtr,
  } = useSWR(
    isDateSearched ? `daily-time-record/employees/${employeeData.companyId}/${selectedYear}/${selectedMonth}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidate: true,
    }
  );

  // compare if after
  const compareIfEarly = (day: string, actualTime: string, scheduledTime: string) => {
    return dayjs(day + ' ' + actualTime).isBefore(day + ' ' + scheduledTime, 'minute');
  };

  // compare if before
  const compareIfLate = (day: string, actualTime: string, scheduledTime: string, addition?: number) => {
    // addition is included since we do not set the lunch in duration
    if (addition) {
      return dayjs(day + ' ' + actualTime).isAfter(
        dayjs(day + ' ' + scheduledTime)
          .add(dayjs.duration({ minutes: 29 }))
          .format('MM DD YYYY HH:mm'),
        'minutes'
      );
    } else {
      return dayjs(day + ' ' + actualTime).isAfter(day + ' ' + scheduledTime, 'minute');
    }
  };

  // check if holiday
  const checkIfHoliday = (type) => {
    if (type === HolidayTypes.REGULAR) {
      return 'text-white';
    } else if (type === HolidayTypes.SPECIAL) {
      return 'text-white';
    } else return 'text-inherit';
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
    setIsDateSearched(false);

    // success
    if (!isEmpty(swrDtr)) {
      getEmployeeDtrSuccess(swrDtr.data);
    }

    // error
    if (!isEmpty(swrDtrError)) {
      getEmployeeDtrFail(swrDtrError.message);
    }
  }, [swrDtr, swrDtrError]);

  // reload table if successful update of DTR log
  useEffect(() => {
    if (!isEmpty(employeeDailyRecord)) {
      setIsDateSearched(true);
      mutateDtr();
      getEmployeeDtr();
    }
  }, [employeeDailyRecord]);

  return (
    <>
      <EditDailySchedModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      <EditRemarksModal
        modalState={editRemarksModalIsOpen}
        setModalState={setEditRemarksModalIsOpen}
        closeModalAction={closeEditRemarksActionModal}
        rowData={currentRowData}
      />

      {!isEmpty(errorEmployeeDtr) ? (
        <ToastNotification
          notifMessage="Something went wrong in fetching the DTR. Please try again later."
          toastType="error"
        />
      ) : null}

      {/* getIsLoading || */}
      {swrDtrIsLoading || getIsLoading || patchIsLoading ? (
        <>
          <LoadingSpinner size="lg" />
        </>
      ) : (
        <>
          {/* OFFICE EMPLOYEE DTR TABLE */}
          {employeeData.scheduleBase === ScheduleBase.OFFICE ? (
            <div className="flex w-full mt-2 overflow-x-auto ">
              <table className="w-full border table-auto border-spacing-0 bg-slate-50">
                <thead className="">
                  <tr className="text-xs border-b divide-x divide-y">
                    <th className="px-6 py-2 text-center ">Date</th>
                    <th className="px-5 py-2 text-center ">Time In</th>
                    <th className="px-5 py-2 text-center ">Lunch Out</th>
                    <th className="px-5 py-2 text-center ">Lunch In</th>
                    <th className="px-5 py-2 text-center ">Time Out</th>
                    <th className="px-5 py-2 text-center ">Schedule</th>
                    <th className="px-5 py-2 text-center  w-[12rem]">Remarks</th>
                    <th className="px-5 py-2 text-center ">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center ">
                  {!getIsLoading && selectedMonth !== '--' && selectedYear !== '--' && !isEmpty(employeeDtr) ? (
                    employeeDtr.dtrDays.map((logs, index) => {
                      const regularHoliday = 'bg-red-400';
                      const specialHoliday = 'bg-blue-400';
                      const underTime = 'bg-yellow-400 font-light rounded px-2 text-black ';
                      const normal = 'text-gray-700 ';
                      let timeInColor = '';
                      let lunchOutColor = '';
                      let lunchInColor = '';
                      let timeOutColor = '';

                      // time in color
                      if (logs.isRestDay === true || logs.isHoliday === true) {
                        timeInColor = normal;
                      } else {
                        compareIfLate(logs.day, logs.dtr.timeIn, logs.schedule.timeIn) === true
                          ? (timeInColor = underTime)
                          : (timeInColor = normal);
                      }

                      // lunch out color
                      compareIfEarly(logs.day, logs.dtr.lunchOut, logs.schedule.lunchOut) ||
                      compareIfLate(logs.day, logs.dtr.lunchOut, logs.schedule.lunchIn) === true
                        ? (lunchOutColor = underTime)
                        : (lunchOutColor = normal);

                      // lunch in color
                      compareIfEarly(logs.day, logs.dtr.lunchIn, logs.schedule.lunchIn) ||
                      compareIfLate(
                        logs.day,
                        logs.dtr.lunchIn,
                        logs.schedule.lunchIn,
                        29 // 12:31 lunch in + 20 = 1pm
                      ) === true
                        ? (lunchInColor = underTime)
                        : (lunchInColor = normal);

                      // time out color
                      if (logs.isRestDay === true || logs.isHoliday === true) {
                        timeOutColor = normal;
                      } else {
                        compareIfEarly(logs.day, logs.dtr.timeOut, logs.schedule.timeOut) === true
                          ? (timeOutColor = underTime)
                          : (timeOutColor = normal);
                      }

                      return (
                        <Fragment key={index}>
                          <tr
                            className={`text-xs divide-x divide-y ${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? regularHoliday
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? specialHoliday
                                : 'bg-inherit '
                            } `}
                          >
                            <td
                              className={`py-2 text-center border-b  max-w-[6rem] ${checkIfHoliday(logs.holidayType)}`}
                            >
                              <div className="flex justify-center gap-2">
                                <span>{formatDateInWords(logs.day)}</span>
                                <span>{dayjs(logs.day).format('ddd')}</span>
                              </div>
                            </td>
                            <td className="py-2 text-center ">
                              <span className={`${checkIfHoliday(logs.holidayType)} ${timeInColor}`}>
                                {logs.dtr.timeIn ? formatTime(logs.dtr.timeIn) : '-'}
                              </span>
                            </td>
                            <td className="py-2 text-center ">
                              <span className={`${checkIfHoliday(logs.holidayType)} ${lunchOutColor}`}>
                                {logs.dtr.lunchOut ? formatTime(logs.dtr.lunchOut) : '-'}
                              </span>
                            </td>
                            <td className="py-2 text-center ">
                              <span className={`${checkIfHoliday(logs.holidayType)} ${lunchInColor}`}>
                                {logs.dtr.lunchIn ? formatTime(logs.dtr.lunchIn) : '-'}
                              </span>
                            </td>
                            <td className="py-2 text-center ">
                              <span className={`${checkIfHoliday(logs.holidayType)} ${timeOutColor}`}>
                                {logs.dtr.timeOut ? formatTime(logs.dtr.timeOut) : '-'}
                              </span>
                            </td>
                            <td className={`py-2 text-center  ${checkIfHoliday(logs.holidayType)} `}>
                              {formatTime(logs.schedule.timeIn)} - {formatTime(logs.schedule.timeOut)}
                            </td>
                            <td
                              className={`py-2 text-xs text-center break-words  ${checkIfHoliday(logs.holidayType)} `}
                            >
                              {logs.dtr.remarks ? logs.dtr.remarks : '-'}
                            </td>
                            <td className="py-2 text-center ">
                              <div className="flex justify-center gap-1">
                                {/* Time log edit button */}
                                <button
                                  className="px-1 text-white bg-green-600 rounded disabled:bg-red-600"
                                  onClick={() => openEditActionModal(logs)}
                                  disabled={
                                    dayjs().isBefore(dayjs(logs.day)) || dayjs().isSame(dayjs(logs.day), 'day')
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="text-lg text-inherit bx bx-edit"></i>
                                </button>

                                {/* Remarks button */}
                                {/* <button
                                  className="px-1 text-white bg-blue-600 rounded disabled:bg-red-600"
                                  onClick={() => openEditRemarksModal(logs)}
                                >
                                  <i className="text-lg text-inherit bx bx-comment-edit"></i>
                                </button> */}
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

          {/* FIELD/STATION EMPLOYEE DTR TABLE */}
          {employeeData.scheduleBase === ScheduleBase.FIELD ||
          employeeData.scheduleBase === ScheduleBase.PUMPING_STATION ? (
            <>
              <section className="grid grid-cols-11 grid-rows-2 text-xs font-semibold border rounded-tl rounded-tr border-slate-300 bg-gray-50 mt-2">
                <div className="col-span-2 row-span-2 border rounded-tl ">
                  <span className="flex items-center justify-center w-full h-full">Remarks</span>
                </div>
                <div className="col-span-4 row-span-1 py-1 border">
                  <span className="flex items-center justify-center w-full ">Time in</span>
                </div>
                <div className="col-span-4 row-span-1 py-1 border">
                  <span className="flex items-center justify-center w-full ">Time out</span>
                </div>
                <div className="col-span-1 row-span-2 border rounded-tr ">
                  <span className="flex items-center justify-center w-full h-full">Actions</span>
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
              {!getIsLoading && selectedMonth !== '--' && selectedYear !== '--' && !isEmpty(employeeDtr)
                ? employeeDtr.dtrDays.map((logs, index) => {
                    const regularHoliday = 'bg-red-400';
                    const specialHoliday = 'bg-blue-400';
                    const underTime = 'bg-yellow-400 font-light rounded px-2 text-black ';
                    const normal = 'text-gray-700 ';
                    let timeInColor = '';
                    let timeOutColor = '';

                    // time in color
                    compareIfLate(logs.day, logs.dtr.timeIn, logs.schedule.timeIn) === true
                      ? (timeInColor = underTime)
                      : (timeInColor = normal);

                    // time out color
                    compareIfEarly(logs.day, logs.dtr.timeOut, logs.schedule.timeOut) === true
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

                        {/* TIME IN */}
                        <div className="col-span-4 border">
                          <div className="grid grid-cols-5 ">
                            <div className="col-span-2 py-3 text-center ">{formatDateInWords(logs.day)}</div>
                            <div className="col-span-1 py-3 text-center border-x">{dayjs(logs.day).format('ddd')}</div>
                            <div className="col-span-2 py-3 text-center">
                              <span className={timeInColor}>{logs.dtr.timeIn ? formatTime(logs.dtr.timeIn) : '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* TIME OUT */}
                        <div className="col-span-4 border">
                          <div className="grid grid-cols-5 ">
                            <div className="col-span-2 py-3 text-center ">
                              {logs.schedule.shift === 'night'
                                ? formatDateInWords(dayjs(logs.day).add(1, 'day').format('MM-DD-YYYY'))
                                : formatDateInWords(dayjs(logs.day).format('MM-DD-YYYY'))}
                            </div>
                            <div className="col-span-1 py-3 text-center border-x">
                              {logs.schedule.shift === 'night'
                                ? dayjs(logs.day).add(1, 'day').format('ddd')
                                : dayjs(logs.day).format('ddd')}
                            </div>
                            <div className="col-span-2 py-3 text-center">
                              <span className={timeOutColor}>
                                {logs.dtr.timeOut ? formatTime(logs.dtr.timeOut) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex items-center justify-center w-full col-span-1 border gap-1">
                          {/* Time log edit button */}
                          <button
                            className="px-1 text-white bg-green-600 rounded disabled:bg-red-600"
                            onClick={() => openEditActionModal(logs)}
                            disabled={
                              dayjs().isBefore(dayjs(logs.day)) || dayjs().isSame(dayjs(logs.day), 'day') ? true : false
                            }
                          >
                            <i className="text-lg text-inherit bx bx-edit"></i>
                          </button>

                          {/* Remarks button */}
                          {/* <button
                            className="px-1 text-white bg-blue-600 rounded disabled:bg-red-600"
                            onClick={() => openEditRemarksModal(logs)}
                          >
                            <i className="text-lg text-inherit bx bx-comment-edit"></i>
                          </button> */}
                        </div>
                      </section>
                    );
                  })
                : null}
            </>
          ) : null}

          {/* Aggregate data */}
          <table className="w-full mt-5 border table-auto ">
            <thead>
              <tr className="text-sm font-medium text-center">
                <td className="p-1 text-gray-700 border">No. of Times Late</td>
                <td className="p-1 text-gray-700 border">Total Minutes Late</td>
                <td className="p-1 text-gray-700 border">Dates Late</td>
                <td className="p-1 text-gray-700 border">No. of Times Undertime</td>
                <td className="p-1 text-gray-700 border">Total Minutes Undertime</td>
                <td className="p-1 text-gray-700 border">Dates/Undertime</td>
                <td className="p-1 text-gray-700 border">No. of Times Half Day</td>
                <td className="p-1 text-gray-700 border">Dates Half Day</td>
                <td className="p-1 text-gray-700 border">No Attendance</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm font-light text-center">
                <td className="p-1 border">{employeeDtr?.summary?.noOfTimesLate ?? '--'}</td>
                <td className="p-1 border">{employeeDtr?.summary?.totalMinutesLate ?? '--'}</td>
                <td className="p-1 border">
                  {employeeDtr?.summary?.lateDates && employeeDtr?.summary?.lateDates.length > 0
                    ? employeeDtr?.summary?.lateDates.map((day, index) => {
                        return (
                          <span key={index}>
                            {index === employeeDtr?.summary?.lateDates.length - 1 ? <>{day}</> : <>{day}, </>}
                          </span>
                        );
                      })
                    : '--'}
                </td>
                <td className="p-1 border">{employeeDtr?.summary?.noOfTimesUndertime ?? '--'}</td>
                <td className="p-1 border">{employeeDtr?.summary?.totalMinutesUndertime ?? '--'}</td>
                <td className="p-1 border">
                  {employeeDtr?.summary?.undertimeDates && employeeDtr?.summary?.undertimeDates.length > 0
                    ? employeeDtr?.summary?.undertimeDates.map((day, index) => {
                        return (
                          <span key={index}>
                            {index === employeeDtr?.summary?.undertimeDates.length - 1 ? <>{day}</> : <>{day}, </>}
                          </span>
                        );
                      })
                    : '--'}
                </td>
                <td className="p-1 border">{employeeDtr?.summary?.noOfTimesHalfDay ?? '--'}</td>
                <td className="p-1 border">
                  {employeeDtr?.summary?.halfDayDates && employeeDtr?.summary?.halfDayDates.length > 0
                    ? employeeDtr?.summary?.halfDayDates.map((day, index) => {
                        return (
                          <span key={index}>
                            {index === employeeDtr?.summary?.halfDayDates.length - 1 ? <>{day}</> : <>{day}, </>}
                          </span>
                        );
                      })
                    : '--'}
                </td>
                <td className="p-1 border">
                  {employeeDtr?.summary?.noAttendance && employeeDtr?.summary?.noAttendance.length > 0
                    ? employeeDtr?.summary?.noAttendance.map((day, index) => {
                        return (
                          <span key={index}>
                            {index === employeeDtr?.summary?.noAttendance.length - 1 ? <>{day}</> : <>{day}, </>}
                          </span>
                        );
                      })
                    : '--'}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};
