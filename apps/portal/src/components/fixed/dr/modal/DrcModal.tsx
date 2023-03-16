/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { FunctionComponent } from 'react';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const DrcModal: FunctionComponent = () => {
  const {
    action,
    modal,
    setModal,
    setModalAction,
    openModal,
    closeModal,
    setModalPage,
  } = useModalStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    action: state.modalAction,
    openModal: state.openModal,
    closeModal: state.closeModal,
    setModalAction: state.setModalAction,
    setModalPage: state.setModalPage,
  }));

  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));

  return (
    <>
      <Modal
        open={modal.isOpen}
        setOpen={() => setModal({ ...modal })}
        steady
        size="xl"
      >
        <Modal.Header>
          <div className="flex justify-between w-full">
            <div className="flex">
              <h3 className="text-xl font-semibold text-gray-700">
                {modal.page === 6
                  ? 'Setting Successful'
                  : 'Set Duties, Responsibilities, and Competencies'}
              </h3>
              <p>
                {modal.page === 1
                  ? 'Select a position title'
                  : modal.page === 2
                  ? 'Add core or support'
                  : modal.page === 3
                  ? `${selectedPosition.positionTitle}`
                  : modal.page === 4 && 'Position Summary'}
              </p>
            </div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {modal.isOpen && modal.page === 1 && 'Open and Page is 1'}
          {modal.isOpen && modal.page === 2 && 'Open and Page is 2'}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2">
            <Button onClick={() => setModalPage(modal.page - 1)}>
              Prev Page
            </Button>
            <Button onClick={() => setModalPage(modal.page + 1)}>
              Next Page
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrcModal;
