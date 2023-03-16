/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { FunctionComponent } from 'react';
import { DrcModalController } from './DrcModalController';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const DrcModal: FunctionComponent = () => {
  const { modal, setModal, closeModal, nextPage, prevPage } = useModalStore(
    (state) => ({
      modal: state.modal,
      setModal: state.setModal,
      action: state.modalAction,
      openModal: state.openModal,
      closeModal: state.closeModal,
      setModalAction: state.setModalAction,
      nextPage: state.nextPage,
      prevPage: state.prevPage,
    })
  );

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
            <div>
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
          <DrcModalController />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2">
            <Button onClick={prevPage}>Prev Page</Button>
            <Button onClick={nextPage}>Next Page</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrcModal;
