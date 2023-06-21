import { Modal } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { FunctionComponent } from 'react';
import DtrPdf from '../../pdf/DtrPdf';

type EmployeeAssignment = {
  id: string;
  name: string;
  positionId: string;
  positionTitle: string;
};

type EmployeeData = {
  assignment: EmployeeAssignment;
  companyId: string;
  fullName: string;
  isHRMPSB: number;
  photoUrl: string;
  userId: string;
  userRole: string;
};

type DailyTimeRecordPdfModalProps = {
  printModalIsOpen: boolean;
  toggle: () => void;
  employeeData: EmployeeData;
};

const DailyTimeRecordPdfModal: FunctionComponent<
  DailyTimeRecordPdfModalProps
> = ({ printModalIsOpen, toggle, employeeData }) => {
  const { employeeDtr } = useDtrStore((state) => ({
    employeeDtr: state.employeeDtr,
  }));

  return (
    <>
      <Modal open={printModalIsOpen} setOpen={toggle} size={'full'} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">
              DTR Printable Document
            </span>
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
          <div>
            <DtrPdf employeeData={employeeData} employeeDtr={employeeDtr} />
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
