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
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { CardMiniStats } from '../cards/CardMiniStats';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

type LeaveLedgerTableProps = {
  employeeData: EmployeeWithDetails;
};

export const LeaveLedgerTable: FunctionComponent<LeaveLedgerTableProps> = ({
  employeeData,
}) => {
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

  const {
    data: swrDtr,
    isLoading: swrDtrIsLoading,
    error: swrDtrError,
  } = useSWR(
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
    // success
    if (!isEmpty(swrDtr)) getEmployeeDtrSuccess(swrDtr.data);

    // error
    if (!isEmpty(swrDtrError)) getEmployeeDtrFail(swrDtrError.message);
  }, [swrDtr, swrDtrError]);

  if (swrDtrIsLoading)
    return (
      <>
        <LoadingSpinner size="lg" />
      </>
    );

  return (
    <>
      {/* Leave Ledger Table */}

      <div className="w-full grid-cols-4 gap-5 pb-5 sm:flex sm:flex-col lg:flex lg:flex-row">
        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-hand-right"></i>}
            title="Forced Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-red-500"
            value={6.25}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bx-run"></i>}
            title="Vacation Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-green-600 "
            value={13.656}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-band-aid "></i>}
            title="Sick Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-orange-400 "
            value={18.75}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-offer"></i>}
            title="Special Leave Benefits"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-cyan-600 "
            value={0}
          />
        </div>
      </div>

      <div className="flex w-full overflow-auto border rounded-lg shadow">
        <table className="w-full table-auto bg-slate-50 ">
          <thead className="border-0">
            <tr className="text-xs border-b divide-x">
              <th className="px-5 py-2 w-[12rem] font-semibold text-center text-gray-900 uppercase">
                Period
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Particulars
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Forced Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                FL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Vacation Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                VL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Sick Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                SL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Special Leave Benefit
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                SLB Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase w-[12rem]">
                Date & Action taken on Leave Application
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-center ">
            {!getIsLoading &&
            selectedMonth !== '--' &&
            selectedYear !== '--' &&
            !isEmpty(employeeDtr) ? (
              employeeDtr.dtrDays.map((logs, index) => {
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
                      <td
                        className={`py-2 text-center border max-w-[6rem] ${checkIfHoliday(
                          logs.holidayType
                        )}`}
                      >
                        <div className="flex justify-center gap-2">
                          <span>{formatDateInWords(logs.day)}</span>
                          <span>{dayjs(logs.day).format('ddd')}</span>
                        </div>
                      </td>
                      <td className="py-2 text-center border">
                        <span
                          className={`${checkIfHoliday(
                            logs.holidayType
                          )} ${timeInColor}`}
                        >
                          {logs.dtr.timeIn ? formatTime(logs.dtr.timeIn) : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center border">
                        <span
                          className={`${checkIfHoliday(
                            logs.holidayType
                          )} ${lunchOutColor}`}
                        >
                          {logs.dtr.lunchOut
                            ? formatTime(logs.dtr.lunchOut)
                            : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center border">
                        <span
                          className={`${checkIfHoliday(
                            logs.holidayType
                          )} ${lunchInColor}`}
                        >
                          {logs.dtr.lunchIn
                            ? formatTime(logs.dtr.lunchIn)
                            : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center border">
                        <span
                          className={`${checkIfHoliday(
                            logs.holidayType
                          )} ${timeOutColor}`}
                        >
                          {logs.dtr.timeOut
                            ? formatTime(logs.dtr.timeOut)
                            : '-'}
                        </span>
                      </td>
                      <td
                        className={`py-2 text-center border ${checkIfHoliday(
                          logs.holidayType
                        )} `}
                      >
                        {formatTime(logs.schedule.timeIn)} -{' '}
                        {formatTime(logs.schedule.timeOut)}
                      </td>
                      <td
                        className={`py-2 text-xs text-center break-words border ${checkIfHoliday(
                          logs.holidayType
                        )} `}
                      >
                        {logs.dtr.remarks ? logs.dtr.remarks : '-'}
                      </td>
                      <td className="py-2 text-center border">
                        <div>
                          <button
                            className="text-green-700 disabled:text-red-600"
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
              <>
                <tr className="text-sm border-b divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    CREDIT | Beginning Balance - 2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">5.000</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">12.500</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">17.500</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    0.00
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                </tr>
                <tr className="text-sm tracking-tight border-b divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    CREDIT | Earned Leave - JANUARY 2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    5.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    12.500
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    17.500
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
                  </td>
                </tr>
                <tr className="text-sm divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start">
                    01/04/2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    DEBIT | Tardiness - 01-04-2023=45
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    6.250
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-red-600">-0.094</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    13.750
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    18.750
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
