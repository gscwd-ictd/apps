/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, PdfHeader } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { EmployeeOvertimeDetail, OvertimAuthorizationEmployee } from 'libs/utils/src/lib/types/overtime.type';

const styles = StyleSheet.create({
  page: {
    // border: '1px solid #000',
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    paddingLeft: 180,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
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

export const OvertimeAuthorizationModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName,
    accomplishmentDetails,
    pdfOvertimeAuthorizationModalIsOpen,
    overtimeAuthorizationReport,
    getOvertimeAuthorizationReport,
    getOvertimeAuthorizationReportSuccess,
    getOvertimeAuthorizationReportFail,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
    pdfOvertimeAuthorizationModalIsOpen: state.pdfOvertimeAuthorizationModalIsOpen,
    overtimeAuthorizationReport: state.overtimeAuthorizationReport,
    getOvertimeAuthorizationReport: state.getOvertimeAuthorizationReport,
    getOvertimeAuthorizationReportSuccess: state.getOvertimeAuthorizationReportSuccess,
    getOvertimeAuthorizationReportFail: state.getOvertimeAuthorizationReportFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const overtimeAuthorizationReportUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/reports/${overtimeDetails.id}/${employeeDetails.user._id}`;

  const {
    data: swrOvertimeAuthorizationReport,
    isLoading: swrOvertimeAuthorizationReportIsLoading,
    error: swrOvertimeAuthorizationReportError,
    mutate: mutateOvertimeAuthorizationReport,
  } = useSWR(pdfOvertimeAuthorizationModalIsOpen ? overtimeAuthorizationReportUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeAuthorizationReportIsLoading) {
      getOvertimeAuthorizationReport(swrOvertimeAuthorizationReportIsLoading);
    }
  }, [swrOvertimeAuthorizationReportIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeAuthorizationReport)) {
      getOvertimeAuthorizationReportSuccess(swrOvertimeAuthorizationReportIsLoading, swrOvertimeAuthorizationReport);
    }

    if (!isEmpty(swrOvertimeAuthorizationReportError)) {
      getOvertimeAuthorizationReportFail(
        swrOvertimeAuthorizationReportIsLoading,
        swrOvertimeAuthorizationReportError.message
      );
    }
  }, [swrOvertimeAuthorizationReport, swrOvertimeAuthorizationReportError]);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Authorization Report</span>
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
          {!overtimeAuthorizationReport ? (
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
              <Document title="Overtime Authorization Report">
                <Page size={[612.0, 396.0]}>
                  <View style={styles.page}>
                    <View style={styles.controlNumber}>
                      <Text>{/* NO. 1 */}</Text>
                    </View>
                    <PdfHeader />
                    <Text style={styles.pdfTitle}>OVERTIME AUTHORIZATION</Text>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: 9,
                        paddingTop: 10,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                    >
                      <Text>Purpose: ________________________________________________________________________</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginTop: 10,
                          marginLeft: 60,
                          width: 350,
                        }}
                      >
                        {overtimeAuthorizationReport.purpose}
                      </Text>
                      <Text>Date Covered: _____________</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginTop: 10,
                          marginLeft: 515,
                          width: 90,
                        }}
                      >
                        {DateFormatter(overtimeAuthorizationReport.plannedDate, 'MM-DD-YYYY')}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: 9,
                        paddingTop: 0,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 38,
                        }}
                      >
                        ________________________________________________________________________
                      </Text>

                      <Text>Estimated Hours: _______</Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginTop: 0,
                          marginLeft: 550,
                          width: 90,
                        }}
                      >
                        {overtimeAuthorizationReport.estimatedHours}
                      </Text>
                    </View>

                    {/* MAIN TABLE CONTAINER */}
                    <View
                      style={{
                        display: 'flex',
                        // borderBottom: '1px solid #000',
                        borderRight: '1px solid #000',
                        borderTop: '1px solid #000',
                        borderLeft: '1px solid #000',
                        flexDirection: 'column',
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 10,
                        fontSize: 9,
                      }}
                    >
                      {/* HEADERS */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            borderRight: '1px solid #000',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 4,
                            width: '35%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>EMPLOYEE'S NAME</Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            borderRight: '1px solid #000',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 2,
                            width: '15%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>EMPLOYEE NO.</Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 2,
                            width: '50%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>OFFICE/DEPARTMENT/DIVISION</Text>
                        </View>
                      </View>
                    </View>
                    {overtimeAuthorizationReport?.employees?.map(
                      (employee: OvertimAuthorizationEmployee, idx: number) => (
                        <View
                          key={idx}
                          style={{
                            display: 'flex',
                            borderBottom: '1px solid #000',
                            borderRight: '1px solid #000',
                            borderLeft: '1px solid #000',
                            flexDirection: 'column',
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 0,
                            fontSize: 9,
                          }}
                        >
                          {/* HEADERS */}
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                            }}
                          >
                            <View
                              style={{
                                display: 'flex',
                                borderRight: '1px solid #000',
                                flexDirection: 'column',
                                fontSize: 9,
                                padding: 4,
                                width: '35%',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}
                            >
                              <Text>{employee.name}</Text>
                            </View>
                            <View
                              style={{
                                display: 'flex',
                                borderRight: '1px solid #000',

                                flexDirection: 'column',
                                fontSize: 9,
                                padding: 2,
                                width: '15%',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text>{employee.companyId}</Text>
                            </View>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontSize: 9,
                                width: '50%',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                padding: 4,
                              }}
                            >
                              <Text>{employee.assignment}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    )}
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
                      <Text>Prepared and Requested by:</Text>
                      <Text
                        style={{
                          marginRight: 205,
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
                        justifyContent: 'flex-start',
                        fontSize: 9,
                        paddingTop: 2,
                        paddingLeft: 35,
                        paddingRight: 35,
                        width: '100%',
                      }}
                    >
                      <Image
                        style={{ width: 50, position: 'absolute', marginLeft: 90, marginTop: 0 }}
                        src={overtimeAuthorizationReport?.signatories?.employeeSignature ?? ''}
                      />
                      <Image
                        style={{ width: 50, position: 'absolute', marginLeft: 360, marginTop: 0 }}
                        src={overtimeAuthorizationReport?.signatories?.supervisorSignature ?? ''}
                      />
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        fontSize: 9,
                        paddingTop: 30,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text>_______________________________</Text>
                      <Text>_____________</Text>
                      <Text>__________________________________</Text>
                      <Text>_____________</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        fontSize: 8,
                        paddingTop: 0,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 60,
                        }}
                      >
                        Supervisor
                      </Text>
                      <Text
                        style={{
                          marginLeft: 105,
                        }}
                      >
                        Date
                      </Text>
                      <Text
                        style={{
                          marginLeft: 80,
                        }}
                      >
                        Division/Department Manager
                      </Text>
                      <Text
                        style={{
                          marginLeft: 78,
                        }}
                      >
                        Date
                      </Text>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        fontSize: 9,
                        paddingTop: 2,
                        paddingLeft: 35,
                        paddingRight: 35,
                      }}
                    >
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 30,
                          marginTop: -20,
                          width: 165,

                          textAlign: 'center',
                        }}
                      >
                        {overtimeAuthorizationReport?.signatories?.employeeName}
                      </Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 163,
                          marginTop: -20,
                          width: 165,

                          textAlign: 'center',
                        }}
                      >
                        {overtimeAuthorizationReport?.requestedDate}
                      </Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 300,
                          marginTop: -20,
                          width: 170,

                          textAlign: 'center',
                        }}
                      >
                        {overtimeAuthorizationReport?.signatories?.supervisorName}
                      </Text>
                      <Text
                        style={{
                          position: 'absolute',
                          marginLeft: 445,
                          marginTop: -20,
                          width: 165,

                          textAlign: 'center',
                        }}
                      >
                        {overtimeAuthorizationReport?.managerApprovalDate}
                      </Text>
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

export default OvertimeAuthorizationModal;
