/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import NightDifferentialReportPdf from './NightDifferentialReportPdf';
import { postApiPortal, postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { NightDifferentialEmployee } from 'apps/portal/src/types/employee.type';

type ModalProps = {
  modalState: boolean;
  selectedEmployees?: Array<SelectOption>;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const NightDifferentialReportModal = ({
  modalState,
  selectedEmployees,
  setModalState,
  closeModalAction,
}: ModalProps) => {
  const {
    selectedMonth,
    selectedYear,
    selectedPeriod,
    nightDiffEmployees,
    nightDifferentialReport,
    getNightDifferentialReport,
    getNightDifferentialReportSuccess,
    getNightDifferentialReportFail,
  } = useOvertimeStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    selectedPeriod: state.selectedPeriod,
    nightDiffEmployees: state.nightDiffEmployees,
    selectedEmployeeType: state.selectedEmployeeType,
    nightDifferentialReport: state.nightDifferentialReport,
    getNightDifferentialReport: state.getNightDifferentialReport,
    getNightDifferentialReportSuccess: state.getNightDifferentialReportSuccess,
    getNightDifferentialReportFail: state.getNightDifferentialReportFail,
  }));

  const [selectedEmployeesForReport, setSelectedEmployeesForReport] = useState<Array<NightDifferentialEmployee>>([]);
  const nightDifferentialReportUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/reports/night-differential/${selectedYear}/${selectedMonth}?nature_of_appointment=permanent&half=${selectedPeriod}`;

  //post request in getting night differential report
  const handlePostNightDiff = async () => {
    getNightDifferentialReport(true);

    const { error, result } = await postApiPortal(
      `reports/night-differential/${selectedYear}/${selectedMonth}?nature_of_appointment=permanent&half=${selectedPeriod}`,
      { employees: selectedEmployeesForReport }
    );
    if (error) {
      getNightDifferentialReportFail(false, result);
    } else {
      getNightDifferentialReportSuccess(false, result);
    }
  };

  useEffect(() => {
    if (modalState && selectedEmployees && selectedEmployees.length > 0) {
      handlePostNightDiff();
    }
  }, [modalState]);

  //filter original night diff employees array based on selected employees from the multiselect
  useEffect(() => {
    const selectedEmployeesIds = selectedEmployees.map((item) => item.value);
    const newSelectedEmployees = nightDiffEmployees.filter((item) => selectedEmployeesIds.includes(item.employeeId));
    setSelectedEmployeesForReport(newSelectedEmployees);
  }, [selectedEmployees]);

  return (
    <>
      <Modal size={`full`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Night Shift Differential Pay Report</span>
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
          {!isEmpty(nightDifferentialReport) ? (
            <div className="text-center">
              <PDFDownloadLink
                document={
                  <NightDifferentialReportPdf
                    selectedMonth={selectedMonth}
                    selectedPeriod={selectedPeriod}
                    nightDifferentialReport={nightDifferentialReport}
                  />
                }
                fileName={`${selectedMonth}-${selectedYear} Night Shift Differential Pay.pdf`}
                className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                {nightDifferentialReport && selectedPeriod && selectedMonth ? 'Download PDF' : 'Loading...'}
                {/* {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')} */}
              </PDFDownloadLink>

              <PDFViewer width={'100%'} height={1000} showToolbar className="hidden md:block ">
                <NightDifferentialReportPdf
                  selectedMonth={selectedMonth}
                  selectedPeriod={selectedPeriod}
                  nightDifferentialReport={nightDifferentialReport}
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

export default NightDifferentialReportModal;
