/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner } from '@gscwd-apps/oneui';
import { EmployeeDetails } from '../../../../src/types/employee.type';
import { useDtrStore } from '../../../store/dtr.store';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import dayjs from 'dayjs';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { HiPencilAlt } from 'react-icons/hi';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { useState } from 'react';
import UpdateTimeLogModal from './UpdateTimeLogModal';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { UseLateLunchInChecker } from 'libs/utils/src/lib/functions/LateLunchInChecker';
import { DtrPdfModal } from './DtrPdfModal';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';

type DtrTableProps = {
  employeeDetails: EmployeeDetails;
};

export const DtrTable = ({ employeeDetails }: DtrTableProps) => {
  const { employeeDtr, dtrIsLoading, dtrModalIsOpen, dtrPdfModalIsOpen, setDtrPdfModalIsOpen, setDtrModalIsOpen } =
    useDtrStore((state) => ({
      employeeDtr: state.employeeDtr,
      dtrIsLoading: state.loading.loadingDtr,
      dtrModalIsOpen: state.dtrModalIsOpen,
      dtrPdfModalIsOpen: state.dtrPdfModalIsOpen,
      setDtrPdfModalIsOpen: state.setDtrPdfModalIsOpen,
      setDtrModalIsOpen: state.setDtrModalIsOpen,
    }));

  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeDtrWithSchedule>({} as EmployeeDtrWithSchedule);

  // open edit action modal function
  const openEditActionModal = (rowData: EmployeeDtrWithSchedule) => {
    setDtrModalIsOpen(true);
    setCurrentRowData(rowData);
  };

  // close edit action modal function
  const closeEditActionModal = () => setDtrModalIsOpen(false);

  // close dtr pdf modal function
  const closeDtrPdfModal = () => setDtrPdfModalIsOpen(false);
  return (
    <>
      <DtrPdfModal
        modalState={dtrPdfModalIsOpen}
        setModalState={setDtrPdfModalIsOpen}
        closeModalAction={closeDtrPdfModal}
        title={'Daily Time Record'}
      />

      <UpdateTimeLogModal
        modalState={dtrModalIsOpen}
        setModalState={setDtrModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {dtrIsLoading ? (
        <div className="w-full h-[90%] static flex flex-col justify-center items-center place-items-center">
          <LoadingSpinner size={'lg'} />
          {/* <SpinnerDotted
            speed={70}
            thickness={70}
            className="flex w-full h-full transition-all "
            color="slateblue"
            size={100}
          /> */}
        </div>
      ) : !dtrIsLoading && employeeDtr?.dtrDays?.length > 0 ? (
        <>
          {/* <div className="flex justify-end w-full pt-4">
            <Button variant={'primary'} size={'md'} loading={false} onClick={() => setDtrPdfModalIsOpen(true)}>
              View PDF
            </Button>
          </div> */}
          <div className="flex overflow-x-hidden w-full md:w-full flex-col">
            <div className="overflow-x-auto w-full md:w-full">
              {employeeDetails.employmentDetails.scheduleBase === ScheduleBases.OFFICE ? (
                <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                  <thead className="border-0">
                    <tr>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                        Date
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Time In
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Lunch Out
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Lunch In
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Time Out
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Schedule
                      </th>
                      <th className="w-3/12 px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Remarks
                      </th>
                      <th className="w-1/12 px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Edit
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-center ">
                    {employeeDtr?.dtrDays?.length > 0 ? (
                      employeeDtr.dtrDays.map((logs, index) => {
                        return (
                          <tr
                            key={index}
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'bg-red-200'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'bg-blue-300'
                                : logs.dtr.remarks === 'Rest Day' && !logs.dtrCorrection
                                ? 'bg-gray-200'
                                : logs.dtrCorrection
                                ? 'bg-amber-200'
                                : ''
                            }`}
                          >
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.day}
                            </td>
                            <td
                              className={`border text-center py-2 ${
                                UseLateChecker(logs.dtr.timeIn, logs.schedule.timeIn) == true &&
                                logs.holidayType !== HolidayTypes.REGULAR &&
                                logs.holidayType !== HolidayTypes.SPECIAL &&
                                logs.dtr.remarks !== 'Rest Day'
                                  ? 'text-red-500'
                                  : ''
                              } ${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.dtr.timeIn ? UseTwelveHourFormat(logs.dtr.timeIn) : ''}
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.dtr.lunchOut ? UseTwelveHourFormat(logs.dtr.lunchOut) : ''}
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border ${
                                UseLateLunchInChecker(logs.dtr.lunchIn, logs.schedule.lunchIn) == true &&
                                logs.schedule.scheduleBase === 'Office'
                                  ? 'text-red-500'
                                  : ''
                              }`}
                            >
                              {logs.dtr.lunchIn ? UseTwelveHourFormat(logs.dtr.lunchIn) : ''}
                            </td>
                            <td
                              className={`border text-center py-2 ${
                                UseUndertimeChecker(logs.dtr.timeOut, logs.schedule.timeOut) == true &&
                                logs.holidayType !== HolidayTypes.REGULAR &&
                                logs.holidayType !== HolidayTypes.SPECIAL &&
                                logs.dtr.remarks !== 'Rest Day'
                                  ? 'text-red-500'
                                  : ''
                              } ${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.dtr.timeOut ? UseTwelveHourFormat(logs.dtr.timeOut) : ''}
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <div className="whitespace-nowrap">
                                <label>{UseTwelveHourFormat(employeeDtr.dtrDays[index].schedule.timeIn)}</label> -{' '}
                                <label>{UseTwelveHourFormat(employeeDtr.dtrDays[index].schedule.timeOut)}</label>
                              </div>
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <div className="flex flex-col gap-0">
                                <label>{logs.dtr.remarks}</label>
                                {logs.dtrCorrection ? (
                                  <label className="capitalize">Time Log Correction {logs.dtrCorrection.status}</label>
                                ) : null}
                              </div>
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <Button
                                variant={
                                  DateFormatter(logs.day, 'YYYY-MM-DD') <
                                  dayjs(dayjs().toDate().toDateString()).format('YYYY-MM-DD')
                                    ? 'primary'
                                    : 'danger'
                                }
                                size={'sm'}
                                loading={false}
                                onClick={() => openEditActionModal(logs)}
                                disabled={
                                  DateFormatter(logs.day, 'YYYY-MM-DD') <
                                  dayjs(dayjs().toDate().toDateString()).format('YYYY-MM-DD')
                                    ? false
                                    : true
                                }
                              >
                                <div className="flex justify-center">
                                  <HiPencilAlt className="w-4 h-5 md:w-4 md:h-5" />
                                </div>
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-0">
                        <td colSpan={7}>NO DATA FOUND</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                // FOR FIELD / PUMPING STATION
                <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                  <thead className="border-0">
                    <tr>
                      <th
                        colSpan={2}
                        className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700"
                      >
                        Time In
                      </th>

                      <th
                        colSpan={2}
                        className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700"
                      >
                        Time Out
                      </th>
                      <th
                        rowSpan={2}
                        className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700"
                      >
                        Schedule
                      </th>
                      <th
                        rowSpan={2}
                        className="w-3/12 px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700"
                      >
                        Remarks
                      </th>
                      <th
                        rowSpan={2}
                        className="w-1/12 px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700"
                      >
                        Edit
                      </th>
                    </tr>
                    <tr>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                        Date
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Time Log
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                        Date
                      </th>
                      <th className="w-1/12 px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                        Time Log
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-center ">
                    {employeeDtr?.dtrDays?.length > 0 ? (
                      employeeDtr.dtrDays.map((logs, index) => {
                        return (
                          <tr
                            key={index}
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'bg-red-200'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'bg-blue-300'
                                : logs.dtr.remarks === 'Rest Day'
                                ? 'bg-gray-200'
                                : logs.dtrCorrection
                                ? 'bg-amber-200'
                                : ''
                            }`}
                          >
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.day}
                            </td>
                            <td
                              className={`border text-center py-2 ${
                                UseLateChecker(logs.dtr.timeIn, logs.schedule.timeIn) == true &&
                                logs.holidayType !== HolidayTypes.REGULAR &&
                                logs.holidayType !== HolidayTypes.SPECIAL &&
                                logs.dtr.remarks !== 'Rest Day'
                                  ? 'text-red-500'
                                  : ''
                              } ${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.dtr.timeIn ? UseTwelveHourFormat(logs.dtr.timeIn) : ''}
                            </td>

                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {employeeDtr.dtrDays[index].schedule.shift === 'night'
                                ? dayjs(logs.day).add(1, 'day').format('YYYY-MM-DD')
                                : logs.day}
                            </td>
                            <td
                              className={`border text-center py-2 ${
                                UseUndertimeChecker(logs.dtr.timeOut, logs.schedule.timeOut) == true &&
                                logs.holidayType !== HolidayTypes.REGULAR &&
                                logs.holidayType !== HolidayTypes.SPECIAL &&
                                logs.dtr.remarks !== 'Rest Day'
                                  ? 'text-red-500'
                                  : ''
                              } ${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              {logs.dtr.timeOut ? UseTwelveHourFormat(logs.dtr.timeOut) : ''}
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <div className="whitespace-nowrap">
                                <label>{UseTwelveHourFormat(employeeDtr.dtrDays[index].schedule.timeIn)}</label> -{' '}
                                <label>{UseTwelveHourFormat(employeeDtr.dtrDays[index].schedule.timeOut)}</label>
                              </div>
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <div className="flex flex-col gap-0">
                                <label>{logs.dtr.remarks}</label>
                                {logs.dtrCorrection ? (
                                  <label className="capitalize">Time Log Correction {logs.dtrCorrection.status}</label>
                                ) : null}
                              </div>
                            </td>
                            <td
                              className={`${
                                logs.holidayType === HolidayTypes.REGULAR
                                  ? 'border-red-200'
                                  : logs.holidayType === HolidayTypes.SPECIAL
                                  ? 'border-blue-300'
                                  : logs.dtrCorrection
                                  ? 'border-amber-200'
                                  : ''
                              } py-2 text-center border`}
                            >
                              <Button
                                variant={
                                  DateFormatter(logs.day, 'YYYY-MM-DD') <
                                  dayjs(dayjs().toDate().toDateString()).format('YYYY-MM-DD')
                                    ? 'primary'
                                    : 'danger'
                                }
                                size={'sm'}
                                loading={false}
                                onClick={() => openEditActionModal(logs)}
                                disabled={
                                  DateFormatter(logs.day, 'YYYY-MM-DD') <
                                  dayjs(dayjs().toDate().toDateString()).format('YYYY-MM-DD')
                                    ? false
                                    : true
                                }
                              >
                                <div className="flex justify-center">
                                  <HiPencilAlt className="w-4 h-5 md:w-4 md:h-5" />
                                </div>
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-0">
                        <td colSpan={7}>NO DATA FOUND</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <table className="hidden md:table w-full table-auto mt-5 border bg-slate-50">
              <thead>
                <tr className="text-sm font-medium text-center">
                  <td className="border p-1 text-gray-700">No. of Times Late</td>
                  <td className="border p-1 text-gray-700">Total Minutes Late</td>
                  <td className="border p-1 text-gray-700">Dates Late</td>
                  <td className="border p-1 text-gray-700">No. of Times Undertime</td>
                  <td className="border p-1 text-gray-700">Total Minutes Undertime</td>
                  <td className="border p-1 text-gray-700">Dates Undertime</td>
                  <td className="border p-1 text-gray-700">No. of Times Halfday (AM/PM)</td>
                  <td className="border p-1 text-gray-700">Dates Half Day</td>
                  <td className="border p-1 text-gray-700">No Attendance</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm font-light text-center">
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesLate ?? '--'}</td>
                  <td className="border p-1">{employeeDtr.summary?.totalMinutesLate ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.lateDates && employeeDtr.summary?.lateDates.length > 0
                      ? employeeDtr.summary?.lateDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.lateDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesUndertime ?? '--'}</td>
                  <td className="border p-1">{employeeDtr.summary?.totalMinutesUndertime ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.undertimeDates && employeeDtr.summary?.undertimeDates.length > 0
                      ? employeeDtr.summary?.undertimeDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.undertimeDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesHalfDay ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.halfDayDates && employeeDtr.summary?.halfDayDates.length > 0
                      ? employeeDtr.summary?.halfDayDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.halfDayDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>

                  <td className="border p-1">
                    {employeeDtr.summary?.noAttendance && employeeDtr.summary?.noAttendance.length > 0
                      ? employeeDtr.summary?.noAttendance.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.noAttendance.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* MOBILE VIEW */}
            <table className="table w-full md:hidden table-auto mt-5 border bg-slate-50">
              <thead>
                <tr className="text-sm font-medium text-center">
                  <td className="border p-1 text-gray-700">No. of Times Late</td>
                  <td className="border p-1 text-gray-700">Total Minutes Late</td>
                  <td className="border p-1 text-gray-700">Dates Late</td>
                  <td className="border p-1 text-gray-700">No. of Times Undertime</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm font-light text-center">
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesLate ?? '--'}</td>
                  <td className="border p-1">{employeeDtr.summary?.totalMinutesLate ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.lateDates && employeeDtr.summary?.lateDates.length > 0
                      ? employeeDtr.summary?.lateDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.lateDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesUndertime ?? '--'}</td>
                </tr>
              </tbody>
            </table>

            <table className="table md:hidden table-auto mt-5 border bg-slate-50">
              <thead>
                <tr className="text-sm font-medium text-center">
                  <td className="border p-1 text-gray-700">Total Minutes Undertime</td>
                  <td className="border p-1 text-gray-700">Dates Undertime</td>
                  <td className="border p-1 text-gray-700">No. of Times Halfday</td>
                  <td className="border p-1 text-gray-700">Dates Half Day</td>
                  <td className="border p-1 text-gray-700">No Attendance</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm font-light text-center">
                  <td className="border p-1">{employeeDtr.summary?.totalMinutesUndertime ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.undertimeDates && employeeDtr.summary?.undertimeDates.length > 0
                      ? employeeDtr.summary?.undertimeDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.undertimeDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                  <td className="border p-1">{employeeDtr.summary?.noOfTimesHalfDay ?? '--'}</td>
                  <td className="border p-1">
                    {employeeDtr.summary?.halfDayDates && employeeDtr.summary?.halfDayDates.length > 0
                      ? employeeDtr.summary?.halfDayDates.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.halfDayDates.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                  <td className="border p-1">
                    {employeeDtr.summary?.noAttendance && employeeDtr.summary?.noAttendance.length > 0
                      ? employeeDtr.summary?.noAttendance.map((day, index) => {
                          return (
                            <span key={index}>
                              {index === employeeDtr.summary?.noAttendance.length - 1 ? <>{day}</> : <>{day}, </>}
                            </span>
                          );
                        })
                      : '--'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="h-80 w-full text-8xl text-slate-200 flex justify-center items-center">NO DATA</div>
      )}
    </>
  );
};
