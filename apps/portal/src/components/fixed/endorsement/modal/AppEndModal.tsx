/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { FunctionComponent } from 'react';
import { AppEndModalController } from '../AppEndListController';

const AppEndModal: FunctionComponent = () => {
  const {
    modal,
    alert,
    selectedApplicants,
    setModal,
    setAlert,
    setAction,
    setSelectedApplicants,
  } = useAppEndStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    alert: state.alert,
    setAlert: state.setAlert,
    selectedApplicants: state.selectedApplicants,
    setAction: state.setAction,
    setSelectedApplicants: state.setSelectedApplicants,
  }));

  // open the modal
  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

  // confirm action for main modal
  const modalAction = async () => {
    if (modal.page === 2) setAlert({ ...alert, isOpen: true, page: 1 });
  };

  // cancel action for modal
  const modalCancel = async () => {
    if (modal.page === 1) {
      setModal({ ...modal, isOpen: false });
    } else if (modal.page === 2) {
      setModal({ ...modal, page: 1 });
      setSelectedApplicants([]);
    } else if (modal.page === 3) {
      setModal({ ...modal, page: 1 });
      setAction('');
    }
  };

  return (
    <Modal
      open={modal.isOpen}
      setOpen={openModal}
      size={
        modal.page === 1
          ? 'md'
          : modal.page === 3
          ? 'md'
          : modal.page === 4
          ? 'sm'
          : 'xl'
      }
      steady
    >
      <Modal.Header>
        <h3 className="text-xl font-semibold text-gray-700">
          <div className="px-5">
            {modal.page === 1
              ? 'Select an endorsement'
              : modal.page === 3
              ? 'Endorsement Summary'
              : 'Endorsement'}
          </div>
        </h3>
      </Modal.Header>
      <Modal.Body>
        <AppEndModalController page={modal.page} />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          {modal.page !== 4 ? (
            <div className="w-[6rem]">
              <Button variant="info" onClick={modalCancel}>
                {modal.page === 1 ? 'Close' : 'Cancel'}
              </Button>
            </div>
          ) : null}
          {modal.page !== 1 && modal.page !== 3 && (
            <div className="min-w-[6rem] max-w-auto">
              <Button
                onClick={modalAction}
                disabled={modal.page === 2 && selectedApplicants.length < 1}
              >
                {modal.page !== 4 ? 'Confirm' : 'Got it, Thanks!'}
              </Button>
            </div>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AppEndModal;
