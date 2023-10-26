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

export const OvertimeAccomplishmentReportSummaryModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ModalProps) => {
  const {
    overtimeDetails,
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName,
    accomplishmentDetails,
    getOvertimeSummary,
    getOvertimeSummarySuccess,
    getOvertimeSummaryFail,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
    getOvertimeSummary: state.getOvertimeSummary,
    getOvertimeSummarySuccess: state.getOvertimeSummarySuccess,
    getOvertimeSummaryFail: state.getOvertimeSummaryFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const overtimeSummaryUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${overtimeAccomplishmentEmployeeId}/${overtimeAccomplishmentApplicationId}/details`;

  const {
    data: swrOvertimeSummary,
    isLoading: swrOvertimeSummaryIsLoading,
    error: swrOvertimeSummaryError,
    mutate: mutateOvertimeSummary,
  } = useSWR(overtimeSummaryUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeSummaryIsLoading) {
      getOvertimeSummary(swrOvertimeSummaryIsLoading);
    }
  }, [swrOvertimeSummaryIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeSummary)) {
      getOvertimeSummarySuccess(swrOvertimeSummaryIsLoading, swrOvertimeSummary);
    }

    if (!isEmpty(swrOvertimeSummaryError)) {
      getOvertimeSummaryFail(swrOvertimeSummaryIsLoading, swrOvertimeSummaryError.message);
    }
  }, [swrOvertimeSummary, swrOvertimeSummaryError]);

  const sampleCount = [{ number: 1 }, { number: 2 }, { number: 3 }];

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report Summary</span>
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
                {sampleCount.map((number: any, idx: number) => (
                  <Page size={[612.0, 396.0]} key={idx}>
                    <View style={styles.page}>
                      <View style={styles.controlNumber}>
                        <Text>NO. 1</Text>
                      </View>
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
                          {overtimeAccomplishmentEmployeeName}
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
                          {employeeDetails.employmentDetails.assignment.name}
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
                          {DateFormatter(accomplishmentDetails.plannedDate, 'MM-DD-YYYY')}
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
                              height: 120,
                              textAlign: 'justify',
                            }}
                          >
                            <Text>{accomplishmentDetails.accomplishments}</Text>
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
                            marginLeft: 45,
                          }}
                        >
                          Signature over Printed Name
                        </Text>
                        <Text
                          style={{
                            marginRight: 45,
                          }}
                        >
                          Department Manager A
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
                          {overtimeAccomplishmentEmployeeName}
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
                ))}
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

export default OvertimeAccomplishmentReportSummaryModal;
