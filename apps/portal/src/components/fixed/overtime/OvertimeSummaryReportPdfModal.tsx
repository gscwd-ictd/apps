/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, PdfHeader } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

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
    fontSize: 12,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 1,
  },

  table: {
    display: 'table',
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
    pdfOvertimeSummaryModalIsOpen,
    getOvertimeSummaryReport,
    getOvertimeSummaryReportSuccess,
    getOvertimeSummaryReportFail,
  } = useOvertimeStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    selectedPeriod: state.selectedPeriod,
    pdfOvertimeSummaryModalIsOpen: state.pdfOvertimeSummaryModalIsOpen,
    getOvertimeSummaryReport: state.getOvertimeSummaryReport,
    getOvertimeSummaryReportSuccess: state.getOvertimeSummaryReportSuccess,
    getOvertimeSummaryReportFail: state.getOvertimeSummaryReportFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const overtimeSummaryUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/reports/${employeeDetails.user._id}/${selectedYear}/${selectedMonth}?half=${selectedPeriod}`;

  const {
    data: swrOvertimeSummary,
    isLoading: swrOvertimeSummaryIsLoading,
    error: swrOvertimeSummaryError,
    mutate: mutateOvertimeSummary,
  } = useSWR(pdfOvertimeSummaryModalIsOpen ? overtimeSummaryUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

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
          {!swrOvertimeSummary ? (
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
                    <View style={styles.controlNumber}>
                      <Text>NO. 1</Text>
                    </View>
                    <PdfHeader />
                    <Text style={styles.pdfTitle}>SYSTEMS DEVELOPMENT AND APPLICATION DIVISION</Text>
                    <Text style={styles.pdfTitle}>OVERTIME SUMMARY FOR REGULAR EMPLOYEES</Text>
                    <Text style={[styles.pdfTitle, { paddingBottom: 10 }]}>
                      PERIOD COVERED:{' '}
                      <Text style={[styles.pdfTitle, { paddingLeft: 3, paddingRight: 3, textDecoration: 'underline' }]}>
                        September 16-30, 2023
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
                          <Text style={styles.tableCell}>MONTHLY BASIC SALARY</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>RATE PER HOUR (A)</Text>
                        </View>

                        <View style={styles.tableCol_dates_main}>
                          <View style={[styles.tableCol_dates, { height: 30 }]}>
                            <Text style={[styles.tableCell, { paddingTop: 2, paddingBottom: 2, fontSize: 14 }]}>
                              SEPTEMBER
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>1</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>2</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>3</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>4</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>5</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>6</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>7</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>8</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>9</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>10</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>11</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>12</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>13</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>14</Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>15</Text>
                            </View>
                            <View style={[styles.tableCol_dates, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}>31</Text>
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

                      <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: 20 }]}>
                          <Text style={styles.tableCell}>1</Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={{ margin: 'auto', textAlign: 'left', fontSize: 8, width: 134 }}>
                            JAY RAYMOND NOSOTROS
                          </Text>
                        </View>

                        <View style={[styles.tableCol, { width: 52 }]}>
                          <Text style={styles.tableCell}>29,165.00</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>165.71</Text>
                        </View>

                        <View style={styles.tableCol_dates_main}>
                          <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View
                              style={[styles.tableCol, { height: 20, borderBottomWidth: 0, backgroundColor: 'cyan' }]}
                            >
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                            <View style={[styles.tableCol_dates, { height: 20, borderBottomWidth: 0 }]}>
                              <Text style={styles.tableCell_dates}></Text>
                            </View>
                          </View>
                        </View>

                        <View style={[styles.tableCol, { width: 35 }]}>
                          <Text style={styles.tableCell}>99</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>100</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>5,898.00</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 50 }]}>
                          <Text style={styles.tableCell}>4</Text>
                        </View>

                        <View style={[styles.tableCol, { width: 40 }]}>
                          <Text style={styles.tableCell}>9,999.00</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 45 }]}>
                          <Text style={styles.tableCell}>6</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 45 }]}>
                          <Text style={styles.tableCell}>7</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 41 }]}>
                          <Text style={styles.tableCell}>8</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 42 }]}>
                          <Text style={[styles.tableCell, { padding: 1 }]}>10,000.00</Text>
                        </View>
                        <View style={[styles.tableCol, { width: 60 }]}>
                          <Text style={styles.tableCell}>10,889.00</Text>
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
                        paddingTop: 20,
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
                      <Text>_______________________________________</Text>
                      <Text>_______________________________________</Text>
                      <Text>_______________________________________</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: 8,
                        paddingTop: 2,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 20,
                        }}
                      >
                        Management Information Systems Researcher
                      </Text>
                      <Text
                        style={{
                          marginLeft: 20,
                        }}
                      >
                        Acting Department Manager A
                      </Text>
                      <Text
                        style={{
                          marginRight: 15,
                        }}
                      >
                        Assistant General Manager for Administration
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        fontSize: 8,
                        paddingTop: 2,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 35,
                          marginTop: -20,
                          width: 195,
                          textAlign: 'center',
                          position: 'absolute',
                        }}
                      >
                        {employeeDetails.profile.firstName} {employeeDetails.profile.middleName}{' '}
                        {employeeDetails.profile.lastName}
                      </Text>
                      {/* <Text
                        style={{
                          marginRight: 45,
                        }}
                      >
                        Department Manager A
                      </Text> */}
                    </View>
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeSummaryReportPdfModal;
