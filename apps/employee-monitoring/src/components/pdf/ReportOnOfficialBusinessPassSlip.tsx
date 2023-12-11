/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnOfficialBusinessPassSlip } from '../../utils/types/report.type';
import Header from './Header';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ReportOnOfficialBusinessPassSlipProps = {
  reportOnOfficialBusinessPassSlipData: ReportOnOfficialBusinessPassSlip;
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
  w30: { width: '30%' },
  w23: { width: '23%' },
  w17: { width: '17%' },
  w15: { width: '15%' },
  w13: { width: '13%' },
  w10: { width: '10%' },
  w7: { width: '7%' },
  w5: { width: '5%' },
});

export const ReportOnOfficialBusinessPassSlipPdf: FunctionComponent<ReportOnOfficialBusinessPassSlipProps> = ({
  reportOnOfficialBusinessPassSlipData,
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
          <Document title="Report On Attendance">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                {/* HEADER */}
                <Header withIsoCode={false} withIsoLogo={false} isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]}>
                  <Text style={[styles.documentTitle]}>REPORT ON OFFICIAL BUSINESS PASS SLIP</Text>
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
                    <View style={[styles.tableHeader, styles.w5]}></View>
                    <View style={[styles.tableHeader, styles.w30, { fontSize: 7 }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText]}>No. of times PB</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w23]}>
                      <Text style={[styles.tableHeaderText]}>Date/s</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w15]}>
                      <Text style={[styles.tableHeaderText]}>Total Minutes</Text>
                    </View>
                    <View style={[styles.tableHeader, styles.w17, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText]}>Conversion (mins / 60) x .125</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnOfficialBusinessPassSlipData.report)
                    ? reportOnOfficialBusinessPassSlipData.report?.map((pbPassSlipData, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w30, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText, { textAlign: 'left' }]}>
                                {pbPassSlipData.name || '-'}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{pbPassSlipData.noOfTimes || ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w23]}>
                              <Text style={[styles.tableDataText]}>{pbPassSlipData.dates || ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w15]}>
                              <Text style={[styles.tableDataText]}>{pbPassSlipData.totalMinutes || ''}</Text>
                            </View>
                            <View style={[styles.tableData, styles.w17, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>{pbPassSlipData.conversion || ''}</Text>
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
                      {reportOnOfficialBusinessPassSlipData.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnOfficialBusinessPassSlipData.signatory?.preparedBy.positionTitle}
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
                      {reportOnOfficialBusinessPassSlipData.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnOfficialBusinessPassSlipData.signatory?.reviewedBy.positionTitle}
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
                      {reportOnOfficialBusinessPassSlipData.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnOfficialBusinessPassSlipData.signatory?.approvedBy.positionTitle}
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

export default ReportOnOfficialBusinessPassSlipPdf;
