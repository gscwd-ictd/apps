/* eslint-disable @nx/enforce-module-boundaries */
import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { EmployeeDetails } from '../../../../src/types/employee.type';
import Link from 'next/link';
import { useDtrStore } from '../../../store/dtr.store';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import dayjs from 'dayjs';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { HiOutlineSearch, HiPencil, HiPencilAlt } from 'react-icons/hi';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { useState } from 'react';
import UpdateTimeLogModal from './UpdateTimeLogModal';
import { SpinnerDotted } from 'spinners-react';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';

type DtrtableProps = {
  employeeDetails: EmployeeDetails;
};

export const DtrTable = ({ employeeDetails }: DtrtableProps) => {
  const date = useDtrStore((state) => state.date);
  const employeeDtr = useDtrStore((state) => state.employeeDtr);
  const dtrIsLoading = useDtrStore((state) => state.loading.loadingDtr);
  const now = dayjs().toDate().toDateString();

  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeDtrWithSchedule>({} as EmployeeDtrWithSchedule);
  // edit modal state
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);

  // open edit action modal function
  const openEditActionModal = (rowData: EmployeeDtrWithSchedule) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };

  // close edit action modal function
  const closeEditActionModal = () => setEditModalIsOpen(false);

  return (
    <>
      <UpdateTimeLogModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {dtrIsLoading ? (
        <div className="w-full h-[90%] static flex flex-col justify-items-center items-center place-items-center">
          <SpinnerDotted
            speed={70}
            thickness={70}
            className="flex w-full h-full transition-all "
            color="slateblue"
            size={100}
          />
        </div>
      ) : !dtrIsLoading && employeeDtr?.dtrDays?.length > 0 ? (
        <>
          <div className="flex overflow-x-hidden w-full md:w-full flex-col">
            <div className="overflow-x-auto w-full md:w-full">
              <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                <thead className="border-0">
                  <tr>
                    <th className="px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                      Date
                    </th>
                    <th className="px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Time In
                    </th>
                    <th className="px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Lunch Out
                    </th>
                    <th className="px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Lunch In
                    </th>
                    <th className="px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Time Out
                    </th>
                    <th className="px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Remarks
                    </th>
                    <th className="px-5 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
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
                              ? 'bg-rose-300'
                              : logs.holidayType === HolidayTypes.SPECIAL
                              ? 'bg-blue-300'
                              : logs.dtr.remarks === 'Rest Day'
                              ? 'bg-gray-200'
                              : ''
                          }`}
                        >
                          <td
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.day}
                          </td>
                          <td
                            className={`border text-center py-2 ${
                              UseLateChecker(logs.dtr.timeIn, logs.schedule.timeIn) == true &&
                              logs.schedule.scheduleBase === 'Office'
                                ? 'text-red-500'
                                : ''
                            } ${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.dtr.timeIn ? UseTwelveHourFormat(logs.dtr.timeIn) : ''}
                          </td>
                          <td
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.dtr.lunchOut ? UseTwelveHourFormat(logs.dtr.lunchOut) : ''}
                          </td>
                          <td
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.dtr.lunchIn ? UseTwelveHourFormat(logs.dtr.lunchIn) : ''}
                          </td>
                          <td
                            className={`border text-center py-2 ${
                              UseUndertimeChecker(logs.dtr.timeOut, logs.schedule.timeOut) == true &&
                              logs.schedule.scheduleBase === 'Office'
                                ? 'text-red-500'
                                : ''
                            } ${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.dtr.timeOut ? UseTwelveHourFormat(logs.dtr.timeOut) : ''}
                          </td>
                          <td
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            {logs.dtr.remarks}
                          </td>
                          <td
                            className={`${
                              logs.holidayType === HolidayTypes.REGULAR
                                ? 'border-rose-300'
                                : logs.holidayType === HolidayTypes.SPECIAL
                                ? 'border-blue-300'
                                : ''
                            } py-2 text-center border`}
                          >
                            <Button
                              variant={'primary'}
                              size={'sm'}
                              loading={false}
                              onClick={() => openEditActionModal(logs)}
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
                      <td colSpan={6}>NO DATA FOUND</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <table className="hidden md:table w-full table-auto mt-5 border bg-slate-50">
              <thead>
                <tr className="text-sm font-medium text-center">
                  <td className="border p-1 text-gray-700">No. of Times Late</td>
                  <td className="border p-1 text-gray-700">Total Minutes Late</td>
                  <td className="border p-1 text-gray-700">Dates Late</td>
                  <td className="border p-1 text-gray-700">No. of Times Undertime</td>
                  <td className="border p-1 text-gray-700">Total Minutes Undertime</td>
                  <td className="border p-1 text-gray-700">Dates / Undertime</td>
                  <td className="border p-1 text-gray-700">No. of Times Halfday</td>
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
                  <td className="border p-1 text-gray-700">Dates / Undertime</td>
                  <td className="border p-1 text-gray-700">No. of Times Halfday</td>
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
          <div className="flex justify-end w-full pt-4">
            {/* <Link href={`/123/dtr/${date}`} target={'_blank'}>
                <Button variant={'primary'} size={'md'} loading={false}>
                  View
                </Button>
              </Link> */}
          </div>
        </>
      ) : (
        <div className="h-80 w-full text-8xl text-slate-200 flex justify-center items-center">NO DATA</div>
      )}
    </>
  );
};
