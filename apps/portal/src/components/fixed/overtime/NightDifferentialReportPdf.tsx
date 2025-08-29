/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { PdfHeader } from '@gscwd-apps/oneui';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';

import dayjs from 'dayjs';
import {
  NightDifferentialDetailsWithComputation,
  NightDifferentialReport,
} from 'apps/portal/src/types/night-differential.type';

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
    // borderStyle: 'solid',
    // borderWidth: 1,
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
    fontSize: 7,
    width: '100%',
    padding: 0,
  },
});

type PdfProps = {
  nightDifferentialReport: NightDifferentialReport;
  selectedMonth: number;
  selectedPeriod: string;
};

export const NightDifferentialReportPdf = ({
  selectedMonth,
  selectedPeriod,

  nightDifferentialReport,
}: PdfProps): JSX.Element => {
  return (
    <>
      {/* <PDFViewer width={'100%'} height={1000} showToolbar> */}
      <Document title="Night Shift Differential Pay">
        <Page
          size={'FOLIO'}
          orientation="landscape"
          style={{
            paddingBottom: 45,
            paddingTop: 25,
          }}
        >
          <View style={styles.page}>
            <View fixed>
              <View style={styles.controlNumber}>{/* <Text>NO. 1</Text> */}</View>
              <PdfHeader />
              {/* <Text style={styles.pdfTitle}>{nightDifferentialReport.assignedTo}</Text> */}
              <Text style={styles.pdfTitle}>NIGHT SHIFT DIFFERENTIAL PAY</Text>
              <Text style={[styles.pdfTitle, { paddingBottom: 10 }]}>
                PERIOD COVERED:{' '}
                <Text style={[styles.pdfTitle, { paddingLeft: 3, paddingRight: 3, textDecoration: 'underline' }]}>
                  {nightDifferentialReport.periodCovered}
                </Text>
              </Text>
              <Text style={[styles.pdfTitle, { paddingBottom: 10 }]}>
                DEPARTMENT:{' '}
                <Text style={[styles.pdfTitle, { paddingLeft: 3, paddingRight: 3, textDecoration: 'underline' }]}>
                  {nightDifferentialReport.assignment.toUpperCase()}
                </Text>
              </Text>
            </View>

            <View style={styles.table}>
              <View fixed style={[styles.tableRow, { borderWidth: 0 }]}>
                <View
                  style={[
                    styles.tableCol,
                    { width: 20, borderStyle: 'solid', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>NO.</Text>
                </View>
                <View style={[styles.tableCol, { borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 }]}>
                  <Text style={{ margin: 'auto', textAlign: 'center', fontSize: 8, width: 180 }}>NAME</Text>
                </View>

                <View
                  style={[
                    styles.tableCol,
                    { width: 60, borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>DAILY RATE {'\n'} (A)</Text>
                </View>

                <View
                  style={[
                    styles.tableCol,
                    { width: 60, borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>RATE HOURLY {'\n'} (B) </Text>
                </View>

                <View
                  style={[
                    styles.tableCol_dates_main,
                    { borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <View style={[styles.tableCol_dates, { height: 30 }]}>
                    <Text style={[styles.tableCell, { paddingTop: 2, paddingBottom: 2, fontSize: 14 }]}>
                      {dayjs(selectedMonth).format('MMMM')}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '1' : '16'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '2' : '17'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '3' : '18'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '4' : '19'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '5' : '20'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '6' : '21'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '7' : '22'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '8' : '23'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '9' : '24'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '10' : '25'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '11' : '26'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '12' : '27'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '13' : '28'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '14' : '29'}</Text>
                    </View>
                    <View style={[styles.tableCol, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '15' : '30'}</Text>
                    </View>
                    <View style={[styles.tableCol_dates, { height: 20, width: 20, borderBottomWidth: 0 }]}>
                      <Text style={styles.tableCell_dates}>{selectedPeriod === 'first' ? '' : '31'}</Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.tableCol,
                    { width: 80, borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>TOTAL NO. {'\n'} OT HOURS (C) </Text>
                </View>

                <View
                  style={[
                    styles.tableCol,
                    { width: 80, borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>TOTAL HOURLY {'\n'} SALARY (B*C) </Text>
                </View>

                <View
                  style={[
                    styles.tableCol,
                    { width: 80, borderStyle: 'solid', borderBottomWidth: 1, borderTopWidth: 1 },
                  ]}
                >
                  <Text style={styles.tableCell}>20% NIGHT {'\n'} DIFFERENTIAL</Text>
                </View>
              </View>
              {/* EMPLOYEE DETAILS */}
              {nightDifferentialReport?.nightDifferentialDetailsWithComputation?.length > 0 &&
                nightDifferentialReport?.nightDifferentialDetailsWithComputation?.map(
                  (nightDiff: NightDifferentialDetailsWithComputation, idx: number) => (
                    <View style={[styles.tableRow, { borderTop: '0px solid #000' }]} key={idx} wrap={false}>
                      <View style={[styles.tableCol, { width: 20, borderLeftWidth: 1 }]}>
                        <Text style={styles.tableCell}>{idx + 1}</Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 180 }}>
                          {nightDiff?.employeeFullName}
                        </Text>
                      </View>

                      <View style={[styles.tableCol, { width: 60 }]}>
                        <Text style={styles.tableCell}>{nightDiff?.dailyRate?.toLocaleString()}</Text>
                      </View>

                      <View style={[styles.tableCol, { width: 60 }]}>
                        <Text style={styles.tableCell}>{nightDiff?.hourlyRate?.toLocaleString()}</Text>
                      </View>

                      <View style={styles.tableCol_dates_main}>
                        <View style={styles.tableRow}>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[0]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[0]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[0]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[0]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[1]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[1]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[1]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[1]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[2]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[2]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[2]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[2]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[3]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[3]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[3]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[3]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[4]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[4]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[4]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[4]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[5]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[5]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[5]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[5]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[6]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[6]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[6]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[6]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[7]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[7]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[7]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[7]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[8]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[8]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[8]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[8]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[9]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[9]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[9]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[9]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[10]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[10]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[10]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[10]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[11]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[11]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[11]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[11]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[12]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[12]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[12]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[12]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[13]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[13]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[13]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[13]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[14]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[14]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[14]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[14]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCol_dates,
                              {
                                height: 20,
                                width: 20,
                                borderBottomWidth: 0,
                                backgroundColor: `${
                                  nightDiff?.dtrEntriesDetails[15]?.nightDifferentialHours >= 0 &&
                                  nightDiff?.dtrEntriesDetails[15]?.nightDifferentialHours !== null
                                    ? ''
                                    : ''
                                }`,
                              },
                            ]}
                          >
                            <Text style={styles.tableCell_dates}>
                              {nightDiff?.dtrEntriesDetails[15]?.nightDifferentialHours > 0
                                ? nightDiff?.dtrEntriesDetails[15]?.nightDifferentialHours
                                : ''}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={[styles.tableCol, { width: 80 }]}>
                        <Text style={styles.tableCell}>{nightDiff?.totalNoOfHours?.toFixed(2)}</Text>
                      </View>

                      <View style={[styles.tableCol, { width: 80 }]}>
                        <Text style={styles.tableCell}>
                          {(nightDiff?.hourlyRate * nightDiff?.totalNoOfHours)?.toLocaleString()}
                        </Text>
                      </View>

                      <View style={[styles.tableCol, { width: 80 }]}>
                        <Text style={styles.tableCell}>{nightDiff?.totalNightDifferential?.toLocaleString()}</Text>
                      </View>
                    </View>
                  )
                )}
              {/* TOTALS */}
              <View style={[styles.tableRow, { borderTop: '0px solid #000' }]} wrap={false}>
                {/* <View style={[styles.tableCol, { width: 20 }]}>
                          <Text style={styles.tableCell}>1</Text>
                        </View> */}
                <View style={[styles.tableCol, { borderLeftWidth: 1 }]}>
                  <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 199, paddingLeft: 5 }}>
                    GRAND TOTAL
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 60 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 60 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={styles.tableCol_dates_main}>
                  <View style={styles.tableRow}>
                    <View
                      style={[styles.tableCol, { height: 20, borderBottomWidth: 0, borderRightWidth: 0, width: 320 }]}
                    >
                      <Text style={styles.tableCell_dates}></Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.tableCol, { width: 80 }]}>
                  <Text style={styles.tableCell}></Text>
                </View>

                <View style={[styles.tableCol, { width: 80 }]}>
                  <Text style={styles.tableCell}>
                    {nightDifferentialReport?.totalOfTotalHourlySalary?.toLocaleString()}
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: 80 }]}>
                  <Text style={styles.tableCell}>
                    {nightDifferentialReport?.totalOfTotalNightDifferential?.toLocaleString()}
                  </Text>
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
                  Checked by:
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      nightDifferentialReport?.signatories?.preparedBySignature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          nightDifferentialReport?.signatories?.preparedBySignature
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
                    {nightDifferentialReport?.signatories?.preparedByName}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {nightDifferentialReport?.signatories?.preparedByPosition}
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      nightDifferentialReport?.signatories?.checkedBySignature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          nightDifferentialReport?.signatories?.checkedBySignature
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
                    {nightDifferentialReport?.signatories?.checkedByName}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {nightDifferentialReport?.signatories?.checkedByPosition}
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      nightDifferentialReport?.signatories?.approvedBySignature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          nightDifferentialReport?.signatories?.approvedBySignature
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
                    {nightDifferentialReport?.signatories?.approvedByName}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {nightDifferentialReport?.signatories?.approvedByPosition}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text
            style={{
              position: 'absolute',
              marginTop: '92vh',
              width: '100%',
              padding: 10,
              fontSize: 10,
              textAlign: 'center',
            }}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      </Document>
      {/* </PDFViewer> */}
    </>
  );
};

export default NightDifferentialReportPdf;
