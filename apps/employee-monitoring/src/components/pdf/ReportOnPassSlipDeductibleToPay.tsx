/* eslint-disable @nx/enforce-module-boundaries */
import { Page, Text, Document, StyleSheet, PDFViewer, View } from '@react-pdf/renderer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ReportOnPassSlipDeductibleToPay,
  EmployeeReportOnPassSlipDeductibleToPay,
} from '../../utils/types/report.type';
import { PdfHeader } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';

type ReportOnPassSlipDeductibleToPayProps = {
  ReportOnPassSlipDeductibleToPayData: ReportOnPassSlipDeductibleToPay;
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
  w38: { width: '38%' },
  w33_33: { width: '33.33%' },
  w25: { width: '25%' },
  w15: { width: '15%' },
  w12: { width: '12%' },
  w11: { width: '11%' },
  w10: { width: '10%' },
  w5: { width: '5%' },
});

export const ReportOnPassSlipDeductibleToPayPdf: FunctionComponent<ReportOnPassSlipDeductibleToPayProps> = ({
  ReportOnPassSlipDeductibleToPayData,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderTableHeaders = () => {
    return (
      <View style={[styles.rowContainer, styles.borderTop, styles.rowBorder]}>
        <View style={[styles.tableHeader, styles.w5]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>No.</Text>
        </View>

        <View style={[styles.tableHeader, styles.w25]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Employee Name</Text>
        </View>

        <View style={[styles.tableHeader, styles.w10]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Pass Slip Date</Text>
        </View>

        <View style={[styles.tableHeader, styles.w10]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Time In / Time Out</Text>
        </View>

        <View style={[styles.tableHeader, styles.w10]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>No. of Hours</Text>
        </View>

        <View style={[styles.tableHeader, styles.w15]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Salary Deduction Computation</Text>
        </View>

        <View style={[styles.tableHeader, styles.w25]}>
          <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>Remarks</Text>
        </View>
      </View>
    );
  };

  const renderTableData = (data: Array<EmployeeReportOnPassSlipDeductibleToPay>, type: string) => {
    return (
      <View style={[{ marginBottom: 10 }]}>
        <Text style={[styles.tableHeaderText, styles.upperText, styles.boldText]}>{type}</Text>

        {data.length > 0 ? (
          data.map((report, index) => (
            <>
              {renderTableHeaders()}
              <View style={[styles.rowContainer, styles.rowBorder]} key={index} wrap={false}>
                <View style={[styles.tableData, styles.w5]}>
                  <Text style={[styles.tableDataText]}>{index + 1 || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w25]}>
                  <Text style={[styles.tableDataText]}>{report.fullName || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w10]}>
                  <Text style={[styles.tableDataText]}>{report.dateOfApplication || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w10]}>
                  <Text style={[styles.tableDataText]}>{report.timeInTimeOut || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w10]}>
                  <Text style={[styles.tableDataText]}>{report.numberOfHours || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w15]}>
                  <Text style={[styles.tableDataText]}>{report.salaryDeductionComputation || ''}</Text>
                </View>
                <View style={[styles.tableData, styles.w25]}>
                  <Text style={[styles.tableDataText]}>{report.remarks || ''}</Text>
                </View>
              </View>
            </>
          ))
        ) : (
          <View style={[styles.rowContainer]} wrap={false}>
            <View style={[styles.w100, { textAlign: 'center', alignItems: 'center', paddingHorizontal: 2 }]}>
              <Text style={[styles.tableDataText, styles.boldText, { fontSize: 8.5, color: 'gray' }]}>
                NO DATA FOUND
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
          <Document title="Report on Pass Slip Deductible to Pay">
            {/* FOLIO */}
            <Page size={[612.0, 936.0]} orientation="landscape" style={styles.page}>
              <View>
                {/* HEADER */}
                <PdfHeader isFixed={true} />

                {/* DOCUMENT TITLE */}
                <View style={[styles.w100, styles.horizontalCenter]}>
                  <Text style={[styles.documentTitle]}>REPORT ON PASS SLIP DEDUCTIBLE TO PAY</Text>
                  <Text style={[styles.documentTitle, styles.upperText]}>
                    {`${dayjs(router.query.month_year + '').format('MMMM YYYY')}`}
                  </Text>
                </View>

                {/* ATTENDANCE TABLE */}
                <View>
                  <View style={styles.reportTable}>
                    {renderTableData(ReportOnPassSlipDeductibleToPayData.report?.jo || [], 'JOB ORDER')}
                    {renderTableData(ReportOnPassSlipDeductibleToPayData.report?.casual || [], 'CASUAL')}
                    {renderTableData(ReportOnPassSlipDeductibleToPayData.report?.permanent || [], 'PERMANENT')}
                  </View>
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
                      {ReportOnPassSlipDeductibleToPayData.signatory?.preparedBy.name || 'N/A'}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {ReportOnPassSlipDeductibleToPayData.signatory?.preparedBy.positionTitle || 'Position / Title'}
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
                      {ReportOnPassSlipDeductibleToPayData.signatory?.reviewedBy.name || 'N/A'}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {ReportOnPassSlipDeductibleToPayData.signatory?.reviewedBy.positionTitle || 'Position / Title'}
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
                      {ReportOnPassSlipDeductibleToPayData.signatory?.approvedBy.name || 'N/A'}
                    </Text>
                    <Text style={[{ paddingTop: 2 }]}>
                      {ReportOnPassSlipDeductibleToPayData.signatory?.approvedBy.positionTitle || 'Position / Title'}
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

export default ReportOnPassSlipDeductibleToPayPdf;
