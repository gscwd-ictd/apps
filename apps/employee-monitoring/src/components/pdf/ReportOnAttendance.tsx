/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnAttendance } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';

type ReportOnAttendancePdfProps = {
  reportOnAttendanceData: ReportOnAttendance;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: 'Helvetica',
  },
  documentTitle: {
    fontSize: 9,
    paddingTop: 3,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  reportTable: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 7,
    paddingTop: 10,
    width: '100%',
  },
  tableHeader: {
    borderRight: '1px solid #000000',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    fontSize: 6.5,
  },
  tableHeaderText: {
    paddingVertical: 3,
    margin: 'auto 0',
  },
  tableData: {
    borderRight: '1px solid #000000',
    fontSize: 7,
    textAlign: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  tableDataText: {
    paddingVertical: 3,
    margin: 'auto 0',
    textTransform: 'uppercase',
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
  rowBorder: {
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
  },

  upperText: {
    textTransform: 'uppercase',
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w100: { width: '100%' },
  w33_33: { width: '33.33%' },
  w25: { width: '25%' },
  w14: { width: '14%' },
  w13: { width: '13%' },
  w10: { width: '10%' },
  w7: { width: '7%' },
  w3: { width: '3%' },
});

export const ReportOnAttendancePdf: FunctionComponent<ReportOnAttendancePdfProps> = ({ reportOnAttendanceData }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Report On Attendance">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]}>
                  <Text style={[styles.documentTitle]}>REPORT ON ATTENDANCE</Text>
                  <Text style={[styles.documentTitle]}>(Tardiness, Undertime and Half-day)</Text>
                  <Text style={[styles.documentTitle]}>
                    FOR THE PERIOD OF {DateFormatter(`${router.query.date_from}`, 'MMMM DD, YYYY')} -{' '}
                    {DateFormatter(`${router.query.date_to}`, 'MMMM DD, YYYY')}
                  </Text>
                </View>

                {/* ATTENDANCE TABLE */}
                <View style={styles.reportTable}>
                  {/* COLUMN HEADERS  */}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}>
                    {/* NUMBER */}
                    <View style={[styles.tableHeader, styles.w3]}></View>
                    <View style={[styles.tableHeader, styles.w25, { fontSize: 7 }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7]}>
                      <Text style={[styles.tableHeaderText]}>No. of times Late</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7]}>
                      <Text style={[styles.tableHeaderText]}>No. of times Undertime</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7]}>
                      <Text style={[styles.tableHeaderText]}>Total Minutes Late</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText]}>Conversion (mins / 60) x .125</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7]}>
                      <Text style={[styles.tableHeaderText]}>No. of times Half day</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w13]}>
                      <Text style={[styles.tableHeaderText]}>Date/s (Half day)</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w14]}>
                      <Text style={[styles.tableHeaderText]}>Date/s (Late & Undertime)</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>No Attendance</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnAttendanceData.report)
                    ? reportOnAttendanceData.report?.map((attendanceData, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w3]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w25, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText, { textAlign: 'left' }]}>
                                {attendanceData.name || '-'}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w7]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.numberOfTimesLate || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w7]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.numberOfTimesUndertime || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w7]}>
                              <Text style={[styles.tableDataText]}>
                                {attendanceData.totalMinutesLateUndertime || ''}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.conversion || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w7]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.numberOfTimesHalfDay || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w13]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.daysHalfDay || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w14]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.datesLate || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w7, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>{attendanceData.noAttendance || ''}</Text>
                            </View>
                          </View>
                        );
                      })
                    : null}
                </View>

                {/* SIGNATORY */}
                <View style={[styles.rowContainer, styles.signatoryContainer]}>
                  {/* LEFT */}
                  <View style={[styles.w33_33]}>
                    <Text style={[{ padding: '29 0 30 0' }]}>Prepared by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnAttendanceData.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnAttendanceData.signatory?.preparedBy.positionTitle}
                    </Text>
                  </View>

                  {/* CENTER */}
                  <View style={[styles.w33_33]}>
                    <Text style={[{ padding: '29 0 30 0' }]}>Checked by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnAttendanceData.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnAttendanceData.signatory?.reviewedBy.positionTitle}
                    </Text>
                  </View>

                  {/* RIGHT */}
                  <View style={[styles.w33_33]}>
                    <Text style={[{ padding: '29 0 30 0' }]}>Noted by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnAttendanceData.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnAttendanceData.signatory?.approvedBy.positionTitle}
                    </Text>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default ReportOnAttendancePdf;
