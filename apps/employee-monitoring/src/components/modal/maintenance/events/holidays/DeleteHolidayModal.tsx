import { Modal } from '@gscwd-apps/oneui';
import { FunctionComponent } from 'react';
import { Holiday } from '../../../../../../src/utils/types/holiday.type';

type DeleteHolidayModal = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Holiday;
};

const EditHolidayModal: FunctionComponent<DeleteHolidayModal> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  return (
    <Modal open={modalState} setOpen={setModalState} steady size="xs">
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
      <Modal.Body>
        <p className="text-sm text-center">
          Are you sure you want to delete entry {JSON.stringify(rowData.name)}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
            // onClick={() => openEditActionModal(rowData)}
          >
            Confirm
          </button>

          <button
            type="button"
            className="text-white bg-red-700 hover:bg-blue-800 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
            onClick={closeModalAction}
          >
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditHolidayModal;
