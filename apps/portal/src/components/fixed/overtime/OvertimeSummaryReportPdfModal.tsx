/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, PdfHeader } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { OvertimeSummaryEmployee } from 'libs/utils/src/lib/types/overtime.type';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
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
    margin: 'auto',
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

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeSummaryReportPdfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedMonth,
    selectedYear,
    selectedPeriod,
    selectedEmployeeType,
    pdfOvertimeSummaryModalIsOpen,
    overtimeSummaryReport,
    getOvertimeSummaryReport,
    getOvertimeSummaryReportSuccess,
    getOvertimeSummaryReportFail,
  } = useOvertimeStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    selectedPeriod: state.selectedPeriod,
    selectedEmployeeType: state.selectedEmployeeType,
    pdfOvertimeSummaryModalIsOpen: state.pdfOvertimeSummaryModalIsOpen,
    overtimeSummaryReport: state.overtimeSummaryReport,
    getOvertimeSummaryReport: state.getOvertimeSummaryReport,
    getOvertimeSummaryReportSuccess: state.getOvertimeSummaryReportSuccess,
    getOvertimeSummaryReportFail: state.getOvertimeSummaryReportFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const numberOfDays = dayjs(`${selectedYear}-${selectedMonth}-1`).daysInMonth();
  const overtimeSummaryUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/reports/${employeeDetails.user._id}/${selectedYear}/${selectedMonth}?half=${selectedPeriod}&nature_of_appointment=${selectedEmployeeType}`;

  const {
    data: swrOvertimeSummary,
    isLoading: swrOvertimeSummaryIsLoading,
    error: swrOvertimeSummaryError,
    mutate: mutateOvertimeSummary,
  } = useSWR(
    pdfOvertimeSummaryModalIsOpen && selectedYear && selectedMonth && employeeDetails.user._id
      ? overtimeSummaryUrl
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeSummaryIsLoading) {
      getOvertimeSummaryReport(swrOvertimeSummaryIsLoading);
    }
  }, [swrOvertimeSummaryIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeSummary)) {
      getOvertimeSummaryReportSuccess(swrOvertimeSummaryIsLoading, swrOvertimeSummary);
    }

    if (!isEmpty(swrOvertimeSummaryError)) {
      getOvertimeSummaryReportFail(swrOvertimeSummaryIsLoading, swrOvertimeSummaryError.message);
    }
  }, [swrOvertimeSummary, swrOvertimeSummaryError]);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Summary Report</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {!overtimeSummaryReport ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <PDFViewer width={'100%'} height={1000} showToolbar>
              <Document title="Overtime Accomplishment Report Summary">
                <Page size={'FOLIO'} orientation="landscape">
                  <View style={styles.page}>
                    <View style={styles.controlNumber}>{/* <Text>NO. 1</Text> */}</View>
                    <PdfHeader />
                    <Text style={styles.pdfTitle}>{overtimeSummaryReport.assignedTo}</Text>
                    <Text style={styles.pdfTitle}>OVERTIME SUMMARY FOR REGULAR EMPLOYEES</Text>
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
                          <Text style={styles.tableCell}>AMOUNT (A X B X 1.25)</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 50 }]}>
                          <Text style={styles.tableCell}>TOTAL HOLIDAY / DAY-OFF OT HOURS (C)</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>AMOUNT (A X C X 1.5)</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 45 }]}>
                          <Text style={styles.tableCell}>SUBSTITUTE DUTY OT HOURS (D)</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 45 }]}>
                          <Text style={styles.tableCell}>SUBSTITUTE AMOUNT (A X D X 1.25)</Text>
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
                          <View style={styles.tableRow} key={idx}>
                            <View style={[styles.tableCol, { width: 20 }]}>
                              <Text style={styles.tableCell}>{idx + 1}</Text>
                            </View>
                            <View style={styles.tableCol}>
                              <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 134 }}>
                                {overtime.employeeFullName}
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
                                      backgroundColor: `${overtime.overtimes[0].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {overtime.overtimes[0].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[1].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {overtime.overtimes[1].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[2].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {overtime.overtimes[2].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[3].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {overtime.overtimes[3].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[4].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {overtime.overtimes[4].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[5].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[5].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[6].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[6].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[7].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[7].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[8].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[8].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[9].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[9].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[10].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[10].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[11].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[11].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[12].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[12].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[13].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[13].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[14].hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[14].hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.tableCol_dates,
                                    {
                                      height: 20,
                                      borderBottomWidth: 0,
                                      backgroundColor: `${overtime.overtimes[15]?.hoursRendered > 0 ? 'cyan' : ''}`,
                                    },
                                  ]}
                                >
                                  <Text style={styles.tableCell_dates}>
                                    {' '}
                                    {overtime.overtimes[15]?.hoursRendered > 0 ? '' : ''}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View style={[styles.tableCol, { width: 35 }]}>
                              <Text style={styles.tableCell}>{overtime.totalOTHoursRendered}</Text>
                            </View>

                            <View style={[styles.tableCol, { width: 40 }]}>
                              <Text style={styles.tableCell}>{overtime.totalRegularOTHoursRendered}</Text>
                            </View>

                            <View style={[styles.tableCol, { width: 40 }]}>
                              <Text style={styles.tableCell}>{overtime.regularOTAmount.toLocaleString()}</Text>
                            </View>

                            <View style={[styles.tableCol, { width: 50 }]}>
                              <Text style={styles.tableCell}>{overtime.totalOffOTHoursRendered}</Text>
                            </View>

                            <View style={[styles.tableCol, { width: 40 }]}>
                              <Text style={styles.tableCell}>{overtime.offOTAmount.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: 45 }]}>
                              <Text style={styles.tableCell}>{overtime.substituteDutyOTHours}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: 45 }]}>
                              <Text style={styles.tableCell}>{overtime.substituteAmount.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: 41 }]}>
                              <Text style={styles.tableCell}>{overtime.nightDifferentialHrs}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: 42 }]}>
                              <Text style={[styles.tableCell, { padding: 1 }]}>
                                {overtime.nightDifferentialAmount.toLocaleString()}
                              </Text>
                            </View>
                            <View style={[styles.tableCol, { width: 60 }]}>
                              <Text style={styles.tableCell}>{overtime.totalOvertimeAmount.toLocaleString()}</Text>
                            </View>
                          </View>
                        ))}
                      {/* TOTALS */}
                      <View style={styles.tableRow}>
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
                              style={[
                                styles.tableCol,
                                { height: 20, borderBottomWidth: 0, borderRightWidth: 0, width: 207 },
                              ]}
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
                          <Text style={styles.tableCell}>
                            {overtimeSummaryReport?.overallTotalOTAmount?.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* SIGNATORIES */}
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
                          src={overtimeSummaryReport?.signatories?.preparedBy?.signature ?? '/'}
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
                          src={overtimeSummaryReport?.signatories?.notedBy?.signature ?? '/'}
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
                          src={overtimeSummaryReport?.signatories?.approvedBy?.signature ?? '/'}
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
                </Page>
              </Document>
            </PDFViewer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeSummaryReportPdfModal;
