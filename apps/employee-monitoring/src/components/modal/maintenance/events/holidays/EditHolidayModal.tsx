import { Modal } from '@gscwd-apps/oneui';
import { FunctionComponent } from 'react';
import { Holiday } from '../../../../../../src/utils/types/holiday.type';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Holiday;
};

const EditHolidayModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  return (
    <Modal open={modalState} setOpen={setModalState} steady size="sm">
      <Modal.Header withCloseBtn>
        <div className="flex justify-between w-full">
          <span className="text-2xl text-gray-600"></span>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeModalAction}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>{JSON.stringify(rowData)}</Modal.Body>
    </Modal>
  );
};

export default EditHolidayModal;
