/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnEmployeeTardiness } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import { UseRenderPageNumberPdf } from '../../utils/functions/RenderPageNumberPdf';

type ReportOnEmployeeTardinessPdfProps = {
  reportOnEmployeeTardinessData: ReportOnEmployeeTardiness;
};

const styles = StyleSheet.create({
  w22: { width: '22%' },
  w9: { width: '9%' },
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
  w25: { width: '25%' },
  w14: { width: '14%' },
  w13: { width: '13%' },
  w10: { width: '10%' },
  w7: { width: '7%' },
  w3: { width: '3%' },
});

export const ReportOnEmployeeTardinessPdf: FunctionComponent<ReportOnEmployeeTardinessPdfProps> = ({
  reportOnEmployeeTardinessData,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  const rows = reportOnEmployeeTardinessData?.report ?? [];
  const totalMinutes = rows.reduce((sum, row) => sum + Number(row.minutesLate ?? 0), 0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Report on Employee Tardiness">
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                <PdfHeader isFixed={true} />

                <View style={[styles.w100, styles.horizontalCenter]} fixed>
                  <Text style={[styles.documentTitle]}>REPORT ON EMPLOYEE TARDINESS</Text>
                  <Text style={[styles.documentTitle]}>
                    FOR THE PERIOD OF {DateFormatter(`${router.query.date_from}`, 'MMMM DD, YYYY')} -{' '}
                    {DateFormatter(`${router.query.date_to}`, 'MMMM DD, YYYY')}
                  </Text>
                  {router.query.org_name ? (
                    <Text style={[styles.documentTitle, styles.upperText]}>{`${router.query.org_name}`}</Text>
                  ) : null}
                </View>

                <View style={styles.reportTable}>
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]} fixed>
                    <View style={[styles.tableHeader, styles.w3]}>
                      <Text style={[styles.tableHeaderText]}></Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w22]}>
                      <Text style={[styles.tableHeaderText]}>Names</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText]}>Date</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w9]}>
                      <Text style={[styles.tableHeaderText]}>Schedule Time In</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w9]}>
                      <Text style={[styles.tableHeaderText]}>Time In</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w9]}>
                      <Text style={[styles.tableHeaderText]}>Lunch Out</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w9]}>
                      <Text style={[styles.tableHeaderText]}>Lunch In</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w9]}>
                      <Text style={[styles.tableHeaderText]}>Time Out</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText]}>Minutes Late</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>Conversion (leave credits)</Text>
                    </View>
                  </View>

                  {!isEmpty(rows)
                    ? rows.map((row, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w3]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w22, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText, { textAlign: 'left' }]}>
                                {index === 0 || rows[index - 1].employeeId !== row.employeeId ? row.name : ''}
                              </Text>
                            </View>
                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{DateFormatter(row.dtrDate, 'MM/DD/YYYY')}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w9]}>
                              <Text style={[styles.tableDataText]}>{row.scheduleTimeIn ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w9]}>
                              <Text style={[styles.tableDataText]}>{row.timeIn ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w9]}>
                              <Text style={[styles.tableDataText]}>{row.lunchOut ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w9]}>
                              <Text style={[styles.tableDataText]}>{row.lunchIn ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w9]}>
                              <Text style={[styles.tableDataText]}>{row.timeOut ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{row.minutesLate ?? ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w10, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>{row.conversion ?? ''}</Text>
                            </View>
                          </View>
                        );
                      })
                    : null}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]} wrap={false}>
                    <View style={[styles.tableData, { width: '80%' }, { alignItems: 'flex-end' }]}>
                      <Text style={[styles.tableDataText, styles.boldText]}>TOTAL ({rows.length} lates)</Text>
                    </View>
                    <View style={[styles.tableData, styles.w10]}>
                      <Text style={[styles.tableDataText, styles.boldText]}>{totalMinutes}</Text>
                    </View>
                    <View style={[styles.tableData, styles.w10, { borderRight: 'none' }]}>
                      <Text style={[styles.tableDataText, styles.boldText]}>
                        {rows.reduce((sum, row) => sum + Number(row.conversion ?? 0), 0).toFixed(3)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* SIGNATORY */}
                <View style={[styles.rowContainer, styles.signatoryContainer]} wrap={false}>
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
                      {reportOnEmployeeTardinessData.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnEmployeeTardinessData.signatory?.preparedBy.positionTitle}
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
                      {reportOnEmployeeTardinessData.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2, marginRight: 10 }]}>
                      {reportOnEmployeeTardinessData.signatory?.reviewedBy.positionTitle}
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
                      {reportOnEmployeeTardinessData.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnEmployeeTardinessData.signatory?.approvedBy.positionTitle}
                    </Text>
                  </View>
                </View>

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

export default ReportOnEmployeeTardinessPdf;
