/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import { EmployeeDtrWithSchedule, EmployeeDtrWithScheduleAndSummary } from 'libs/utils/src/lib/types/dtr.type';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import React, { FunctionComponent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';

type DtrPdfProps = {
  employeeDtr: EmployeeDtrWithScheduleAndSummary;
  employeeData: EmployeeWithDetails;
};

const styles = StyleSheet.create({
  page: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  employeeProfile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 7.5,
    paddingTop: 15,
    width: '100%',
  },
  dtrContainer: {
    alignItems: 'center',
    border: '1px solid #000000',
    marginTop: 10,
  },
  aggregateContainer: {
    alignItems: 'center',
    border: '1px solid #000000',
    marginTop: 10,
  },
  tableHeader: {
    borderRight: '1px solid #000000',
    fontSize: 8,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableHeader2: {
    borderRight: '1px solid #000000',
    fontSize: 8,
    textAlign: 'center',
    alignContent: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableHeaderText: {
    paddingVertical: 3,
    textTransform: 'uppercase',
    margin: 'auto 0',
  },
  tableData: {
    borderRight: '1px solid #000000',
    fontSize: 7.5,
    textAlign: 'center',
    alignItems: 'center',
  },
  tableDataText: {
    paddingVertical: 3,
    paddingHorizontal: 1,
    textTransform: 'capitalize',
  },
  certifyContainer: {
    paddingVertical: 10,
  },
  certifyText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  notesContainer: {
    paddingTop: 15,
  },
  notesText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  signatoryContainer: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w100: { width: '100%' },
  w80: { width: '80%' },
  w75: { width: '75%' },
  w50: { width: '50%' },
  w45: { width: '45%' },
  w40: { width: '40%' },
  w37_5: { width: 'w37.5%' },
  w30: { width: '30%' },
  w25: { width: '25%' },
  w20: { width: '20%' },
  w15: { width: '15%' },
  w12: { width: '12%' },
  w11: { width: '11%' },
  w10: { width: '10%' },
  w9: { width: '9%' },
  w8: { width: '8%' },
  w5: { width: '5%' },
});

export const DtrPdf: FunctionComponent<DtrPdfProps> = ({ employeeData, employeeDtr }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  // convert to 12-hour time format
  const twelveHourFormat = (time: string | null) => {
    if (time === null || isEmpty(time)) return '';
    else return dayjs('01-01-0000' + ' ' + time).format('h:mm A');
  };

  // compare to schedule if undertime
  const compareIfEarly = (day: string, actualTime: string, scheduledTime: string) => {
    return dayjs(day + ' ' + actualTime).isBefore(day + ' ' + scheduledTime, 'minute');
  };

  // comparison to schedule if late
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

  // check if date is rest day
  const checkIfRestDay = (remark: string) => {
    if (remark.includes('Rest Day')) return true;

    return false;
  };

  // check if date is holiday
  const checkIfHoliday = (holidayType: string) => {
    if (holidayType === HolidayTypes.REGULAR) {
      return HolidayTypes.REGULAR;
    } else if (holidayType === HolidayTypes.SPECIAL) {
      return HolidayTypes.SPECIAL;
    } else {
      return '';
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Daily Time Record">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]}>
              <View style={styles.page}>
                {/* HEADER */}
                <View style={styles.rowContainer}>
                  {/* LEFT */}
                  <View style={[styles.w30, { padding: '0 0 0 15' }]}>
                    <Image src={GscwdLogo.src} style={[styles.logo]} />
                  </View>

                  {/* CENTER */}
                  <View style={[styles.w40, styles.horizontalCenter]}>
                    <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }}>GENERAL SANTOS WATER DISTRICT</Text>
                    <Text style={{ fontSize: 9, paddingTop: 3 }}>E. Ferdnandez St., Lagao General Santos City</Text>
                    <Text
                      style={{
                        fontSize: 11,
                        paddingTop: 3,
                        fontFamily: 'Helvetica-Bold',
                      }}
                    >
                      DAILY TIME RECORD
                    </Text>

                    {/* DATE PERIOD */}
                    {employeeDtr.dtrDays?.length > 0 ? (
                      <Text style={{ fontSize: 9, paddingTop: 10 }}>
                        As of <Text>{dayjs(employeeDtr.dtrDays[0]?.day).format('MM/DD/YYYY')}</Text> to{' '}
                        <Text>
                          {dayjs(employeeDtr.dtrDays[employeeDtr.dtrDays?.length - 1]?.day).format('MM/DD/YYYY')}
                        </Text>
                      </Text>
                    ) : null}

                    {/* <Text style={{ fontSize: 9, paddingTop: 10 }}>
                      For the month of{' '}
                      <Text
                        style={{
                          textTransform: 'uppercase',
                          fontFamily: 'Helvetica-Bold',
                        }}
                      >
                        {dayjs(employeeDtr[0].day).format('MMMM YYYY')}
                      </Text>
                    </Text> */}
                  </View>

                  {/* RIGHT */}
                  <View style={[styles.w30]}>{/* ISO CODE */}</View>
                </View>

                {/* EMPLOYEE PROFILE */}
                <View style={styles.employeeProfile}>
                  <View>
                    {/* NAME */}
                    <View style={[styles.rowContainer]}>
                      <Text style={[styles.w20]}>NAME</Text>
                      <Text
                        style={[
                          styles.w80,
                          {
                            fontFamily: 'Helvetica-Bold',
                            textTransform: 'uppercase',
                            fontSize: 8.3,
                          },
                        ]}
                      >
                        {employeeData.fullName}
                      </Text>
                    </View>

                    {/* DESIGNATION */}
                    <View style={[styles.rowContainer, { paddingTop: 2 }]}>
                      <Text style={[styles.w20]}>DESIGNATION</Text>
                      <Text style={[styles.w80, { textTransform: 'uppercase', fontSize: 8 }]}>
                        {employeeData.assignment.positionTitle}
                      </Text>
                    </View>

                    {/* OFFICE */}
                    <View style={[styles.rowContainer, { paddingTop: 4 }]}>
                      <Text style={[styles.w20]}>OFFICE</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.officeName}</Text>
                    </View>

                    {/* DEPARTMENT */}
                    <View style={[styles.rowContainer]}>
                      <Text style={[styles.w20]}>DEPARTMENT</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.departmentName}</Text>
                    </View>

                    {/* DIVISION */}
                    <View style={[styles.rowContainer]}>
                      <Text style={[styles.w20]}>DIVISION</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.divisionName}</Text>
                    </View>
                  </View>
                </View>

                {/* DAILY TIME LOGS */}
                <View style={[styles.dtrContainer]}>
                  {/* COLUMN HEADERS  */}
                  <View>
                    {/* For Office Schedule */}
                    {employeeData.scheduleBase === ScheduleBases.OFFICE ? (
                      <View style={[styles.rowContainer]}>
                        <View style={[styles.tableHeader, styles.w10]}>
                          <Text style={[styles.tableHeaderText]}>DATE</Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w5]}>
                          <Text></Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w25]}>
                          <Text style={[styles.tableHeaderText]}>REMARKS</Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w15]}>
                          <Text style={[styles.tableHeaderText]}>TIME IN</Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w15]}>
                          <Text style={[styles.tableHeaderText]}>LUNCH OUT</Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w15]}>
                          <Text style={[styles.tableHeaderText]}>LUNCH IN</Text>
                        </View>
                        <View style={[styles.tableHeader, styles.w15, { borderRight: 'none' }]}>
                          <Text style={[styles.tableHeaderText]}>TIME OUT</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* For Field/Pumping Station Schedule */}
                    {employeeData.scheduleBase === ScheduleBases.FIELD ||
                    employeeData.scheduleBase === ScheduleBases.PUMPING_STATION ? (
                      <View style={[styles.rowContainer]}>
                        <View style={[styles.tableHeader, styles.w25]}>
                          <Text style={{ margin: 'auto 0' }}>REMARKS</Text>
                        </View>

                        {/* TIME IN */}
                        <View style={[styles.tableHeader, styles.w37_5]}>
                          <Text style={[styles.tableHeaderText]}>TIME IN</Text>
                          <View style={[styles.rowContainer, styles.w100, styles.borderTop]}>
                            <View style={[styles.tableHeader, styles.w45]}>
                              <Text style={[styles.tableHeaderText]}>DATE</Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w10]}>
                              <Text></Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w45, { borderRight: 'none' }]}>
                              <Text style={[styles.tableHeaderText]}>TIME LOG</Text>
                            </View>
                          </View>
                        </View>

                        {/* TIME OUT */}
                        <View style={[styles.tableHeader, styles.w37_5, { borderRight: 'none' }]}>
                          <Text style={[styles.tableHeaderText]}>TIME OUT</Text>
                          <View style={[styles.rowContainer, styles.w100, styles.borderTop]}>
                            <View style={[styles.tableHeader, styles.w45]}>
                              <Text style={[styles.tableHeaderText]}>DATE</Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w10]}>
                              <Text></Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w45, { borderRight: 'none' }]}>
                              <Text style={[styles.tableHeaderText]}>TIME LOG</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* TABLE ROWS */}
                  <View>
                    {/* For Office Schedule */}
                    {employeeData.scheduleBase === ScheduleBases.OFFICE
                      ? employeeDtr.dtrDays?.map((log, index) => {
                          const yellow = 'yellow';
                          const gray = '#9CA3AF';
                          const white = '#FFFFFF';
                          const red = '#ff8b8b';
                          const blue = '#6eb4ff';

                          let logBgColor = '';
                          let timeInColor = '';
                          let lunchOutColor = '';
                          let lunchInColor = '';
                          let timeOutColor = '';

                          // row color
                          checkIfHoliday(log.holidayType) === HolidayTypes.REGULAR
                            ? (logBgColor = red)
                            : checkIfHoliday(log.holidayType) === HolidayTypes.SPECIAL
                            ? (logBgColor = blue)
                            : checkIfRestDay(log.dtr.remarks) === true
                            ? (logBgColor = gray)
                            : (logBgColor = white);

                          // time in color
                          if (log.isRestDay === true) {
                            timeInColor = gray;
                          } else if (log.isHoliday === true) {
                            timeInColor = red;
                          } else {
                            compareIfLate(log.day, log.dtr.timeIn, log.schedule.timeIn) === true
                              ? (timeInColor = yellow)
                              : (timeInColor = '');
                          }

                          // lunch out color
                          compareIfEarly(log.day, log.dtr.lunchOut, log.schedule.lunchOut) ||
                          compareIfLate(log.day, log.dtr.lunchOut, log.schedule.lunchIn) === true
                            ? (lunchOutColor = yellow)
                            : (lunchOutColor = '');

                          // lunch in color
                          compareIfEarly(log.day, log.dtr.lunchIn, log.schedule.lunchIn) ||
                          compareIfLate(
                            log.day,
                            log.dtr.lunchIn,
                            log.schedule.lunchIn,
                            29 // 12:31 lunch in + 20 = 1pm
                          ) === true
                            ? (lunchInColor = yellow)
                            : (lunchInColor = '');

                          // time out color
                          if (log.isRestDay === true) {
                            timeOutColor = gray;
                          } else if (log.isHoliday === true) {
                            timeInColor = red;
                          } else {
                            compareIfEarly(log.day, log.dtr.timeOut, log.schedule.timeOut) === true
                              ? (timeOutColor = yellow)
                              : (timeOutColor = '');
                          }

                          return (
                            <View
                              style={[
                                styles.rowContainer,
                                styles.borderTop,
                                { width: '100%', backgroundColor: logBgColor },
                              ]}
                              key={index}
                            >
                              {/* DATE */}
                              <View style={[styles.tableData, styles.w10]}>
                                <Text style={[styles.tableDataText]}>{log.day}</Text>
                              </View>

                              {/* DAY OF THE WEEK */}
                              <View style={[styles.tableData, styles.w5]}>
                                <Text style={[styles.tableDataText]}>{dayjs(log.day).format('ddd')}</Text>
                              </View>

                              {/* REMARKS */}
                              <View style={[styles.tableData, styles.w25]}>
                                <Text style={[styles.tableDataText]}>{log.dtr.remarks}</Text>
                              </View>

                              {/* TIME IN */}
                              <View style={[styles.tableData, styles.w15, { backgroundColor: timeInColor }]}>
                                {log.dtr.timeIn ? (
                                  <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.timeIn)}</Text>
                                ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                )}
                              </View>

                              {/* LUNCH OUT */}
                              <View style={[styles.tableData, styles.w15, { backgroundColor: lunchOutColor }]}>
                                {log.dtr.lunchOut ? (
                                  <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.lunchOut)}</Text>
                                ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                )}
                              </View>

                              {/* LUNCH IN */}
                              <View style={[styles.tableData, styles.w15, { backgroundColor: lunchInColor }]}>
                                {log.dtr.lunchIn ? (
                                  <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.lunchIn)}</Text>
                                ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                )}
                              </View>

                              {/* TIME OUT */}
                              <View
                                style={[
                                  styles.tableData,
                                  styles.w15,
                                  {
                                    borderRight: 'none',
                                    backgroundColor: timeOutColor,
                                  },
                                ]}
                              >
                                {log.dtr.timeOut ? (
                                  <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.timeOut)}</Text>
                                ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                )}
                              </View>
                            </View>
                          );
                        })
                      : null}

                    {/* For Field/Pumping Station Schedule */}
                    {employeeData.scheduleBase === ScheduleBases.FIELD ||
                    employeeData.scheduleBase === ScheduleBases.PUMPING_STATION
                      ? employeeDtr.dtrDays?.map((log, index) => {
                          const yellow = 'yellow';
                          const gray = '#9CA3AF';
                          const white = '#FFFFFF';
                          const red = '#ff8b8b';
                          const blue = '#6eb4ff';

                          let logBgColor = '';
                          let timeInColor = '';
                          let timeOutColor = '';

                          // row color
                          checkIfHoliday(log.holidayType) === HolidayTypes.REGULAR
                            ? (logBgColor = red)
                            : checkIfHoliday(log.holidayType) === HolidayTypes.SPECIAL
                            ? (logBgColor = blue)
                            : checkIfRestDay(log.dtr.remarks) === true
                            ? (logBgColor = gray)
                            : (logBgColor = white);

                          // time in color
                          compareIfLate(log.day, log.dtr.timeIn, log.schedule.timeIn) === true
                            ? (timeInColor = yellow)
                            : (timeInColor = '');

                          // time out color
                          compareIfEarly(log.day, log.dtr.timeOut, log.schedule.timeOut) === true
                            ? (timeOutColor = yellow)
                            : (timeOutColor = '');

                          return (
                            <View
                              style={[
                                styles.rowContainer,
                                styles.borderTop,
                                { width: '100%', backgroundColor: logBgColor },
                              ]}
                              key={index}
                            >
                              <View style={[styles.tableData, styles.w25]}>
                                <Text style={{ margin: 'auto 0' }}>{log.dtr.remarks}</Text>
                              </View>

                              {/* TIME IN */}
                              <View style={[styles.tableData, styles.w37_5]}>
                                <View style={[styles.rowContainer, styles.w100]}>
                                  <View style={[styles.tableData, styles.w45]}>
                                    <Text style={[styles.tableDataText]}>{log.day}</Text>
                                  </View>

                                  <View style={[styles.tableData, styles.w10]}>
                                    <Text style={[styles.tableDataText]}>{dayjs(log.day).format('ddd')}</Text>
                                  </View>

                                  <View
                                    style={[
                                      styles.tableData,
                                      styles.w45,
                                      {
                                        borderRight: 'none',
                                        backgroundColor: timeInColor,
                                      },
                                    ]}
                                  >
                                    {log.dtr.timeIn ? (
                                      <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.timeIn)}</Text>
                                    ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                      <Text></Text>
                                    ) : (
                                      <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                    )}
                                  </View>
                                </View>
                              </View>

                              {/* TIME OUT */}
                              <View style={[styles.tableData, styles.w37_5, { borderRight: 'none' }]}>
                                <View style={[styles.rowContainer, styles.w100]}>
                                  <View style={[styles.tableData, styles.w45]}>
                                    <Text style={[styles.tableDataText]}>
                                      {/* add 1 day if night shift */}
                                      {log.schedule.shift === 'night'
                                        ? dayjs(log.day).add(1, 'day').format('YYYY-MM-DD')
                                        : dayjs(log.day).format('YYYY-MM-DD')}
                                    </Text>
                                  </View>

                                  <View style={[styles.tableData, styles.w10]}>
                                    <Text style={[styles.tableDataText]}>
                                      {log.schedule.shift === 'night'
                                        ? dayjs(log.day).add(1, 'day').format('ddd')
                                        : dayjs(log.day).format('ddd')}
                                    </Text>
                                  </View>

                                  <View
                                    style={[
                                      styles.tableData,
                                      styles.w45,
                                      styles.tableDataText,
                                      {
                                        borderRight: 'none',
                                        backgroundColor: timeOutColor,
                                      },
                                    ]}
                                  >
                                    <Text>
                                      {log.dtr.timeOut ? (
                                        <Text style={[styles.tableDataText]}>{twelveHourFormat(log.dtr.timeOut)}</Text>
                                      ) : checkIfRestDay(log.dtr.remarks) || !isEmpty(log.holidayType) ? (
                                        <Text></Text>
                                      ) : (
                                        <Text style={[styles.tableDataText, { color: 'red' }]}>No Entry</Text>
                                      )}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </View>
                </View>

                {/* AGGREGATE STATS */}
                <View style={styles.aggregateContainer}>
                  {/* COLUMN HEADER */}
                  <View style={[styles.rowContainer]}>
                    {/* NO. OF TIMES LATE */}
                    <View style={[styles.tableHeader2, styles.w11]}>
                      <Text style={[styles.tableHeaderText]}>NO. OF TIMES LATE</Text>
                    </View>

                    {/* TOTAL MINUTES LATE */}
                    <View style={[styles.tableHeader2, styles.w9]}>
                      <Text style={[styles.tableHeaderText, { paddingHorizontal: 3 }]}>TOTAL MINUTES LATE</Text>
                    </View>

                    {/* DATE/S LATE */}
                    <View style={[styles.tableHeader2, styles.w15]}>
                      <Text style={[styles.tableHeaderText]}>DATE/S LATE</Text>
                    </View>

                    {/* NO. OF TIMES UNDERTIME */}
                    <View style={[styles.tableHeader2, styles.w8]}>
                      <Text style={[styles.tableHeaderText]}>NO. OF TIMES UNDERTIME</Text>
                    </View>

                    {/* TOTAL MINUTES UNDERTIME */}
                    <View style={[styles.tableHeader2, styles.w9]}>
                      <Text style={[styles.tableHeaderText, { paddingHorizontal: 3 }]}>TOTAL MINUTES UNDERTIME</Text>
                    </View>

                    {/* DATE/S UNDERTIME */}
                    <View style={[styles.tableHeader2, styles.w15]}>
                      <Text style={[styles.tableHeaderText, { paddingHorizontal: 3 }]}>DATE/S UNDERTIME</Text>
                    </View>

                    {/* NO. OF TIMES HALF DAY (AM/PM) */}
                    <View style={[styles.tableHeader2, styles.w10]}>
                      <Text style={[styles.tableHeaderText, { paddingHorizontal: 3 }]}>
                        NO. OF TIMES HALF DAY (AM/PM)
                      </Text>
                    </View>

                    {/* DATE/S HALF DAY */}
                    <View style={[styles.tableHeader2, styles.w12]}>
                      <Text style={[styles.tableHeaderText]}>DATE/S HALF DAY</Text>
                    </View>

                    {/* NO ATTENDANCE */}
                    <View style={[styles.tableHeader2, styles.w11, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>NO ATTENDANCE</Text>
                    </View>
                  </View>

                  {/* TABLE ROW */}
                  <View style={[styles.rowContainer, styles.borderTop]}>
                    {/* NO. OF TIMES LATE */}
                    <View style={[styles.tableData, styles.w11]}>
                      <Text style={[styles.tableDataText]}>{employeeDtr.summary?.noOfTimesLate ?? '-'}</Text>
                    </View>

                    {/* TOTAL MINUTES LATE */}
                    <View style={[styles.tableData, styles.w9]}>
                      <Text style={[styles.tableDataText]}>{employeeDtr.summary?.totalMinutesLate ?? '-'}</Text>
                    </View>

                    {/* DATE/S LATE */}
                    <View style={[styles.tableData, styles.w15]}>
                      <Text style={[styles.tableDataText]}>
                        {employeeDtr.summary?.lateDates && employeeDtr.summary?.lateDates.length > 0
                          ? employeeDtr.summary?.lateDates.map((day, index) => {
                              return (
                                <Text key={index}>
                                  {index === employeeDtr.summary?.lateDates.length - 1 ? (
                                    <Text>{day}</Text>
                                  ) : (
                                    <Text>{day}, </Text>
                                  )}
                                </Text>
                              );
                            })
                          : '-'}
                      </Text>
                    </View>

                    {/* NO. OF TIMES UNDERTIME */}
                    <View style={[styles.tableData, styles.w8]}>
                      <Text style={[styles.tableDataText]}>{employeeDtr.summary?.noOfTimesUndertime ?? '-'}</Text>
                    </View>

                    {/* TOTAL MINUTES UNDERTIME */}
                    <View style={[styles.tableData, styles.w9]}>
                      <Text style={[styles.tableDataText]}>{employeeDtr.summary?.totalMinutesUndertime ?? '-'}</Text>
                    </View>

                    {/* DATE/S UNDERTIME */}
                    <View style={[styles.tableData, styles.w15]}>
                      <Text style={[styles.tableDataText]}>
                        {employeeDtr.summary?.undertimeDates && employeeDtr.summary?.undertimeDates.length > 0
                          ? employeeDtr.summary?.undertimeDates.map((day, index) => {
                              return (
                                <Text key={index}>
                                  {index === employeeDtr.summary?.undertimeDates.length - 1 ? (
                                    <Text>{day}</Text>
                                  ) : (
                                    <Text>{day}, </Text>
                                  )}
                                </Text>
                              );
                            })
                          : '-'}
                      </Text>
                    </View>

                    {/* NO. OF TIMES HALF DAY (AM/PM) */}
                    <View style={[styles.tableData, styles.w10]}>
                      <Text style={[styles.tableDataText]}>{employeeDtr.summary?.noOfTimesHalfDay ?? '-'}</Text>
                    </View>

                    {/* DATE/S HALF DAY */}
                    <View style={[styles.tableData, styles.w12]}>
                      <Text style={[styles.tableDataText]}>-</Text>
                    </View>

                    {/* NO ATTENDANCE */}
                    <View style={[styles.tableData, styles.w11, { borderRight: 'none' }]}>
                      <Text style={[styles.tableDataText]}>
                        {employeeDtr.summary?.noAttendance && employeeDtr.summary?.noAttendance.length > 0
                          ? employeeDtr.summary?.noAttendance.map((day, index) => {
                              return (
                                <Text key={index}>
                                  {index === employeeDtr.summary?.noAttendance.length - 1 ? (
                                    <Text>{day}</Text>
                                  ) : (
                                    <Text>{day}, </Text>
                                  )}
                                </Text>
                              );
                            })
                          : '-'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* CERTIFY TEXT */}
                <View style={[styles.certifyContainer]}>
                  <Text style={[styles.certifyText]}>
                    I certify on my honor that the above is true and correct report of the hours of work performed
                    record of which was made daily at the time of arrival and departure from the office.
                  </Text>
                </View>

                {/* SIGNATORY */}
                <View style={[styles.rowContainer, styles.signatoryContainer]}>
                  {/* LEFT */}
                  <View style={[styles.w50]}>
                    <Text style={[{ padding: '10 0 10 0' }]}>REMARKS:</Text>

                    <Text style={[{ paddingBottom: 30 }]}>Verified by:</Text>
                    <Text
                      style={[
                        {
                          borderBottom: '1px solid #000',
                          width: '80%',
                        },
                      ]}
                    ></Text>
                    <Text style={[{ padding: '2 0 0 2' }]}>Employee&apos;s Signature</Text>
                  </View>

                  {/* RIGHT */}
                  <View style={[styles.w50]}>
                    <Text style={[{ padding: '29 0 30 0' }]}>Noted by:</Text>
                    <Text
                      style={[
                        {
                          borderBottom: '1px solid #000',
                          width: '80%',
                        },
                      ]}
                    ></Text>
                    <Text style={[{ padding: '2 0 0 2' }]}>Supervisor&apos;s/Department Manager&apos;s Signature</Text>
                  </View>
                </View>

                {/* NOTES */}
                <View style={[styles.notesContainer]}>
                  <Text style={[styles.notesText]}>
                    Incomplete time logs must be supported by an Accomplishment Report, Travel Order, Certificate of
                    Attendance, Approved Leave Application Form or Trip Ticket. Moreover, Please see Human Resource for
                    inquiry.
                  </Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default DtrPdf;
