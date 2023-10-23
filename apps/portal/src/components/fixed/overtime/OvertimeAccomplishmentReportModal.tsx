/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
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
  hrd: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    fontSize: 8,
  },
  flexRowJustifyBetween: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: 9,
    padding: 10,
    marginTop: 10,
  },
  flexColumnJustifyBetween: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 'auto',
  },
  checkbox: {
    width: 15,
    height: 10,
    border: '1px solid #000',
    textAlign: 'center',
  },
  checkboxFlex: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 9,
    padding: 10,
    gap: 1,
  },
  checkboxLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 2,
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

export const OvertimeAccomplishmentReportModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName,
    accomplishmentDetails,
    getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  // const { windowWidth } = UseWindowDimensions();

  // const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${overtimeAccomplishmentEmployeeId}/${overtimeAccomplishmentApplicationId}/details`;

  // const {
  //   data: swrOvertimeAccomplishment,
  //   isLoading: swrOvertimeAccomplishmentIsLoading,
  //   error: swrOvertimeAccomplishmentError,
  //   mutate: mutateOvertimeAccomplishments,
  // } = useSWR(overtimeAccomplishmentUrl, fetchWithToken, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrOvertimeAccomplishmentIsLoading) {
  //     getAccomplishmentDetails(swrOvertimeAccomplishmentIsLoading);
  //   }
  // }, [swrOvertimeAccomplishmentIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrOvertimeAccomplishment)) {
  //     getAccomplishmentDetailsSuccess(swrOvertimeAccomplishmentIsLoading, swrOvertimeAccomplishment);
  //   }

  //   if (!isEmpty(swrOvertimeAccomplishmentError)) {
  //     getAccomplishmentDetailsFail(swrOvertimeAccomplishmentIsLoading, swrOvertimeAccomplishmentError.message);
  //   }
  // }, [swrOvertimeAccomplishment, swrOvertimeAccomplishmentError]);

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
                    <View style={styles.hrd}>
                      <Text>HRD-010-2</Text>
                    </View>
                    <View style={styles.headerMain}>
                      <Image style={{ width: 50 }} src={'/gwdlogo.png'} />
                      <View style={styles.header}>
                        <Text>Republic of the Philippines</Text>
                        <Text>GENERAL SANTOS WATER DISTRICT</Text>
                        <Text>E. Ferdnandez St., Lagao General Santos City</Text>
                        <Text>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
                        <Text>Email Address: gscwaterdistrict@yahoo.com</Text>
                      </View>
                    </View>
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
                          width: 275,
                        }}
                      >
                        {employeeDetails.employmentDetails.assignment.name}
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

export default OvertimeAccomplishmentReportModal;
