/* eslint-disable @nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Fragment, useState } from 'react';
import { DtrDateSelect } from 'apps/employee-monitoring/src/components/modal/monitoring/daily-time-record/employee/DtrDateSelect';
import {
  EmployeeAttendance,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import EditDailySchedModal from 'apps/employee-monitoring/src/components/modal/monitoring/daily-time-record/employee/EditOfficeDtrModall';

var customParseFormat = require('dayjs/plugin/customParseFormat');
var localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(localizedFormat, customParseFormat);

const dtrDummy: Array<EmployeeAttendance> = [
  {
    id: 1,
    date: '01-10-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
    remarks: 'Altered by user002 on 01-12-2023',
  },
  {
    id: 2,
    date: '01-11-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
  },
  {
    id: 3,
    date: '01-12-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
  },
  {
    id: 4,
    date: '01-13-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
    remarks: 'Change requested by user005, Approved on 01-15-2023 by user002',
  },
  {
    id: 5,
    date: '01-14-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
  },
  {
    id: 6,
    date: '01-15-2023',
    timeIn: '07:30:00',
    timeOut: '17:29:00',
    lunchIn: '12:31:00',
    lunchOut: '12:01:00',
    schedule: '8:00AM - 5:00PM',
  },
];

export default function Index() {
  const router = useRouter();

  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeAttendance>(
    {} as EmployeeAttendance
  );
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: EmployeeAttendance) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  const { date } = useDtrStore((state) => ({ date: state.date }));

  // const {
  //   data: swrEmployeeDtr,
  //   isLoading: swrEmployeeDtrIsLoading,
  //   error: swrEmployeeDtrError,
  // } = useSWR(`/employees/`, fetcherEMS, {
  //   shouldRetryOnError: false,
  //   revalidateOnMount: false,
  // });

  // mm dd yyyy
  const formatDate = (date: string) => {
    return dayjs(date).format('MM-DD-YYYY');
  };

  // month day and year
  const formatDateInWords = (date: string) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Daily Time Record"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Daily Time Record',
              path: `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_FE_DOMAIN}/monitoring/daily-time-record`,
            },
            { layerNo: 2, layerText: 'Employee', path: '' },
          ]}
        />

        <div className="mx-5">
          <Card>
            {/** Top Card */}
            <div className="flex flex-col flex-wrap ">
              <Card className="rounded-t bg-slate-200">
                {/* <span className="px-8 text-lg text-center text-gray-700">
                  Employee Name
                </span> */}
                <DtrDateSelect />
              </Card>
              {/* EMPLOYEE DTR TABLE */}
              <div className="flex w-full rounded shadow">
                <table className="w-full overflow-auto border-0 border-separate bg-slate-50 border-spacing-0">
                  <thead className="border-0">
                    <tr className="text-xs">
                      <th className="px-6 py-2 text-center border">Date</th>
                      <th className="px-5 py-2 text-center border">Time In</th>
                      <th className="px-5 py-2 text-center border">
                        Lunch Out
                      </th>
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
                    {dtrDummy.filter(
                      (filterLogs) =>
                        dayjs(formatDate(filterLogs.date)).isSame(
                          dayjs(formatDate(date)),
                          'year'
                        ) &&
                        dayjs(formatDate(filterLogs.date)).isSame(
                          dayjs(formatDate(date)),
                          'month'
                        )
                    ).length > 0 ? (
                      dtrDummy
                        .filter(
                          (filterLogs) =>
                            dayjs(formatDate(filterLogs.date)).isSame(
                              dayjs(formatDate(date)),
                              'year'
                            ) &&
                            dayjs(formatDate(filterLogs.date)).isSame(
                              dayjs(formatDate(date)),
                              'month'
                            )
                        )
                        .map((logs) => {
                          return (
                            <Fragment key={logs.id}>
                              <tr>
                                <td colSpan={8}></td>
                              </tr>
                              <tr className="text-xs">
                                <td className="py-2 text-center border">
                                  {formatDateInWords(logs.date)}
                                </td>
                                <td className="py-2 text-center border">
                                  {logs.timeIn ? formatTime(logs.timeIn) : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  {logs.lunchOut
                                    ? formatTime(logs.lunchOut)
                                    : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  {logs.lunchIn
                                    ? formatTime(logs.lunchIn)
                                    : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  {logs.timeOut
                                    ? formatTime(logs.timeOut)
                                    : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  {logs.schedule}
                                </td>
                                <td className="py-2 text-xs text-center break-words border">
                                  {logs.remarks ? logs.remarks : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  <div>
                                    <button
                                      className=""
                                      onClick={() => {
                                        setCurrentRowData(logs);
                                        setEditModalIsOpen(true);
                                      }}
                                    >
                                      <i className="text-xl text-green-500 bx bxs-edit"></i>
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
            </div>
          </Card>
        </div>

        <EditDailySchedModal
          modalState={editModalIsOpen}
          setModalState={setEditModalIsOpen}
          closeModalAction={closeEditActionModal}
          rowData={currentRowData}
        />
      </div>
    </>
  );
}
