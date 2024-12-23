/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { PdfHeader } from '@gscwd-apps/oneui';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import { OvertimeSummary, OvertimeSummaryEmployee } from 'libs/utils/src/lib/types/overtime.type';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    marginLeft: 20,
    marginRight: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  controlNumber: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    fontSize: 8,
  },

  pdfTitle: {
    fontSize: 10,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 1,
  },

  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 0,
    flexDirection: 'row',
  },
  tableCol: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tableCell: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: 7,
    width: 'auto',
  },

  tableCol2: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 2,
  },

  tableCol2_last: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },

  tableCol_dates: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    padding: 1,
  },
  tableCol_dates_main: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 0,
  },

  tableCell_dates: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: 8,
    width: 10,
    padding: 1,
  },
});

type PdfProps = {
  overtimeSummaryReport: OvertimeSummary;
  selectedMonth: number;
  selectedPeriod: string;
  selectedEmployeeType: string;
};

export const OvertimeSummaryReportPdf = ({
  selectedMonth,
  selectedPeriod,
  selectedEmployeeType,
  overtimeSummaryReport,
}: PdfProps): JSX.Element => {
  return (
    <>
      {/* <PDFViewer width={'100%'} height={1000} showToolbar> */}
      <Document title="Overtime Accomplishment Report Summary">
        <Page
          size={'FOLIO'}
          orientation="landscape"
          style={{
            paddingBottom: 25,
            paddingTop: 25,
          }}
        >
          <View style={styles.page}>
            <View style={styles.controlNumber}>{/* <Text>NO. 1</Text> */}</View>
            <PdfHeader />
            <Text style={styles.pdfTitle}>{overtimeSummaryReport.assignedTo}</Text>
            <Text style={styles.pdfTitle}>OVERTIME SUMMARY FOR {selectedEmployeeType?.toUpperCase()} EMPLOYEES</Text>
            <Text style={[styles.pdfTitle, { paddingBottom: 10 }]}>
              PERIOD COVERED:{' '}
              <Text style={[styles.pdfTitle, { paddingLeft: 3, paddingRight: 3, textDecoration: 'underline' }]}>
                {overtimeSummaryReport.periodCovered}
              </Text>
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: 20 }]}>
                  <Text style={styles.tableCell}>NO.</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={{ margin: 'auto', textAlign: 'center', fontSize: 8, width: 134 }}>NAME</Text>
                </View>

                <View style={[styles.tableCol, { width: 52 }]}>
                  <Text style={styles.tableCell}>
                    MONTHLY {'\n'} BASIC {'\n'} SALARY
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>RATE PER HOUR (A)</Text>
                </View>

                <View style={styles.tableCol_dates_main}>
                  <View style={[styles.tableCol_dates, { height: 30 }]}>
                    <Text style={[styles.tableCell, { paddingTop: 2, paddingBottom: 2, fontSize: 14 }]}>
                      {dayjs(selectedMonth).format('MMMM')}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '1' : '16'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '2' : '17'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '3' : '18'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '4' : '19'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '5' : '20'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '6' : '21'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '7' : '22'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '8' : '23'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '9' : '24'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '10' : '25'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '11' : '26'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '12' : '27'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '13' : '28'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '14' : '29'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '15' : '30'}</Text>
                    </View>
                    <View style={[styles.tableCol_dates, { height: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '' : '31'}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCol, { width: 35 }]}>
                  <Text style={styles.tableCell}>TOTAL NO. OT HOURS</Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>TOTAL REGULAR HOURS OT (B)</Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>
                    AMOUNT (A X B{selectedEmployeeType !== 'job order' ? ' X 1.25' : ''})
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 50 }]}>
                  <Text style={styles.tableCell}>TOTAL HOLIDAY / DAY-OFF OT HOURS (C)</Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>
                    AMOUNT (A X C{selectedEmployeeType !== 'job order' ? ' X 1.5' : ''})
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: 45 }]}>
                  <Text style={styles.tableCell}>SUBSTITUTE DUTY OT HOURS (D)</Text>
                </View>
                <View style={[styles.tableCol, { width: 45 }]}>
                  <Text style={styles.tableCell}>
                    SUBSTITUTE AMOUNT (A X D{selectedEmployeeType !== 'job order' ? 'X 1.25' : ''})
                  </Text>
                </View>

                <View style={styles.tableCol_dates_main}>
                  <View style={styles.tableCol_dates}>
                    <Text style={[styles.tableCell, { paddingTop: 2, paddingBottom: 2, width: '80' }]}>
                      NIGHT DIFFERENTIAL
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          borderBottomWidth: 0,
                          width: 40,
                          height: 35,
                          textAlign: 'center',
                        },
                      ]}
                    >
                      <Text style={[styles.tableCell, { padding: 1 }]}>NO. OF HOURS</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        {
                          borderBottomWidth: 0,
                          borderRightWidth: 0,
                          height: 35,
                          width: 40,
                        },
                      ]}
                    >
                      <Text style={[styles.tableCell, { padding: 1 }]}>AMOUNT</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCol, { width: 60 }]}>
                  <Text style={styles.tableCell}>TOTAL OVERTIME AMOUNT</Text>
                </View>
              </View>
              {/* EMPLOYEE DETAILS */}
              {overtimeSummaryReport?.summary?.length > 0 &&
                overtimeSummaryReport?.summary?.map((overtime: OvertimeSummaryEmployee, idx: number) => (
                  <View style={[styles.tableRow, { borderTop: '1px solid #000' }]} key={idx} wrap={false}>
                    <View style={[styles.tableCol, { width: 20 }]}>
                      <Text style={styles.tableCell}>{idx + 1}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 134 }}>
                        {overtime?.employeeFullName}
                      </Text>
                    </View>

                    <View style={[styles.tableCol, { width: 52 }]}>
                      <Text style={styles.tableCell}>{overtime?.monthlyRate?.toLocaleString()}</Text>
                    </View>

                    <View style={[styles.tableCol, { width: 40 }]}>
                      <Text style={styles.tableCell}>{overtime?.hourlyRate?.toLocaleString()}</Text>
                    </View>

                    <View style={styles.tableCol_dates_main}>
                      <View style={styles.tableRow}>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[0]?.hoursRendered >= 0 &&
                                overtime?.overtimes[0]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[0]?.hoursRendered > 0 ? overtime?.overtimes[0]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[1]?.hoursRendered >= 0 &&
                                overtime?.overtimes[1]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[1]?.hoursRendered > 0 ? overtime?.overtimes[1]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[2]?.hoursRendered >= 0 &&
                                overtime?.overtimes[2]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[2]?.hoursRendered > 0 ? overtime?.overtimes[2]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[3]?.hoursRendered >= 0 &&
                                overtime?.overtimes[3]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[3]?.hoursRendered > 0 ? overtime?.overtimes[3]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[4]?.hoursRendered >= 0 &&
                                overtime?.overtimes[4]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[4]?.hoursRendered > 0 ? overtime?.overtimes[4]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[5]?.hoursRendered >= 0 &&
                                overtime?.overtimes[5]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[5]?.hoursRendered > 0 ? overtime?.overtimes[5]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[6]?.hoursRendered >= 0 &&
                                overtime?.overtimes[6]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[6]?.hoursRendered > 0 ? overtime?.overtimes[6]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[7]?.hoursRendered >= 0 &&
                                overtime?.overtimes[7]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[7]?.hoursRendered > 0 ? overtime?.overtimes[7]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[8]?.hoursRendered >= 0 &&
                                overtime?.overtimes[8]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[8]?.hoursRendered > 0 ? overtime?.overtimes[8]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[9]?.hoursRendered >= 0 &&
                                overtime?.overtimes[9]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[9]?.hoursRendered > 0 ? overtime?.overtimes[9]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[10]?.hoursRendered >= 0 &&
                                overtime?.overtimes[10]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[10]?.hoursRendered > 0 ? overtime?.overtimes[10]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[11]?.hoursRendered >= 0 &&
                                overtime?.overtimes[11]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[11]?.hoursRendered > 0 ? overtime?.overtimes[11]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[12]?.hoursRendered >= 0 &&
                                overtime?.overtimes[12]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[12]?.hoursRendered > 0 ? overtime?.overtimes[12]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[13]?.hoursRendered >= 0 &&
                                overtime?.overtimes[13]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[13]?.hoursRendered > 0 ? overtime?.overtimes[13]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[14]?.hoursRendered >= 0 &&
                                overtime?.overtimes[14]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[14]?.hoursRendered > 0 ? overtime?.overtimes[14]?.hoursRendered : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol_dates,
                            {
                              height: 20,
                              borderBottomWidth: 0,
                              backgroundColor: `${
                                overtime?.overtimes[15]?.hoursRendered >= 0 &&
                                overtime?.overtimes[15]?.hoursRendered !== null
                                  ? 'cyan'
                                  : ''
                              }`,
                            },
                          ]}
                        >
                          <Text style={styles.tableCell_dates}>
                            {overtime?.overtimes[15]?.hoursRendered > 0 ? overtime?.overtimes[15]?.hoursRendered : ''}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.tableCol, { width: 35 }]}>
                      <Text style={styles.tableCell}>{overtime?.totalOTHoursRendered}</Text>
                    </View>

                    <View style={[styles.tableCol, { width: 40 }]}>
                      <Text style={styles.tableCell}>{overtime?.totalRegularOTHoursRendered}</Text>
                    </View>

                    <View style={[styles.tableCol, { width: 40 }]}>
                      <Text style={styles.tableCell}>{overtime?.regularOTAmount.toLocaleString()}</Text>
                    </View>

                    <View style={[styles.tableCol, { width: 50 }]}>
                      <Text style={styles.tableCell}>{overtime?.totalOffOTHoursRendered}</Text>
                    </View>

                    <View style={[styles.tableCol, { width: 40 }]}>
                      <Text style={styles.tableCell}>{overtime?.offOTAmount.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: 45 }]}>
                      <Text style={styles.tableCell}>{overtime?.substituteDutyOTHours}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: 45 }]}>
                      <Text style={styles.tableCell}>{overtime?.substituteAmount.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: 41 }]}>
                      <Text style={styles.tableCell}>{overtime?.nightDifferentialHrs}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: 42 }]}>
                      <Text style={[styles.tableCell, { padding: 1 }]}>
                        {overtime?.nightDifferentialAmount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: 60 }]}>
                      <Text style={styles.tableCell}>{overtime?.totalOvertimeAmount.toLocaleString()}</Text>
                    </View>
                  </View>
                ))}
              {/* TOTALS */}
              <View style={[styles.tableRow, { borderTop: '1px solid #000' }]} wrap={false}>
                {/* <View style={[styles.tableCol, { width: 20 }]}>
                          <Text style={styles.tableCell}>1</Text>
                        </View> */}
                <View style={styles.tableCol}>
                  <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 154, paddingLeft: 5 }}>
                    TOTAL
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 52 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={styles.tableCol_dates_main}>
                  <View style={styles.tableRow}>
                    <View
                      style={[styles.tableCol, { height: 20, borderBottomWidth: 0, borderRightWidth: 0, width: 207 }]}
                    >
                      <Text style={styles.tableCell_dates}></Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCol, { width: 35 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>
                    {overtimeSummaryReport?.overallTotalRegularOTAmount?.toLocaleString()}
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 50 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 40 }]}>
                  <Text style={styles.tableCell}>
                    {overtimeSummaryReport?.overallTotalOffOTAmount?.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: 45 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={[styles.tableCol, { width: 45 }]}>
                  <Text style={styles.tableCell}>
                    {overtimeSummaryReport?.overallSubstituteDutyOTAmount?.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: 41 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={[styles.tableCol, { width: 42 }]}>
                  <Text style={[styles.tableCell, { padding: 1 }]}>
                    {overtimeSummaryReport?.overallNightDifferentialAmount?.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: 60 }]}>
                  <Text style={styles.tableCell}>{overtimeSummaryReport?.overallTotalOTAmount?.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            {/* SIGNATORIES */}
            <View wrap={false}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontSize: 9,
                  paddingTop: 40,
                  paddingLeft: 35,
                  paddingRight: 35,
                }}
              >
                <Text>Prepared by:</Text>
                <Text
                  style={{
                    marginRight: 0,
                  }}
                >
                  Noted by:
                </Text>

                <Text
                  style={{
                    marginRight: 155,
                  }}
                >
                  Approved by:
                </Text>
              </View>
              {/* SIGNATURES */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontSize: 9,
                  paddingTop: 10,
                  paddingLeft: 35,
                  paddingRight: 35,
                }}
              >
                <View
                  style={{
                    width: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: 9,
                    gap: 0,
                  }}
                >
                  <Image
                    style={{ width: 40, marginBottom: 2 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeSummaryReport?.signatories?.preparedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeSummaryReport?.signatories?.preparedBy?.signature
                        : '/'
                    }
                  />

                  <Text
                    style={{
                      marginBottom: -8,
                      width: 165,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.preparedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.preparedBy?.position}
                  </Text>
                </View>

                <View
                  style={{
                    width: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: 9,
                    gap: 0,
                  }}
                >
                  <Image
                    style={{ width: 40, marginBottom: 2 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + overtimeSummaryReport?.signatories?.notedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeSummaryReport?.signatories?.notedBy?.signature
                        : '/'
                    }
                  />

                  <Text
                    style={{
                      marginBottom: -8,
                      width: 165,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.notedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.notedBy?.position}
                  </Text>
                </View>
                <View
                  style={{
                    width: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: 9,
                    gap: 0,
                  }}
                >
                  <Image
                    style={{ width: 40, marginBottom: 2 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeSummaryReport?.signatories?.approvedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeSummaryReport?.signatories?.approvedBy?.signature
                        : '/'
                    }
                  />

                  <Text
                    style={{
                      marginBottom: -8,
                      width: 165,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.approvedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeSummaryReport?.signatories?.approvedBy?.position}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
      {/* </PDFViewer> */}
    </>
  );
};

export default OvertimeSummaryReportPdf;
