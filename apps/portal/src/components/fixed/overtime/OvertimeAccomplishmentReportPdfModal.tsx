/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, PdfHeader } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

const styles = StyleSheet.create({
  page: {
    margin: 10,
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
    fontSize: 18,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 5,
  },
});

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeAccomplishmentReportPdfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    pdfAccomplishmentReportModalIsOpen,
    overtimeAccomplishmentReport,
    getOvertimeAccomplishmentReport,
    getOvertimeAccomplishmentReportSuccess,
    getOvertimeAccomplishmentReportFail,
  } = useOvertimeStore((state) => ({
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    pdfAccomplishmentReportModalIsOpen: state.pdfAccomplishmentReportModalIsOpen,
    overtimeAccomplishmentReport: state.overtimeAccomplishmentReport,
    getOvertimeAccomplishmentReport: state.getOvertimeAccomplishmentReport,
    getOvertimeAccomplishmentReportSuccess: state.getOvertimeAccomplishmentReportSuccess,
    getOvertimeAccomplishmentReportFail: state.getOvertimeAccomplishmentReportFail,
  }));

  const overtimeAccomplishmentReportUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/reports/accomplishment/individual/${overtimeAccomplishmentApplicationId}/${overtimeAccomplishmentEmployeeId}/`;

  const {
    data: swrOvertimeAccomplishmentReport,
    isLoading: swrOvertimeAccomplishmentReportIsLoading,
    error: swrOvertimeAccomplishmentReportError,
    mutate: mutateOvertimeAccomplishmentReport,
  } = useSWR(pdfAccomplishmentReportModalIsOpen ? overtimeAccomplishmentReportUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeAccomplishmentReportIsLoading) {
      getOvertimeAccomplishmentReport(swrOvertimeAccomplishmentReportIsLoading);
    }
  }, [swrOvertimeAccomplishmentReportIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeAccomplishmentReport)) {
      getOvertimeAccomplishmentReportSuccess(swrOvertimeAccomplishmentReportIsLoading, swrOvertimeAccomplishmentReport);
    }

    if (!isEmpty(swrOvertimeAccomplishmentReportError)) {
      getOvertimeAccomplishmentReportFail(
        swrOvertimeAccomplishmentReportIsLoading,
        swrOvertimeAccomplishmentReportError.message
      );
    }
  }, [swrOvertimeAccomplishmentReport, swrOvertimeAccomplishmentReportError]);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report</span>
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
          {!overtimeAccomplishmentReport ? (
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
              <Document title="Overtime Accomplishment Report">
                <Page size={[612.0, 396.0]}>
                  <View style={styles.page}>
                    <View style={styles.controlNumber}>{/* <Text>NO. 1</Text> */}</View>
                    <PdfHeader />
                    <Text style={styles.pdfTitle}>ACCOMPLISHMENT REPORT ON OVERTIME AUTHORIZATION</Text>
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
                      <Text>Name: ____________________________________</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 65,
                          marginTop: 20,
                          width: 175,
                        }}
                      >
                        {overtimeAccomplishmentReport.employeeName}
                      </Text>
                      <Text>Office/Department/Division: ______________________________________</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 368,
                          marginTop: 20,
                          width: 200,
                        }}
                      >
                        {overtimeAccomplishmentReport.assignment}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        fontSize: 9,
                        paddingTop: 10,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text>Date: _____________</Text>
                      <Text
                        style={{
                          position: 'absolute',

                          marginTop: 10,
                          width: 90,
                        }}
                      >
                        {DateFormatter(overtimeAccomplishmentReport.date, 'MM-DD-YYYY')}
                      </Text>
                    </View>
                    {/* MAIN TABLE CONTAINER */}
                    <View
                      style={{
                        display: 'flex',
                        border: '1px solid #000',
                        flexDirection: 'column',
                        marginLeft: 31,
                        marginRight: 31,
                        marginTop: 10,
                        fontSize: 9,
                      }}
                    >
                      {/* DATE AND WORK ACTIVITY ROW */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 6,
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          <Text>WORK ACTIVITY</Text>
                        </View>
                      </View>
                      {/* ACCOMPLISHMENTS */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',

                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 6,
                            width: '100%',
                            height: 100,
                            textAlign: 'justify',
                          }}
                        >
                          <Text>{overtimeAccomplishmentReport.accomplishments}</Text>
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
                      <Text>Submitted by:</Text>
                      <Text
                        style={{
                          marginRight: 155,
                        }}
                      >
                        Noted by:
                      </Text>
                    </View>
                    {/* SIGNATURES */}
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        fontSize: 9,
                        paddingTop: 10,
                        paddingLeft: 35,
                        paddingRight: 35,
                        width: '100%',
                      }}
                    >
                      <Image
                        style={{ width: 50, position: 'absolute', marginLeft: 112, marginTop: -13 }}
                        src={overtimeAccomplishmentReport?.employeeSignature ?? ''}
                      />
                      <Image
                        style={{ width: 50, position: 'absolute', marginLeft: 432, marginTop: -13 }}
                        src={overtimeAccomplishmentReport?.supervisorSignature ?? ''}
                      />
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
                          marginTop: 1,
                          marginLeft: 35,
                          width: 195,
                          textAlign: 'center',
                          position: 'absolute',
                        }}
                      >
                        Signature Over Printed Name
                      </Text>
                      <Text
                        style={{
                          marginTop: 1,
                          marginLeft: 362,
                          width: 195,
                          textAlign: 'center',
                          position: 'absolute',
                        }}
                      >
                        {overtimeAccomplishmentReport.supervisorPosition}
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
                          marginTop: -12,
                          width: 195,
                          textAlign: 'center',
                          position: 'absolute',
                        }}
                      >
                        {overtimeAccomplishmentReport.employeeName}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 362,
                          marginTop: -12,
                          width: 195,
                          textAlign: 'center',
                          position: 'absolute',
                        }}
                      >
                        {overtimeAccomplishmentReport.supervisorName}
                      </Text>
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

export default OvertimeAccomplishmentReportPdfModal;
