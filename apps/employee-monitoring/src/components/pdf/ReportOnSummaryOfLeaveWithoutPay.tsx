/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnSummaryLeaveWithoutPay } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { UseRenderPageNumberPdf } from '../../utils/functions/RenderPageNumberPdf';

type ReportOnSummaryOfLeaveWithoutPayProps = {
  reportOnSummaryOfLeaveWithoutPayData: ReportOnSummaryLeaveWithoutPay;
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
  borderBottom: {
    borderBottom: '1px solid #000000',
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
  w16: { width: '16%' },
  w12: { width: '12%' },
  w11: { width: '11%' },
  w8: { width: '8%' },
  w6: { width: '6%' },
});

export const ReportOnSummaryOfLeaveWithoutPayPdf: FunctionComponent<ReportOnSummaryOfLeaveWithoutPayProps> = ({
  reportOnSummaryOfLeaveWithoutPayData,
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
          <Document title="Report on Summary of Leave Without Pay">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} orientation="landscape" style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]} fixed>
                  <Text style={[styles.documentTitle]}>REPORT ON SUMMARY OF LEAVE WITHOUT PAY</Text>
                  <Text style={[styles.documentTitle, styles.upperText]}>
                    {`${dayjs(router.query.month_year + '').format('MMMM YYYY')}`}
                  </Text>
                </View>

                {/* ATTENDANCE TABLE */}
                <View style={styles.reportTable}>
                  {/* COLUMN HEADERS  */}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]} fixed>
                    <View style={[styles.tableHeader, styles.w8]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Status</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w8]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Employee No.</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w16]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w11]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Leave Description</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w6]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>From</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w6]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>To</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w8]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>No. Of Days</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w12]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Remarks</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w25, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Justification</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnSummaryOfLeaveWithoutPayData.report)
                    ? reportOnSummaryOfLeaveWithoutPayData.report?.map((empLwop, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w8]}>
                              <Text style={[styles.tableDataText]}>APPROVED</Text>
                            </View>

                            <View style={[styles.tableData, styles.w8]}>
                              <Text style={[styles.tableDataText]}>{empLwop.companyId || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w16, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText]}>{empLwop.employeeName || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w11]}>
                              <Text style={[styles.tableDataText]}>LEAVE WITHOUT PAY</Text>
                            </View>

                            <View style={[styles.tableData, styles.w6]}>
                              <Text style={[styles.tableDataText]}>{empLwop.dateFrom || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w6]}>
                              <Text style={[styles.tableDataText]}>{empLwop.dateTo || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w8]}>
                              <Text style={[styles.tableDataText]}>{`${empLwop.noOfDays + ' DAY/S'}` || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w12]}>
                              <Text style={[styles.tableDataText]}>NOT YET DEDUCTED TO PAYROLL</Text>
                            </View>

                            <View style={[styles.tableData, styles.w25, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>{empLwop.justification || ''}</Text>
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
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.preparedBy.positionTitle}
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
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2, marginRight: 10 }]}>
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.reviewedBy.positionTitle}
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
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnSummaryOfLeaveWithoutPayData.signatory?.approvedBy.positionTitle}
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

export default ReportOnSummaryOfLeaveWithoutPayPdf;
