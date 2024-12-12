/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import OvertimeAuthorizationPdf from './OvertimeAuthorizationPdf';
import { SpinnerDotted } from 'spinners-react';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeAuthorizationModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    pdfOvertimeAuthorizationModalIsOpen,
    overtimeAuthorizationReport,
    getOvertimeAuthorizationReport,
    getOvertimeAuthorizationReportSuccess,
    getOvertimeAuthorizationReportFail,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    pdfOvertimeAuthorizationModalIsOpen: state.pdfOvertimeAuthorizationModalIsOpen,
    overtimeAuthorizationReport: state.overtimeAuthorizationReport,
    getOvertimeAuthorizationReport: state.getOvertimeAuthorizationReport,
    getOvertimeAuthorizationReportSuccess: state.getOvertimeAuthorizationReportSuccess,
    getOvertimeAuthorizationReportFail: state.getOvertimeAuthorizationReportFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  //get OT authorization details for pdf
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
          {!isEmpty(swrOvertimeAuthorizationReport) && !isEmpty(overtimeAuthorizationReport) ? (
            <div className="text-center">
              {/* <PDFDownloadLink
                document={<OvertimeAuthorizationPdf overtimeAuthorizationReport={overtimeAuthorizationReport} />}
                fileName={`${overtimeAuthorizationReport.plannedDate} Overtime Authorization.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink> */}

              <PDFViewer width={'100%'} height={1000} showToolbar className="hidden md:block ">
                <OvertimeAuthorizationPdf overtimeAuthorizationReport={overtimeAuthorizationReport} />
              </PDFViewer>
            </div>
          ) : (
            <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
              <SpinnerDotted
                speed={70}
                thickness={70}
                className="w-full flex h-full transition-all "
                color="slateblue"
                size={100}
              />
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

export default OvertimeAuthorizationModal;
