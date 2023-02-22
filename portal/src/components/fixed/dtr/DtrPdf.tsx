/* eslint-disable jsx-a11y/alt-text */
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFViewer,
  View,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

import React, { useEffect, useState } from 'react';

// import { EmployeeDetails } from '../../../types/employee.type';

export const faceScanLogs = [
  {
    id: 1,
    Date: '01-1-2023',
    Day: 'SUN',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 2,
    Date: '01-2-2023',
    Day: 'MON',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 3,
    Date: '01-3-2023',
    Day: 'TUE',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 4,
    Date: '01-4-2023',
    Day: 'WED',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 5,
    Date: '01-5-2023',
    Day: 'THU',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 6,
    Date: '01-6-2023',
    Day: 'FRI',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 7,
    Date: '01-7-2023',
    Day: 'SAT',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 8,
    Date: '01-8-2023',
    Day: 'SUN',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 9,
    Date: '01-9-2023',
    Day: 'MON',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 10,
    Date: '01-10-2023',
    Day: 'TUE',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 11,
    Date: '01-11-2023',
    Day: 'WED',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 12,
    Date: '01-12-2023',
    Day: 'THU',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 13,
    Date: '01-13-2023',
    Day: 'FRI',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 14,
    Date: '01-14-2023',
    Day: 'SAT',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 15,
    Date: '01-15-2023',
    Day: 'SUN',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 16,
    Date: '01-16-2023',
    Day: 'MON',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 17,
    Date: '01-17-2023',
    Day: 'TUE',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 18,
    Date: '01-18-2023',
    Day: 'WED',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 19,
    Date: '01-19-2023',
    Day: 'THU',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 20,
    Date: '01-20-2023',
    Day: 'FRI',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 21,
    Date: '01-21-2023',
    Day: 'SAT',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 22,
    Date: '01-22-2023',
    Day: 'SUN',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 23,
    Date: '01-23-2023',
    Day: 'MON',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 24,
    Date: '01-24-2023',
    Day: 'TUE',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 25,
    Date: '01-25-2023',
    Day: 'WED',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 26,
    Date: '01-26-2023',
    Day: 'THU',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 27,
    Date: '01-27-2023',
    Day: 'FRI',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 28,
    Date: '01-28-2023',
    Day: 'SAT',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 29,
    Date: '01-29-2023',
    Day: 'SUN',
    TimeIn: '',
    TimeOut: '',
    LunchIn: '',
    LunchOut: '',
    Schedule: 'OFF',
  },
  {
    id: 30,
    Date: '01-30-2023',
    Day: 'MON',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
  {
    id: 31,
    Date: '01-31-2023',
    Day: 'TUE',
    TimeIn: '07:30:10',
    TimeOut: '12:29:20',
    LunchIn: '12:31:54',
    LunchOut: '17:30:21',
    Schedule: '8:00AM - 5:00PM',
  },
];

const styles = StyleSheet.create({
  page: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 35,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
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
  employeeProfile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 10,
    padding: 4,
    width: '100%',
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
});

// type PassSlipPdfProps = {
//   employeeDetails: EmployeeDetails;
// };

export const DtrPdf = (): //   {
//   employeeDetails,
// }: PassSlipPdfProps
JSX.Element => {
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
                <View style={styles.header}>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>
                    GENERAL SANTOS WATER DISTRICT
                  </Text>
                  <Text>E. Ferdnandez St., Lagao General Santos City</Text>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>
                    DAILY TIME RECORD
                  </Text>
                </View>
                <View style={{ height: 10 }}></View>
                <View style={styles.dtrContainer}>
                  {/* EMPLOYEE PROFILE */}
                  <View style={styles.employeeProfile}>
                    <View
                      style={{ display: 'flex', gap: 59, flexDirection: 'row' }}
                    >
                      <Text>NAME</Text>
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                        Ricardo Vicente Narvaiza
                      </Text>
                    </View>
                    <View
                      style={{ display: 'flex', gap: 20, flexDirection: 'row' }}
                    >
                      <Text>DESIGNATION</Text>
                      <Text>Division Manager</Text>
                    </View>
                    <View
                      style={{ display: 'flex', gap: 20, flexDirection: 'row' }}
                    >
                      <Text>DEPARTMENT</Text>
                      <Text>
                        General Services, Property and Materials Management
                        Department
                      </Text>
                    </View>
                    <View
                      style={{ display: 'flex', gap: 44, flexDirection: 'row' }}
                    >
                      <Text>DIVISION</Text>
                      <Text>
                        Building and Grounds, Transportation and Water Meter
                        Maintenance Division
                      </Text>
                    </View>
                    <View
                      style={{ display: 'flex', gap: 43, flexDirection: 'row' }}
                    >
                      <Text>SECTION</Text>
                      <Text>X</Text>
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

                  {faceScanLogs.filter(
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
                  )}
                </View>
                <View style={{ height: 10 }}></View>
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
