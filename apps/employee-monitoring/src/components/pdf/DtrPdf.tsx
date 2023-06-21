/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFViewer,
  View,
  Image,
} from '@react-pdf/renderer';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import React, { FunctionComponent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

type EmployeeAssignment = {
  id: string;
  name: string;
  positionId: string;
  positionTitle: string;
};

type EmployeeData = {
  assignment: EmployeeAssignment;
  companyId: string;
  fullName: string;
  isHRMPSB: number;
  photoUrl: string;
  userId: string;
  userRole: string;
};

type DtrPdfProps = {
  employeeDtr: Array<EmployeeDtrWithSchedule>;
  employeeData: EmployeeData;
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
  },
  dtrContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: '1px solid #000000',
    marginTop: 15,
  },
  dtrContainer2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: '1px solid #000000',
    marginTop: 10,
  },

  tableTdDate: {
    width: '18%',
    height: 20,
    borderRight: '1px solid #000000',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableTdDate2: {
    width: '12%',
    height: 20,
    borderLeft: '0px solid #000000',
    borderRight: '1px solid #000000',
    borderTop: '1px solid #000000',
    fontSize: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tableTd: {
    width: '12.5%',
    height: 20,
    borderLeft: '0px solid #000000',
    borderRight: '1px solid #000000',
    borderTop: '1px solid #000000',
    fontSize: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableTdRemarks: {
    width: '20%',
    height: 20,
    borderLeft: '0px solid #000000',
    borderRight: '0px solid #000000',
    borderTop: '1px solid #000000',
    fontSize: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tableTdStats: {
    width: '15%',
    height: 35,
    borderLeft: '0px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 2,
    fontWeight: 'bold',
  },
  tableTdStats2: {
    width: '15%',
    height: 35,
    borderLeft: '0px solid #000000',
    borderRight: '0px solid #000000',
    borderBottom: '1px solid #000000',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 2,
    fontWeight: 'bold',
  },
  tableTdStats3: {
    width: '15%',
    height: 35,
    borderLeft: '0px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '0px solid #000000',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 2,
  },
  tableTdStats4: {
    width: '15%',
    height: 35,
    borderLeft: '0px solid #000000',
    borderRight: '0px solid #000000',
    borderBottom: '0px solid #000000',
    fontSize: 9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 2,
  },

  page: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    fontFamily: 'Helvetica',
  },
  employeeProfile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 9,
    paddingTop: 15,
    width: '100%',
  },
  tableHeader: {
    borderRight: '1px solid #000000',
    fontSize: 9,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    alignItems: 'stretch',
  },
  tableData: {
    borderRight: '1px solid #000000',
    fontSize: 8,
    textAlign: 'center',
    alignItems: 'center',
    textTransform: 'capitalize',
    paddingVertical: 3,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },
  logo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w100: { width: '100%' },
  w70: { width: '70%' },
  w45: { width: '45%' },
  w40: { width: '40%' },
  w37_5: { width: 'w37.5%' },
  w35: { width: '35%' },
  w30: { width: '30%' },
  w25: { width: '25%' },
  w20: { width: '20%' },
  w17_5: { width: '17.5%' },
  w15: { width: '15%' },
  w10: { width: '10%' },
  w5: { width: '5%' },
});

// type PassSlipPdfProps = {
//   employeeDetails: EmployeeDetails;
// };

