/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnUnusedPassSlip } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';

type ReportOnUnusedPassSlipProps = {
  reportOnUnusedPassSlipDoc: ReportOnUnusedPassSlip;
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
  w20: { width: '20%' },
  w18_75: { width: '18.75%' },
  w16_25: { width: '16.25%' },
  w14: { width: '14%' },
  w3: { width: '3%' },
});

export const ReportOnUnusedPassSlipPdf: FunctionComponent<ReportOnUnusedPassSlipProps> = ({
  reportOnUnusedPassSlipDoc,
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
                <View style={[styles.w100, styles.horizontalCenter]}>
                  <Text style={[styles.documentTitle]}>REPORT ON UNUSED PASS SLIP</Text>
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

                    <View style={[styles.tableHeader, styles.w20, { fontSize: 7 }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w14]}>
                      <Text style={[styles.tableHeaderText]}>Date Applied</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w16_25]}>
                      <Text style={[styles.tableHeaderText]}>Approved By</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w14]}>
                      <Text style={[styles.tableHeaderText]}>Date Approved</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w14]}>
                      <Text style={[styles.tableHeaderText]}>Nature of Business</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w18_75, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>Purpose</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnUnusedPassSlipDoc.report)
                    ? reportOnUnusedPassSlipDoc.report?.map((uuPassSlipData, index) => {
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
                                {uuPassSlipData.name || '-'}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w14]}>
                              <Text style={[styles.tableDataText]}>
                                {dayjs(uuPassSlipData.dateApplied).format('MM/DD/YYYY hh:mm A') || ''}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w16_25]}>
                              <Text style={[styles.tableDataText]}>{uuPassSlipData.approvedBy || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w14]}>
                              <Text style={[styles.tableDataText]}>
                                {dayjs(uuPassSlipData.dateApproved).format('MM/DD/YYYY hh:mm A') || ''}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w14]}>
                              <Text style={[styles.tableDataText]}>{uuPassSlipData.natureOfBusiness || ''}</Text>
                            </View>

                            <View style={[styles.tableHeader, styles.w18_75, { borderRight: 'none' }]}>
                              <Text style={[styles.tableHeaderText]}>{uuPassSlipData.purpose}</Text>
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
                      {reportOnUnusedPassSlipDoc.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnUnusedPassSlipDoc.signatory?.preparedBy.positionTitle}
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
                      {reportOnUnusedPassSlipDoc.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnUnusedPassSlipDoc.signatory?.reviewedBy.positionTitle}
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
                      {reportOnUnusedPassSlipDoc.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnUnusedPassSlipDoc.signatory?.approvedBy.positionTitle}
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

export default ReportOnUnusedPassSlipPdf;
