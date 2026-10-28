/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnWellnessPass } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import { UseRenderPageNumberPdf } from '../../utils/functions/RenderPageNumberPdf';
import { WellnessPassPeriods } from '../../utils/constants/reports.const';

type ReportOnWellnessPassProps = {
  reportOnWellnessPassDoc: ReportOnWellnessPass;
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
  pageNumberText: {
    fontSize: 8,
    paddingTop: 1,
    fontFamily: 'Helvetica',
    textAlign: 'center',
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
  w30: { width: '30%' },
  w23: { width: '23%' },
  w17: { width: '17%' },
  w16_25: { width: '16.25%' },
  w15: { width: '15%' },
  w13: { width: '13%' },
  w10: { width: '10%' },
  w7: { width: '7%' },
  w5: { width: '5%' },
});

export const ReportOnWellnessPassPdf: FunctionComponent<ReportOnWellnessPassProps> = ({ reportOnWellnessPassDoc }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const periodLabel = WellnessPassPeriods.find((p) => p.value === router.query.period)?.label ?? 'All Year';

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Report on Wellness Pass">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]} fixed>
                  <Text style={[styles.documentTitle]}>REPORT ON WELLNESS PASS</Text>
                  <Text style={[styles.documentTitle, styles.upperText]}>
                    {periodLabel} {router.query.year} ({DateFormatter(`${router.query.date_from}`, 'MMMM DD, YYYY')} -{' '}
                    {DateFormatter(`${router.query.date_to}`, 'MMMM DD, YYYY')})
                  </Text>
                </View>

                {/* TABLE */}
                <View style={styles.reportTable}>
                  {/* COLUMN HEADERS */}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]} fixed>
                    <View style={[styles.tableHeader, styles.w5]}></View>
                    <View style={[styles.tableHeader, { width: '25%' }, { fontSize: 7 }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w7]}>
                      <Text style={[styles.tableHeaderText]}>No. of Times</Text>
                    </View>
                    <View style={[styles.tableHeader, { width: '38%' }]}>
                      <Text style={[styles.tableHeaderText]}>Wellness Date (Time Out - Time In) Hours</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText]}>Accumulated Hours</Text>
                    </View>
                    <View style={[styles.tableHeader, { width: '15%' }, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>Excess over 4 hrs / quarter (charged to leave)</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnWellnessPassDoc.report)
                    ? reportOnWellnessPassDoc.report?.map((employee, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>
                            <View style={[styles.tableData, { width: '25%' }, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText, { textAlign: 'left' }]}>{employee.name || '-'}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w7]}>
                              <Text style={[styles.tableDataText]}>{employee.noOfTimes}</Text>
                            </View>
                            <View style={[styles.tableData, { width: '38%' }, { alignItems: 'flex-start' }]}>
                              {employee.wellnessDates?.map((wellnessDate, i) => (
                                <Text key={i} style={[styles.tableDataText, { textAlign: 'left', paddingVertical: 1 }]}>
                                  {DateFormatter(wellnessDate.date, 'MM/DD/YYYY')} ({wellnessDate.timeOutIn}){' '}
                                  {wellnessDate.hours} hrs
                                </Text>
                              ))}
                            </View>
                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{employee.accumulatedHours}</Text>
                            </View>
                            <View style={[styles.tableData, { width: '15%' }, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>
                                {employee.excessMinutes > 0
                                  ? `${employee.excessMinutes} mins (${employee.chargedToLeave})`
                                  : '-'}
                              </Text>
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
                    <Text style={[{ padding: '22 0 30 0' }]}>Prepared by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnWellnessPassDoc.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnWellnessPassDoc.signatory?.preparedBy.positionTitle}
                    </Text>
                  </View>

                  {/* CENTER */}
                  <View style={[styles.w33_33]}>
                    <Text style={[{ padding: '22 0 30 0' }]}>Checked by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnWellnessPassDoc.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2, marginRight: 10 }]}>
                      {reportOnWellnessPassDoc.signatory?.reviewedBy.positionTitle}
                    </Text>
                  </View>

                  {/* RIGHT */}
                  <View style={[styles.w33_33]}>
                    <Text style={[{ padding: '22 0 30 0' }]}>Noted by:</Text>
                    <Text
                      style={[
                        {
                          width: '80%',
                          fontFamily: 'Helvetica-Bold',
                        },
                      ]}
                    >
                      {reportOnWellnessPassDoc.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnWellnessPassDoc.signatory?.approvedBy.positionTitle}
                    </Text>
                  </View>
                </View>

                {/* PAGE NUMBERING */}
                <View style={[styles.horizontalCenter]} fixed>
                  <Text
                    style={[styles.pageNumberText]}
                    render={({ pageNumber, totalPages }) => UseRenderPageNumberPdf(pageNumber, totalPages)}
                  />
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default ReportOnWellnessPassPdf;
