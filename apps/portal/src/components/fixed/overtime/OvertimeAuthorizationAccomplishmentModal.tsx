/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import OvertimeAuthorizationPdf from './OvertimeAuthorizationPdf';
import OvertimeAuthorizationAccomplishmentPdf from './OvertimeAuthorizationAccomplishmentPdf';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeAuthorizationAccomplishmentModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ModalProps) => {
  const {
    selectedMonth,
    selectedPeriod,
    selectedYear,
    selectedEmployeeType,
    overtimeAuthorizationAccomplishmentReport,
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen,
    getOvertimeAuthorizationAccomplishmentReport,
    getOvertimeAuthorizationAccomplishmentReportSuccess,
    getOvertimeAuthorizationAccomplishmentReportFail,
    overtimeAuthorizationReport,
  } = useOvertimeStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedPeriod: state.selectedPeriod,
    selectedYear: state.selectedYear,
    selectedEmployeeType: state.selectedEmployeeType,
    overtimeAuthorizationAccomplishmentReport: state.overtimeAuthorizationAccomplishmentReport,
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen: state.pdfOvertimeAuthorizationAccomplishmentModalIsOpen,

    getOvertimeAuthorizationAccomplishmentReport: state.getOvertimeAuthorizationAccomplishmentReport,
    getOvertimeAuthorizationAccomplishmentReportSuccess: state.getOvertimeAuthorizationAccomplishmentReportSuccess,
    getOvertimeAuthorizationAccomplishmentReportFail: state.getOvertimeAuthorizationAccomplishmentReportFail,

    overtimeAuthorizationReport: state.overtimeAuthorizationReport,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  //get OT authorization details for pdf
  const overtimeAuthorizationAccomplishmentReportUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/reports/accomplishment/authorization/summary/${employeeDetails.user._id}/${selectedYear}/${selectedMonth}?half=${selectedPeriod}&nature_of_appointment=${selectedEmployeeType}`;

  const {
    data: swrOvertimeAuthorizationAccomplishmentReport,
    isLoading: swrOvertimeAuthorizationAccomplishmentReportIsLoading,
    error: swrOvertimeAuthorizationAccomplishmentReportError,
    mutate: mutateOvertimeAuthorizationReport,
  } = useSWR(
    pdfOvertimeAuthorizationAccomplishmentModalIsOpen ? overtimeAuthorizationAccomplishmentReportUrl : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeAuthorizationAccomplishmentReportIsLoading) {
      getOvertimeAuthorizationAccomplishmentReport(swrOvertimeAuthorizationAccomplishmentReportIsLoading);
    }
  }, [swrOvertimeAuthorizationAccomplishmentReportIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeAuthorizationAccomplishmentReport)) {
      getOvertimeAuthorizationAccomplishmentReportSuccess(
        swrOvertimeAuthorizationAccomplishmentReportIsLoading,
        swrOvertimeAuthorizationAccomplishmentReport
      );
    }

    if (!isEmpty(swrOvertimeAuthorizationAccomplishmentReportError)) {
      getOvertimeAuthorizationAccomplishmentReportFail(
        swrOvertimeAuthorizationAccomplishmentReportIsLoading,
        swrOvertimeAuthorizationAccomplishmentReportError.message
      );
    }
  }, [swrOvertimeAuthorizationAccomplishmentReport, swrOvertimeAuthorizationAccomplishmentReportError]);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Authorization-Accomplishment Report</span>
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
          {!isEmpty(swrOvertimeAuthorizationAccomplishmentReport) ? (
            <div className="text-center">
              <PDFDownloadLink
                document={
                  <OvertimeAuthorizationAccomplishmentPdf
                    overtimeAuthorizationAccomplishmentReport={overtimeAuthorizationAccomplishmentReport}
                    selectedEmployeeType={selectedEmployeeType}
                  />
                }
                fileName={`${overtimeAuthorizationReport.plannedDate} Overtime Authorization.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink>

              <PDFViewer width={'100%'} height={1000} showToolbar className="hidden md:block ">
                <OvertimeAuthorizationAccomplishmentPdf
                  overtimeAuthorizationAccomplishmentReport={overtimeAuthorizationAccomplishmentReport}
                  selectedEmployeeType={selectedEmployeeType}
                />
              </PDFViewer>
            </div>
          ) : (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
            </div>
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

export default OvertimeAuthorizationAccomplishmentModal;
