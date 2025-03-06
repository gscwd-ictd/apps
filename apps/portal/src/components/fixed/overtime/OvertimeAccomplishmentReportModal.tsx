/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal, PdfHeader } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import OvertimeAccomplishmentReportPdf from './OvertimeAccomplishmentReportPdf';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeAccomplishmentReportModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
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
          {!isEmpty(swrOvertimeAccomplishmentReport) && !isEmpty(overtimeAccomplishmentReport) ? (
            <div className="text-center">
              <PDFDownloadLink
                document={
                  <OvertimeAccomplishmentReportPdf overtimeAccomplishmentReport={overtimeAccomplishmentReport} />
                }
                fileName={`${overtimeAccomplishmentReport.employeeName} ${overtimeAccomplishmentReport.date} Overtime Accomplishment.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink>

              <PDFViewer width={'100%'} height={1000} showToolbar className="hidden md:block ">
                <OvertimeAccomplishmentReportPdf overtimeAccomplishmentReport={overtimeAccomplishmentReport} />
              </PDFViewer>
            </div>
          ) : (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                speed={70}
                thickness={70}
                className="w-full flex h-full transition-all "
                color="slateblue"
                size={100}
              /> */}
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

export default OvertimeAccomplishmentReportModal;
