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
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';

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
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report PDF</span>
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
          {!accomplishmentDetails ? (
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
                    <View style={styles.controlNumber}>
                      <Text>NO. 1</Text>
                    </View>
                    <PdfHeader />
                    <Text style={styles.pdfTitle}>OVERTIME AUTHORIZATION</Text>

                    {/* MAIN TABLE CONTAINER */}
                    <View
                      style={{
                        display: 'flex',
                        borderBottom: '1px solid #000',
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
                            width: 800,
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
                            width: 400,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>EMPLOYEE</Text>
                          <Text>NO.</Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            borderRight: '1px solid #000',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 2,
                            width: '100%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>DIVISION</Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            borderRight: '1px solid #000',
                            borderBottom: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 2,
                            width: 400,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>DATE</Text>
                          <Text>COVERED</Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            borderRight: '1px solid #000',
                            flexDirection: 'column',
                            fontSize: 9,
                            padding: 0,
                            width: 800,
                            textAlign: 'center',
                          }}
                        >
                          <View
                            style={{
                              display: 'flex',
                              borderBottom: '1px solid #000',
                              flexDirection: 'column',
                              fontSize: 9,
                              padding: 2,
                              width: '100%',
                              textAlign: 'center',
                            }}
                          >
                            <Text>NO. OF HOURS</Text>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              borderBottom: '1px solid #000',
                              flexDirection: 'row',
                              fontSize: 9,
                              padding: 0,
                              width: '100%',
                              textAlign: 'center',
                            }}
                          >
                            <View
                              style={{
                                fontSize: 9,
                                padding: 2,
                                width: '100%',
                                textAlign: 'center',
                                borderRight: '1px solid #000',
                              }}
                            >
                              <Text>REQ.</Text>
                            </View>

                            <View
                              style={{
                                fontSize: 9,
                                padding: 2,
                                width: 120,
                                textAlign: 'center',
                              }}
                            >
                              <Text>APPROVED</Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderBottom: '1px solid #000',
                            fontSize: 9,
                            padding: 2,
                            width: '100%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>PURPOSE</Text>
                        </View>
                      </View>
                    </View>
                    {overtimeDetails.employees.map((employee: EmployeeOvertimeDetail, idx: number) => (
                      <View
                        style={{
                          display: 'flex',
                          borderBottom: '1px solid #000',
                          borderRight: '1px solid #000',
                          borderTop: '1px solid #000',
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
                              borderBottom: '1px solid #000',
                              flexDirection: 'column',
                              fontSize: 9,
                              padding: 4,
                              width: 800,
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
                              width: 400,
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text>EMPLOYEE</Text>
                            <Text>NO.</Text>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              borderRight: '1px solid #000',
                              borderBottom: '1px solid #000',
                              flexDirection: 'column',
                              fontSize: 9,
                              padding: 2,
                              width: '100%',
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text>DIVISION</Text>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              borderRight: '1px solid #000',
                              borderBottom: '1px solid #000',
                              flexDirection: 'column',
                              fontSize: 9,
                              padding: 2,
                              width: 400,
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text>DATE</Text>
                            <Text>COVERED</Text>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              borderRight: '1px solid #000',
                              flexDirection: 'column',
                              fontSize: 9,
                              padding: 0,
                              width: 800,
                              textAlign: 'center',
                            }}
                          >
                            <View
                              style={{
                                display: 'flex',
                                borderBottom: '1px solid #000',
                                flexDirection: 'column',
                                fontSize: 9,
                                padding: 2,
                                width: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>NO. OF HOURS</Text>
                            </View>
                            <View
                              style={{
                                display: 'flex',
                                borderBottom: '1px solid #000',
                                flexDirection: 'row',
                                fontSize: 9,
                                padding: 0,
                                width: '100%',
                                textAlign: 'center',
                              }}
                            >
                              <View
                                style={{
                                  fontSize: 9,
                                  padding: 2,
                                  width: '100%',
                                  textAlign: 'center',
                                  borderRight: '1px solid #000',
                                }}
                              >
                                <Text>REQ.</Text>
                              </View>

                              <View
                                style={{
                                  fontSize: 9,
                                  padding: 2,
                                  width: 120,
                                  textAlign: 'center',
                                }}
                              >
                                <Text>APPROVED</Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              borderBottom: '1px solid #000',
                              fontSize: 9,
                              padding: 2,
                              width: '100%',
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text>PURPOSE</Text>
                          </View>
                        </View>
                      </View>
                    ))}
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
