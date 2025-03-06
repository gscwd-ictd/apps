import { Modal } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { FunctionComponent } from 'react';
import DtrPdf from '../../pdf/DtrPdf';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { isEmpty } from 'lodash';

type DailyTimeRecordPdfModalProps = {
  printModalIsOpen: boolean;
  toggle: () => void;
  employeeData: EmployeeWithDetails;
};

const DailyTimeRecordPdfModal: FunctionComponent<DailyTimeRecordPdfModalProps> = ({
  printModalIsOpen,
  toggle,
  employeeData,
}) => {
  const { employeeDtr } = useDtrStore((state) => ({
    employeeDtr: state.employeeDtr,
  }));

  return (
    <>
      <Modal open={printModalIsOpen} setOpen={toggle} size={'full'} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">DTR Printable Document</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggle}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            {!isEmpty(employeeDtr) ? (
              <>
                <PDFDownloadLink
                  document={<DtrPdf employeeData={employeeData} employeeDtr={employeeDtr} />}
                  fileName={`${employeeData.fullName} DTR.pdf`}
                  className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {employeeData && employeeDtr ? 'Download PDF' : 'Loading...'}
                  {/* {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')} */}
                </PDFDownloadLink>

                <PDFViewer width={'100%'} height={1400} className="hidden md:block ">
                  <DtrPdf employeeData={employeeData} employeeDtr={employeeDtr} />
                </PDFViewer>
              </>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DailyTimeRecordPdfModal;
