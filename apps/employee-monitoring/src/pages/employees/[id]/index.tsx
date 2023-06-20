/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { Fragment, useEffect, useState } from 'react';
import { DtrDateSelect } from 'apps/employee-monitoring/src/components/modal/employees/DtrDateSelect';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import EditDailySchedModal from 'apps/employee-monitoring/src/components/modal/employees/EditOfficeTimeLogModal';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import CardEmployeeSchedules from 'apps/employee-monitoring/src/components/cards/CardEmployeeSchedules';
import duration from 'dayjs/plugin/duration';
import { PrintButton } from 'apps/employee-monitoring/src/components/buttons/PrintButton';
import DailyTimeRecordPdfModal from 'apps/employee-monitoring/src/components/modal/employees/DailyTimeRecordPdfModal';

// const CardEmployeeSchedules = dynamic(
//   () =>
//     import(
//       'apps/employee-monitoring/src/components/cards/CardEmployeeSchedules'
//     ),
//   { ssr: false }
// );

const customParseFormat = require('dayjs/plugin/customParseFormat');
const localizedFormat = require('dayjs/plugin/localizedFormat');
// const duration = require('dayjs/plugin/duration');

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export default function Index({
  employeeData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Edit modal function
  const [currentRowData, setCurrentRowData] = useState<EmployeeDtrWithSchedule>(
    {} as EmployeeDtrWithSchedule
  );
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: EmployeeDtrWithSchedule) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Print modal function
  const [printModalIsOpen, setPrintModalIsOpen] = useState<boolean>(false);

  const toggle = () => setPrintModalIsOpen(!printModalIsOpen);
  // const openPrintActionModal = () => {
  //   setPrintModalIsOpen(true)
  // }

  const {
    date,
    employeeDtr,
    isDateSearched,
    selectedMonth,
    selectedYear,
    shouldFetchDtr,
    getEmployeeDtr,
    getEmployeeDtrFail,
    getEmployeeDtrSuccess,
    setEmployeeDtr,
    setShouldFetchDtr,
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
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
    setEmployeeDtr: state.setEmployeeDtr,
    setIsDateSearched: state.setIsDateSearched,
    shouldFetchDtr: state.shouldFetchDtr,
    setShouldFetchDtr: state.setShouldFetchDtr,
    getIsLoading: state.loading.loadingEmployeeDtr,
  }));

  const {
    data: swrDtr,
    error: swrDtrError,
    mutate: swrMutate,
  } = useSWR(
    shouldFetchDtr
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

  // if the dtr date search button is clicked
  useEffect(() => {
    if (isDateSearched) setShouldFetchDtr(true);
    else if (isDateSearched === false) setShouldFetchDtr(false);
  }, [isDateSearched]);

  useEffect(() => {
    if (shouldFetchDtr) getEmployeeDtr();
  }, [shouldFetchDtr]);

  // if a result is returned
  useEffect(() => {
    // success
    if (!isEmpty(swrDtr)) getEmployeeDtrSuccess(swrDtr.data);

    // error
    if (!isEmpty(swrDtrError)) getEmployeeDtrFail(swrDtrError.message);
  }, [swrDtr, swrDtrError]);

  useEffect(() => {
    setEmployeeDtr([]);
  }, []);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Daily Time Record"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Employees',
              path: '/employees',
            },
            { layerNo: 2, layerText: 'Daily Time Record', path: '' },
          ]}
        />

        <div className="flex flex-col w-full gap-6">
          {/* DTR CARD */}
          <div className="mx-5">
            <Card>
              {/** Top Card */}
              <div className="flex flex-col flex-wrap ">
                <Card className="rounded-t bg-slate-200">
                  <div className="flex items-center gap-4 px-2">
                    {employeeData.photoUrl ? (
                      <div className="flex flex-wrap justify-center">
                        <div className="w-[6rem]">
                          <img
                            src={employeeData.photoUrl}
                            alt="user-circle"
                            className="h-auto max-w-full align-middle border-none rounded-full shadow"
                          />
                        </div>
                      </div>
                    ) : (
                      <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
                    )}

                    <div className="flex flex-col">
                      <div className="text-2xl font-semibold text-gray-600">
                        {employeeData.fullName}
                      </div>
                      <div className="text-xl text-gray-500">
                        {employeeData.assignment.positionTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <DtrDateSelect />
                    <PrintButton onClick={toggle} />
                  </div>
                </Card>

                {/* EMPLOYEE DTR TABLE */}
                <div className="flex w-full border rounded">
                  <table className="w-full overflow-auto border-separate bg-slate-50 border-spacing-0">
                    <thead className="border-0">
                      <tr className="text-xs">
                        <th className="px-6 py-2 text-center border">Date</th>
                        <th className="px-5 py-2 text-center border">
                          Time In
                        </th>
                        <th className="px-5 py-2 text-center border">
                          Lunch Out
                        </th>
                        <th className="px-5 py-2 text-center border">
                          Lunch In
                        </th>
                        <th className="px-5 py-2 text-center border">
                          Time Out
                        </th>
                        <th className="px-5 py-2 text-center border">
                          Schedule
                        </th>
                        <th className="px-5 py-2 text-center border w-[12rem]">
                          Remarks
                        </th>
                        <th className="px-5 py-2 text-center border">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-center ">
                      {!getIsLoading &&
                      selectedMonth !== '--' &&
                      selectedYear !== '--' &&
                      !isEmpty(employeeDtr) ? (
                        employeeDtr.map((logs, index) => {
                          const red = 'text-red-500';
                          const normal = 'text-gray-700';
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
                            ? (timeInColor = red)
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
                            ? (lunchOutColor = red)
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
                            ? (lunchInColor = red)
                            : (lunchInColor = normal);

                          // time out color
                          compareIfEarly(
                            logs.day,
                            logs.dtr.timeOut,
                            logs.schedule.timeOut
                          ) === true
                            ? (timeOutColor = red)
                            : (timeOutColor = normal);

                          return (
                            <Fragment key={index}>
                              <tr>
                                <td colSpan={8}></td>
                              </tr>
                              <tr className="text-xs">
                                <td className="py-2 text-center border">
                                  {formatDateInWords(logs.day)}
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
                                  {(dayjs().isAfter(dayjs(logs.day)) ||
                                    dayjs().isSame(dayjs(logs.day), 'day')) &&
                                  logs.dtr.remarks
                                    ? logs.dtr.remarks
                                    : '-'}
                                </td>
                                <td className="py-2 text-center border">
                                  <div>
                                    <button
                                      className="text-green-500 disabled:text-red-600"
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
              </div>
            </Card>
          </div>

          <div className="mx-5">
            {/* SCHEDULE CARD */}
            <CardEmployeeSchedules employeeData={employeeData} />
          </div>
        </div>

        <EditDailySchedModal
          modalState={editModalIsOpen}
          setModalState={setEditModalIsOpen}
          closeModalAction={closeEditActionModal}
          rowData={currentRowData}
        />

        <DailyTimeRecordPdfModal
          printModalIsOpen={printModalIsOpen}
          toggle={toggle}
          employeeData={employeeData}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/employees/${context.query.id}`
    );

    return { props: { employeeData: data } };
  } catch (error) {
    return { props: { employeeData: '' } };
  }
};
