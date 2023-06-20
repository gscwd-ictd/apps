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

type DtrPdfProps = {
  employeeDtr: Array<EmployeeDtrWithSchedule>;
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
    paddingTop: 5,
    paddingBottom: 0,
  },

  tableTdDate: {
    width: '18%',
    height: 20,
    borderLeft: '0px solid #000000',
    borderRight: '1px solid #000000',
    borderTop: '1px solid #000000',
    fontSize: 10,
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
  tableTdDay: {
    width: '6%',
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
  dtrContainer2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: '1px solid #000000',
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
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
  w40: { width: '40%' },
  w30: { width: '30%' },
});

// type PassSlipPdfProps = {
//   employeeDetails: EmployeeDetails;
// };

export const DtrPdf: FunctionComponent<DtrPdfProps> = ({ employeeDtr }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

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
                    <Text>NAME</Text>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                      Ricardo Vicente Narvaiza
                    </Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text>DESIGNATION</Text>
                    <Text>Division Manager</Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text>DEPARTMENT</Text>
                    <Text>
                      General Services, Property and Materials Management
                      Department
                    </Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text>DIVISION</Text>
                    <Text>
                      Building and Grounds, Transportation and Water Meter
                      Maintenance Division
                    </Text>
                  </View>

                  <View style={[styles.rowContainer]}>
                    <Text>SECTION</Text>
                    <Text>X</Text>
                  </View>
                </View>

                <View style={styles.dtrContainer}>
                  {/* Column Headers */}
                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 0,
                    }}
                  >
                    <View style={styles.tableTdDate}>
                      <Text>DATE</Text>
                    </View>
                    <View style={styles.tableTdDate}>
                      <Text></Text>
                    </View>
                    <View style={styles.tableTd}>
                      <Text>TIME IN</Text>
                    </View>
                    <View style={styles.tableTd}>
                      <Text>LUNCH OUT</Text>
                    </View>
                    <View style={styles.tableTd}>
                      <Text>LUNCH IN</Text>
                    </View>
                    <View style={styles.tableTd}>
                      <Text>TIME OUT</Text>
                    </View>
                    <View style={styles.tableTdRemarks}>
                      <Text>REMARKS</Text>
                    </View>
                  </View>

                  {/* Table Rows */}
                  <View>
                    <Text style={[{ fontSize: 8 }]}>
                      {JSON.stringify(employeeDtr)}
                    </Text>
                  </View>
                  {/* {faceScanLogs.filter(
                    (filterLogs) =>
                      format(new Date(filterLogs.Date), 'MM-yyyy') ===
                      format(new Date('1-1-2023'), 'MM-yyyy')
                  ).length > 0 ? (
                    faceScanLogs
                      .filter(
                        (filterLogs) =>
                          format(new Date(filterLogs.Date), 'MM-yyyy') ===
                          format(new Date('1-1-2023'), 'MM-yyyy')
                      )
                      .map((logs) => {
                        return (
                          <View
                            key={logs.id}
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 0,
                            }}
                          >
                            <View style={styles.tableTdDate2}>
                              <Text>{logs.Date}</Text>
                            </View>
                            <View style={styles.tableTdDay}>
                              <Text>{logs.Day}</Text>
                            </View>
                            <View style={styles.tableTdDate}>
                              <Text></Text>
                            </View>
                            <View style={styles.tableTd}>
                              <Text>{logs.TimeIn}</Text>
                            </View>
                            <View style={styles.tableTd}>
                              <Text>{logs.LunchOut}</Text>
                            </View>
                            <View style={styles.tableTd}>
                              <Text>{logs.LunchIn}</Text>
                            </View>
                            <View style={styles.tableTd}>
                              <Text>{logs.TimeOut}</Text>
                            </View>
                            <View style={styles.tableTdRemarks}>
                              <Text> {logs.Schedule}</Text>
                            </View>
                          </View>
                        );
                      })
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0,
                      }}
                    ></View>
                  )} */}
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