export const DtrPdf: FunctionComponent<DtrPdfProps> = ({
  employeeData,
  employeeDtr,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  // Temporary states
  const [isOfficeSchedule] = useState<boolean>(true);
  const [isFieldStationSchedule] = useState<boolean>(false);

  const twelveHourFormat = (time: string | null) => {
    if (time === null || isEmpty(time)) return '';
    else return dayjs('01-01-0000' + ' ' + time).format('h:mm A');
  };

  // compare to schedule if after
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

  // comparison to schedule if late
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

  // check if date is rest day
  const checkIfRestDay = (remark: string) => {
    if (remark.includes('Rest Day')) return true;

    return false;
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
                    <Text
                      style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }}
                    >
                      GENERAL SANTOS WATER DISTRICT
                    </Text>
                    <Text style={{ fontSize: 9, paddingTop: 3 }}>
                      E. Ferdnandez St., Lagao General Santos City
                    </Text>
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
                    {/* ADD MONTH HERE */}
                    <Text style={{ fontSize: 9, paddingTop: 10 }}>
                      For the month of
                    </Text>
                  </View>

                  {/* RIGHT */}
                  <View style={[styles.w30]}>{/* ISO CODE */}</View>
                </View>

                {/* EMPLOYEE PROFILE */}
                <View style={styles.employeeProfile}>
                  <View style={[styles.rowContainer]}>
                    <Text style={[styles.w20]}>NAME</Text>
                    <Text
                      style={{
                        fontFamily: 'Helvetica-Bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {employeeData.fullName}
                    </Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text style={[styles.w20]}>DESIGNATION</Text>
                    <Text>{employeeData.assignment.positionTitle}</Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text style={[styles.w20]}>OFFICE</Text>
                    <Text>OFFICE_HERE</Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text style={[styles.w20]}>DEPARTMENT</Text>
                    <Text>DEPARTMENT_HERE</Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text style={[styles.w20]}>DIVISION</Text>
                    <Text>DIVISION_HERE</Text>
                  </View>
                </View>

                {/* DAILY TIME LOGS */}
                <View style={[styles.dtrContainer]}>
                  {/* Column Headers  */}
                  {isOfficeSchedule ? (
                    // For Office Schedule
                    <View style={[styles.rowContainer, { width: '100%' }]}>
                      <View style={[styles.tableHeader, styles.w10]}>
                        <Text>DATE</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w5]}>
                        <Text></Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w25]}>
                        <Text>REMARKS</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w15]}>
                        <Text>TIME IN</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w15]}>
                        <Text>LUNCH OUT</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w15]}>
                        <Text>LUNCH IN</Text>
                      </View>
                      <View
                        style={[
                          styles.tableHeader,
                          styles.w15,
                          { borderRight: 'none' },
                        ]}
                      >
                        <Text>TIME OUT</Text>
                      </View>
                    </View>
                  ) : null}

                  {isFieldStationSchedule ? (
                    //  For Field/Pumping Station Schedule
                    <View style={[styles.rowContainer, { width: '100%' }]}>
                      <View style={[styles.tableHeader, styles.w25]}>
                        <Text style={{ margin: 'auto 0' }}>REMARKS</Text>
                      </View>

                      {/* TIME IN */}
                      <View style={[styles.tableHeader, styles.w37_5]}>
                        <Text style={{ paddingBottom: 4 }}>TIME IN</Text>
                        <View
                          style={[
                            styles.rowContainer,
                            styles.w100,
                            styles.borderTop,
                          ]}
                        >
                          <View style={[styles.tableHeader, styles.w45]}>
                            <Text>DATE</Text>
                          </View>

                          <View style={[styles.tableHeader, styles.w10]}>
                            <Text></Text>
                          </View>

                          <View
                            style={[
                              styles.tableHeader,
                              styles.w45,
                              { borderRight: 'none' },
                            ]}
                          >
                            <Text>TIME LOG</Text>
                          </View>
                        </View>
                      </View>

                      {/* TIME OUT */}
                      <View
                        style={[
                          styles.tableHeader,
                          styles.w37_5,
                          { borderRight: 'none' },
                        ]}
                      >
                        <Text style={{ paddingBottom: 4 }}>TIME OUT</Text>
                        <View
                          style={[
                            styles.rowContainer,
                            styles.w100,
                            styles.borderTop,
                          ]}
                        >
                          <View style={[styles.tableHeader, styles.w45]}>
                            <Text>DATE</Text>
                          </View>

                          <View style={[styles.tableHeader, styles.w10]}>
                            <Text></Text>
                          </View>

                          <View
                            style={[
                              styles.tableHeader,
                              styles.w45,
                              { borderRight: 'none' },
                            ]}
                          >
                            <Text>TIME LOG</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {/* Table Rows */}
                  <View>
                    {isOfficeSchedule
                      ? employeeDtr.map((log, index) => {
                          const yellow = 'yellow';
                          const gray = '#9CA3AF';
                          const white = 'white';

                          let logBgColor = '';
                          let timeInBgColor = '';
                          let lunchOutColor = '';
                          let lunchInColor = '';
                          let timeOutColor = '';

                          // row color
                          checkIfRestDay(log.dtr.remarks) === true
                            ? (logBgColor = gray)
                            : (logBgColor = white);

                          // time in color
                          compareIfLate(
                            log.day,
                            log.dtr.timeIn,
                            log.schedule.timeIn
                          ) === true
                            ? (timeInBgColor = yellow)
                            : (timeInBgColor = '');

                          // lunch out color
                          compareIfEarly(
                            log.day,
                            log.dtr.lunchOut,
                            log.schedule.lunchOut
                          ) ||
                          compareIfLate(
                            log.day,
                            log.dtr.lunchOut,
                            log.schedule.lunchIn
                          ) === true
                            ? (lunchOutColor = yellow)
                            : (lunchOutColor = '');

                          // lunch in color
                          compareIfEarly(
                            log.day,
                            log.dtr.lunchIn,
                            log.schedule.lunchIn
                          ) ||
                          compareIfLate(
                            log.day,
                            log.dtr.lunchIn,
                            log.schedule.lunchIn,
                            29 // 12:31 lunch in + 20 = 1pm
                          ) === true
                            ? (lunchInColor = yellow)
                            : (lunchInColor = '');

                          // time out color
                          compareIfEarly(
                            log.day,
                            log.dtr.timeOut,
                            log.schedule.timeOut
                          ) === true
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
                              {/* DATE */}
                              <View style={[styles.tableData, styles.w10]}>
                                <Text>{log.day}</Text>
                              </View>

                              {/* DAY OF THE WEEK */}
                              <View style={[styles.tableData, styles.w5]}>
                                <Text>{dayjs(log.day).format('ddd')}</Text>
                              </View>

                              {/* REMARKS */}
                              <View style={[styles.tableData, styles.w25]}>
                                <Text>{log.dtr.remarks}</Text>
                              </View>

                              {/* TIME IN */}
                              <View
                                style={[
                                  styles.tableData,
                                  styles.w15,
                                  { backgroundColor: timeInBgColor },
                                ]}
                              >
                                {log.dtr.timeIn ? (
                                  <Text>
                                    {twelveHourFormat(log.dtr.timeIn)}
                                  </Text>
                                ) : checkIfRestDay(log.dtr.remarks) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={{ color: 'red' }}>No Entry</Text>
                                )}
                              </View>

                              {/* LUNCH OUT */}
                              <View
                                style={[
                                  styles.tableData,
                                  styles.w15,
                                  { backgroundColor: lunchOutColor },
                                ]}
                              >
                                {log.dtr.lunchOut ? (
                                  <Text>
                                    {twelveHourFormat(log.dtr.lunchOut)}
                                  </Text>
                                ) : checkIfRestDay(log.dtr.remarks) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={{ color: 'red' }}>No Entry</Text>
                                )}
                              </View>

                              {/* LUNCH IN */}
                              <View
                                style={[
                                  styles.tableData,
                                  styles.w15,
                                  { backgroundColor: lunchInColor },
                                ]}
                              >
                                {log.dtr.lunchIn ? (
                                  <Text>
                                    {twelveHourFormat(log.dtr.lunchIn)}
                                  </Text>
                                ) : checkIfRestDay(log.dtr.remarks) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={{ color: 'red' }}>No Entry</Text>
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
                                  <Text>
                                    {twelveHourFormat(log.dtr.timeOut)}
                                  </Text>
                                ) : checkIfRestDay(log.dtr.remarks) ? (
                                  <Text></Text>
                                ) : (
                                  <Text style={{ color: 'red' }}>No Entry</Text>
                                )}
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </View>
                </View>

                <View style={styles.dtrContainer2}>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 0,
                    }}
                  >
                    <View style={styles.tableTdStats}>
                      <Text>NO. OF TIMES LATE</Text>
                    </View>
                    <View style={styles.tableTdStats}>
                      <Text>NO. OF TIMES UNDERTIME</Text>
                    </View>
                    <View style={styles.tableTdStats}>
                      <Text>TOTAL MINUTES LATE & UNDERTIME</Text>
                    </View>
                    <View style={styles.tableTdStats}>
                      <Text>NO. OF TIMES HALF DAY (AM/PM)</Text>
                    </View>
                    <View style={styles.tableTdStats}>
                      <Text>DATE/S</Text>
                    </View>
                    <View style={styles.tableTdStats}>
                      <Text>DATE/S LATE & UNDERTIME</Text>
                    </View>
                    <View style={styles.tableTdStats2}>
                      <Text>NO ATTENDANCE</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 0,
                    }}
                  >
                    <View style={styles.tableTdStats3}>
                      <Text>5.00</Text>
                    </View>
                    <View style={styles.tableTdStats3}>
                      <Text>1.00</Text>
                    </View>
                    <View style={styles.tableTdStats3}>
                      <Text>155.00</Text>
                    </View>
                    <View style={styles.tableTdStats3}>
                      <Text>3</Text>
                    </View>
                    <View style={styles.tableTdStats3}>
                      <Text>1, 13, 22</Text>
                    </View>
                    <View style={styles.tableTdStats3}>
                      <Text>0.00</Text>
                    </View>
                    <View style={styles.tableTdStats4}>
                      <Text>0.00</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    fontSize: 10,
                    fontWeight: 200,
                    paddingBottom: 10,
                    paddingTop: 5,
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  <Text>
                    I certify on my honor that the above is true and correct
                    report of the hours of work performed record of which was
                    made daily at the time of arrival and departure from the
                    office.
                  </Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    fontSize: 10,
                  }}
                >
                  <Text style={{ width: '50%' }}>
                    Employee&apos;s Signature:
                  </Text>
                  <Text style={{ width: '50%', paddingLeft: 70 }}>
                    Noted by:
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
