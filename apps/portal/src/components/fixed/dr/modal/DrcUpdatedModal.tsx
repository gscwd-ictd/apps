/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useAlertConfirmationStore } from 'apps/portal/src/store/alert.store';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { isEqual } from 'lodash';
import { FunctionComponent } from 'react';
import { UpdatedCompetencyChecker, UpdatedDrcChecker } from '../utils/functions';
import { DrcModalController } from './DrcModalController';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';

const DrcUpdatedModal: FunctionComponent = () => {
  // use modal store
  const { modal, action, setModal, closeModal, nextPage, prevPage, openModal, setModalAction, setModalPage } =
    useModalStore((state) => ({
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

  // use dnr store
  // const {
  //   selectedDnrs,
  //   selectedDnrsOnLoad,
  //   selectedDrcType,
  //   checkedDnrs,
  //   cancelCheckedDnrsAction,
  //   cancelDrcPage,
  //   addCheckedToSelectedDnrs,
  // } = useDnrStore((state) => ({
  //   selectedDnrs: state.selectedDnrs,
  //   selectedDnrsOnLoad: state.selectedDnrsOnLoad,
  //   selectedDrcType: state.selectedDrcType,
  //   checkedDnrs: state.checkedDnrs,
  //   cancelCheckedDnrsAction: state.cancelCheckedDnrsAction,
  //   cancelDrcPage: state.cancelDrcPage,
  //   addCheckedToSelectedDnrs: state.addCheckedToSelectedDnrs,
  // }));

  // use updated drc store
  const {
    addedDrcs,
    initialDrcsOnLoad,
    selectedDrcType,
    tempAddedDrcs,
    cancelTempDrcsAction,
    cancelDrcPage,
    addTempToAddedDrcs,
  } = useUpdatedDrcStore((state) => ({
    addedDrcs: state.addedDrcs,
    initialDrcsOnLoad: state.initialDrcsOnLoad,
    selectedDrcType: state.selectedDrcType,
    tempAddedDrcs: state.tempAddedDrcs,
    cancelTempDrcsAction: state.cancelTempDrcsAction,
    cancelDrcPage: state.cancelDrcPage,
    addTempToAddedDrcs: state.addTempToAddedDrcs,
  }));

  // use position store
  const { selectedPosition, emptySelectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
    emptySelectedPosition: state.emptySelectedPosition,
  }));

  // use alert confirmation store
  const confOpen = useAlertConfirmationStore((state) => state.setOpen);

  // close drc modal
  const closeDrcModal = () => {
    emptySelectedPosition();
    closeModal();
    cancelDrcPage();
  };

  // confirm action modal
  const actionBtn = () => {
    // put your logic here

    if (modal.page === 2) {
      setModalPage(4);
    } else if (modal.page === 3) {
      // addCheckedToSelectedDnrs();
      addTempToAddedDrcs();
      setModalPage(2);
    } else if (modal.page === 4) {
      confOpen();
    }
    // nextPage();
  };

  // cancel
  const cancelBtn = () => {
    // put your logic here
    if (modal.page === 1) closeModal();
    else if (modal.page === 2) {
      emptySelectedPosition();
      cancelDrcPage();
      prevPage();
    } else if (modal.page === 3) {
      // cancelCheckedDnrsAction();
      cancelTempDrcsAction();
      prevPage();
    } else if (modal.page === 4) setModalPage(2);
  };

  // validate confirm action button
  const validateConfirmActionBtn = () => {
    if (
      modal.page === 2 &&
      (UpdatedDrcChecker(addedDrcs).noPercentageCounter > 0 ||
        UpdatedDrcChecker(addedDrcs).onEditCounter > 0 ||
        (addedDrcs.core.length === 0 && addedDrcs.support.length === 0) ||
        (addedDrcs.core.length > 0 &&
          (UpdatedDrcChecker(addedDrcs).coreTotal < 100 || UpdatedDrcChecker(addedDrcs).coreTotal > 100)) ||
        UpdatedDrcChecker(addedDrcs).noCompetencyCounter > 0 ||
        (addedDrcs.support.length > 0 &&
          (UpdatedDrcChecker(addedDrcs).supportTotal < 100 || UpdatedDrcChecker(addedDrcs).supportTotal > 100)) ||
        isEqual(addedDrcs, initialDrcsOnLoad) === true)
    )
      return true;
    else if (
      modal.page === 3 &&
      selectedDrcType === 'core' &&
      (tempAddedDrcs.core.length === 0 ||
        (tempAddedDrcs.core.length > 0 &&
          UpdatedCompetencyChecker(tempAddedDrcs, selectedDrcType).noCoreCompetencyCounter > 0))
    )
      return true;
    else if (
      modal.page === 3 &&
      selectedDrcType === 'support' &&
      (tempAddedDrcs.support.length === 0 ||
        (tempAddedDrcs.support.length > 0 &&
          UpdatedCompetencyChecker(tempAddedDrcs, selectedDrcType).noSupportCompetencyCounter > 0))
    )
      return true;
    else return false;
  };

  // window dimension
  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        open={modal.isOpen}
        setOpen={() => setModal({ ...modal })}
        steady
        size={`${windowWidth > 1024 ? 'xl' : 'full'}`}
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-full px-5">
              <h3 className="text-xl font-semibold text-gray-700 md:text-2xl">
                {modal.page === 6 ? 'Setting Successful' : 'Set Duties, Responsibilities, and Competencies'}
              </h3>
              <div className="text-gray-500">
                {modal.page === 1 ? (
                  'Select a position title'
                ) : modal.page === 2 ? (
                  'Add core or support'
                ) : modal.page === 3 ? (
                  <div className="flex">
                    <div className="flex flex-col w-full">
                      <div>{selectedPosition.positionTitle}</div>
                      <div className="text-xs text-gray-600">{selectedPosition.designation}</div>
                    </div>
                    <div className="flex items-end justify-end w-full">
                      <div>
                        {selectedDrcType === 'core' ? (
                          <span>{tempAddedDrcs.core.length === 0 ? 'None' : tempAddedDrcs.core.length} assigned</span>
                        ) : (
                          <span>
                            {tempAddedDrcs.support.length === 0 ? 'None' : tempAddedDrcs.support.length} assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  modal.page === 4 && 'Position Summary'
                )}
              </div>
            </div>

            <i className="text-2xl bx bx-x" role="button" onClick={closeDrcModal} tabIndex={-1}></i>
          </div>
        </Modal.Header>
        <Modal.Body>
          <DrcModalController />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <button
              onClick={cancelBtn}
              className="w-[6rem] disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
            >
              {modal.page === 1 ? 'Close' : modal.page === 2 ? 'Cancel' : 'Previous'}
            </button>
            {modal.page !== 1 ? (
              <button
                onClick={actionBtn}
                disabled={validateConfirmActionBtn()}
                className="min-w-[6rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
              >
                Confirm
              </button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrcUpdatedModal;
