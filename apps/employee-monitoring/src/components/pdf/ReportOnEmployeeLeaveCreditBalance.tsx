/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ReportOnEmpLeaveCreditBalance } from '../../utils/types/report.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PdfHeader } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';

type ReportOnEmployeeLeaveCreditBalanceProps = {
  reportOnEmployeeLeaveCreditBalanceData: ReportOnEmpLeaveCreditBalance;
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
  w50: { width: '50%' },
  w33_33: { width: '33.33%' },
  w24: { width: '24%' },
  w12: { width: '12%' },
  w11: { width: '11%' },
  w10: { width: '10%' },
  w5: { width: '5%' },
});

export const ReportOnEmployeeLeaveCreditBalancePdf: FunctionComponent<ReportOnEmployeeLeaveCreditBalanceProps> = ({
  reportOnEmployeeLeaveCreditBalanceData,
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
          <Document title="Report on Employee Leave Credit Balance">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]}>
                  <Text style={[styles.documentTitle]}>REPORT ON EMPLOYEE LEAVE CREDIT BALANCE</Text>
                  <Text style={[styles.documentTitle, styles.upperText]}>
                    AS OF {`${dayjs(router.query.month_year + '').format('MMMM YYYY')}`}
                  </Text>
                </View>

                {/* ATTENDANCE TABLE */}
                <View style={styles.reportTable}>
                  {/* COLUMN HEADERS  */}
                  <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}>
                    {/* NUMBER */}
                    <View style={[styles.tableHeader, styles.w5]}></View>

                    <View style={[styles.tableHeader, styles.w10]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Employee No.</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w50]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Names</Text>
                    </View>

                    <View style={[styles.tableHeader, styles.w24]}>
                      <View style={[styles.borderBottom, styles.w100]}>
                        <Text style={[styles.upperText, styles.boldText, { paddingVertical: 4 }]}>Balance</Text>
                      </View>

                      <View style={[styles.rowContainer]}>
                        <View style={[styles.tableHeader, styles.w50]}>
                          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>VL</Text>
                        </View>

                        <View style={[styles.tableHeader, styles.w50, { borderRight: 'none' }]}>
                          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>SL</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.tableHeader, styles.w11, { borderRight: 'none' }]}>
                      <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Total</Text>
                    </View>
                  </View>

                  {/* DATA */}
                  {!isEmpty(reportOnEmployeeLeaveCreditBalanceData.report)
                    ? reportOnEmployeeLeaveCreditBalanceData.report?.map((empLeaveBalDetails, index) => {
                        return (
                          <View
                            style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}
                            key={index}
                            wrap={false}
                          >
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText]}>{index + 1}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w10]}>
                              <Text style={[styles.tableDataText]}>{empLeaveBalDetails.companyId || '-'}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w50, { alignItems: 'flex-start' }]}>
                              <Text style={[styles.tableDataText]}>{empLeaveBalDetails.name || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w12]}>
                              <Text style={[styles.tableDataText]}>
                                {empLeaveBalDetails.vacationLeaveBalance || ''}
                              </Text>
                            </View>

                            <View style={[styles.tableData, styles.w12]}>
                              <Text style={[styles.tableDataText]}>{empLeaveBalDetails.sickLeaveBalance || ''}</Text>
                            </View>

                            <View style={[styles.tableData, styles.w11, { borderRight: 'none' }]}>
                              <Text style={[styles.tableDataText]}>{empLeaveBalDetails.totalLeaveBalance || ''}</Text>
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
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.preparedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.preparedBy.positionTitle}
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
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.reviewedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.reviewedBy.positionTitle}
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
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.approvedBy.name}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {reportOnEmployeeLeaveCreditBalanceData.signatory?.approvedBy.positionTitle}
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

export default ReportOnEmployeeLeaveCreditBalancePdf;
