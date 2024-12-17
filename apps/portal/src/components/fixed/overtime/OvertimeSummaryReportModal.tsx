/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import OvertimeSummaryReportPdf from './OvertimeSummaryReportPdf';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeSummaryReportModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
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
          {!isEmpty(swrOvertimeSummary) && !isEmpty(overtimeSummaryReport) ? (
            <div className="text-center">
              {/* <PDFDownloadLink
                document={
                  <OvertimeSummaryReportPdf
                    selectedMonth={selectedMonth}
                    selectedPeriod={selectedPeriod}
                    selectedEmployeeType={selectedEmployeeType}
                    overtimeSummaryReport={overtimeSummaryReport}
                  />
                }
                fileName={`${UseCapitalizer(
                  selectedEmployeeType
                )} ${selectedMonth}-${selectedYear} Overtime Summary.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
              </PDFDownloadLink> */}

              <PDFViewer width={'100%'} height={1000} showToolbar className="hidden md:block ">
                <OvertimeSummaryReportPdf
                  selectedMonth={selectedMonth}
                  selectedPeriod={selectedPeriod}
                  selectedEmployeeType={selectedEmployeeType}
                  overtimeSummaryReport={overtimeSummaryReport}
                />
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

export default OvertimeSummaryReportModal;
