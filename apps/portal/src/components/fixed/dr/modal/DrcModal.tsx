/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { isEqual } from 'lodash';
import { FunctionComponent } from 'react';
import { CompetencyChecker, DrcChecker } from '../utils/functions';
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

  const {
    selectedDnrs,
    selectedDnrsOnLoad,
    selectedDrcType,
    checkedDnrs,
    cancelCheckedDnrsAction,
    cancelDrcPage,
    addCheckedToSelectedDnrs,
  } = useDnrStore((state) => ({
    selectedDnrs: state.selectedDnrs,
    selectedDnrsOnLoad: state.selectedDnrsOnLoad,
    selectedDrcType: state.selectedDrcType,
    checkedDnrs: state.checkedDnrs,
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
      setModalPage(4);
    } else if (modal.page === 3) {
      addCheckedToSelectedDnrs();
      setModalPage(2);
    }
    // nextPage();
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
    } else if (modal.page === 4) setModalPage(2);
  };

  // validate confirm action button
  const validateConfirmActionBtn = () => {
    if (
      modal.page === 2 &&
      (DrcChecker(selectedDnrs).noPercentageCounter > 0 ||
        DrcChecker(selectedDnrs).onEditCounter > 0 ||
        (selectedDnrs.core.length === 0 && selectedDnrs.support.length === 0) ||
        (selectedDnrs.core.length > 0 &&
          (DrcChecker(selectedDnrs).coreTotal < 100 ||
            DrcChecker(selectedDnrs).coreTotal > 100)) ||
        DrcChecker(selectedDnrs).noCompetencyCounter > 0 ||
        (selectedDnrs.support.length > 0 &&
          (DrcChecker(selectedDnrs).supportTotal < 100 ||
            DrcChecker(selectedDnrs).supportTotal > 100)) ||
        isEqual(selectedDnrs, selectedDnrsOnLoad) === true)
    )
      return true;
    else if (
      modal.page === 3 &&
      selectedDrcType === 'core' &&
      (checkedDnrs.core.length === 0 ||
        (checkedDnrs.core.length > 0 &&
          CompetencyChecker(checkedDnrs, selectedDrcType)
            .noCoreCompetencyCounter > 0))
    )
      return true;
    else if (
      modal.page === 3 &&
      selectedDrcType === 'support' &&
      (checkedDnrs.support.length === 0 ||
        (checkedDnrs.support.length > 0 &&
          CompetencyChecker(checkedDnrs, selectedDrcType)
            .noSupportCompetencyCounter > 0))
    )
      return true;
    else return false;
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
              <Button onClick={actionBtn} disabled={validateConfirmActionBtn()}>
                Confirm
              </Button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrcModal;
