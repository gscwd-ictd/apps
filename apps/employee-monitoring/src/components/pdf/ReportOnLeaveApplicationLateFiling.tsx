/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnLeaveApplicationLateFiling } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import { UseRenderPageNumberPdf } from '../../utils/functions/RenderPageNumberPdf';

type ReportOnLeaveApplicationLateFilingProps = {
  reportOnLeaveApplicationLateFilingDoc: ReportOnLeaveApplicationLateFiling;
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
  w26: { width: '26%' },
  w21: { width: '21%' },
  w20: { width: '20%' },
  w15: { width: '15%' },
  w3: { width: '3%' },
});

export const ReportOnLeaveApplicationLateFilingPdf: FunctionComponent<ReportOnLeaveApplicationLateFilingProps> = ({
  reportOnLeaveApplicationLateFilingDoc,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Report on Unused Pass Slip">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]} fixed>
                  <Text style={[styles.documentTitle]}>REPORT ON LEAVE APPLICATION (LATE FILING)</Text>
                  <Text style={[styles.documentTitle]}>
                    FOR THE PERIOD OF {DateFormatter(`${router.query.date_from}`, 'MMMM DD, YYYY')} -{' '}
                    {DateFormatter(`${router.query.date_to}`, 'MMMM DD, YYYY')}
                  </Text>
                </View>

                {/* ATTENDANCE TABLE */}
                <View style={styles.reportTable}>
                  {/* COLUMN HEADERS  */}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]} fixed>
                    {/* NUMBER */}
                    <View style={[styles.tableHeader, styles.w3]}></View>

                    <View style={[styles.tableHeader, styles.w20, { fontSize: 7 }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w15]}>
                      <Text style={[styles.tableHeaderText]}>Date Filing</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w15]}>
                      <Text style={[styles.tableHeaderText]}>Leave Name</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w21]}>
                      <Text style={[styles.tableHeaderText]}>Leave Dates</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w26, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>Justification</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnLeaveApplicationLateFilingDoc.report)
                    ? reportOnLeaveApplicationLateFilingDoc.report?.map((leaveApplication, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w3]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w20, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText, { textAlign: 'left' }]}>
                                {leaveApplication.name || '-'}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w15]}>
                              <Text style={[styles.tableDataText]}>{leaveApplication.dateOfFiling || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w15]}>
                              <Text style={[styles.tableDataText]}>{leaveApplication.leaveName || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w21]}>
                              <Text style={[styles.tableDataText]}>{leaveApplication.leaveDates || ''}</Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w26, { borderRight: 'none' }]}>
                              <Text style={[styles.tableHeaderText]}>{leaveApplication.justification}</Text>
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
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.preparedBy.positionTitle}
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
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2, marginRight: 10 }]}>
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.reviewedBy.positionTitle}
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
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnLeaveApplicationLateFilingDoc.signatory?.approvedBy.positionTitle}
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

export default ReportOnLeaveApplicationLateFilingPdf;
