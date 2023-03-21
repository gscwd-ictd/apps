/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { FunctionComponent } from 'react';
import { DrcModalController } from './DrcModalController';

const DrcModal: FunctionComponent = () => {
  const {
    modal,
    action,
    setModal,
    closeModal,
    nextPage,
    prevPage,
    openModal,
    setModalAction,
    setModalPage,
  } = useModalStore((state) => ({
    modal: state.modal,
    action: state.modalAction,
    setModal: state.setModal,
    setModalPage: state.setModalPage,
    openModal: state.openModal,
    closeModal: state.closeModal,
    setModalAction: state.setModalAction,
    nextPage: state.nextPage,
    prevPage: state.prevPage,
  }));

  const { cancelCheckedDnrsAction, cancelDrcPage, addCheckedToSelectedDnrs } =
    useDnrStore((state) => ({
      cancelCheckedDnrsAction: state.cancelCheckedDnrsAction,
      cancelDrcPage: state.cancelDrcPage,
      addCheckedToSelectedDnrs: state.addCheckedToSelectedDnrs,
    }));

  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));

  // close drc modal
  const closeDrcModal = () => {
    closeModal();
    cancelDrcPage();
  };

  // confirm action modal
  const actionBtn = () => {
    // put your logic here

    if (modal.page === 2) {
      //logic for submit here
    } else if (modal.page === 3) {
      addCheckedToSelectedDnrs();
    }
    nextPage();
  };

  const cancelBtn = () => {
    // put your logic here
    if (modal.page === 1) closeModal();
    else if (modal.page === 2) {
      cancelDrcPage();
      prevPage();
    } else if (modal.page === 3) {
      cancelCheckedDnrsAction();
      prevPage();
    }
  };

  return (
    <>
      <Modal
        open={modal.isOpen}
        setOpen={() => setModal({ ...modal })}
        steady
        size="xl"
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full px-5">
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
              className="text-gray-400"
              onClick={closeDrcModal}
            >
              x<span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <DrcModalController />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button onClick={cancelBtn}>
              {modal.page === 1 ? 'Close' : 'Cancel'}
            </Button>
            {modal.page !== 1 ? (
              <Button onClick={actionBtn}>Confirm</Button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrcModal;
