/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { Pds } from 'apps/pds/src/store/pds.store';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { FunctionComponent, useEffect } from 'react';
import { AppEndModalController } from '../AppEndListController';

const AppEndModal: FunctionComponent = () => {
  const {
    modal,
    alert,
    showPds,
    selectedApplicants,
    setModal,
    setAlert,
    setAction,
    setSelectedApplicants,
    setSelectedApplicantDetails,
    setShowPds,
    setPds,
  } = useAppEndStore((state) => ({
    modal: state.modal,
    showPds: state.showPds,
    setModal: state.setModal,
    alert: state.alert,
    setAlert: state.setAlert,
    selectedApplicants: state.selectedApplicants,
    setAction: state.setAction,
    setSelectedApplicants: state.setSelectedApplicants,
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
    setShowPds: state.setShowPds,
    setPds: state.setPds,
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
      setSelectedApplicantDetails({});
      setPds({} as Pds);
      setModal({ ...modal, page: 1 });
      setShowPds(false);
      setSelectedApplicants([]);
    } else if (modal.page === 3) {
      setSelectedApplicantDetails({});
      setPds({} as Pds);
      setModal({ ...modal, page: 1 });
      setShowPds(false);
      setAction('');
    }
  };

  useEffect(() => {
    if (modal.isOpen === false) {
      setShowPds(false);
      setPds({} as Pds);
    }
  }, [modal]);

  return (
    <Modal
      open={modal.isOpen}
      setOpen={openModal}
      size={
        modal.page === 1
          ? 'lg'
          : modal.page === 2 && !showPds
          ? 'full'
          : modal.page === 2 && showPds
          ? 'full'
          : modal.page === 3 && !showPds
          ? 'md'
          : modal.page === 3 && showPds
          ? 'lg'
          : 'md'
      }
      steady
    >
      <Modal.Header>
        <div className="flex w-full px-5 justifty-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              {modal.page === 1
                ? 'Applicant Endorsement'
                : modal.page === 2
                ? 'Endorsed Applicants'
                : modal.page === 3
                ? 'Endorsement Summary'
                : null}
            </h3>
            <p className="text-gray-500">
              {modal.page === 1
                ? 'Select an endorsement'
                : modal.page === 2
                ? 'Select from the list of endorsed applicants'
                : null}
            </p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <AppEndModalController page={modal.page} />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          {modal.page !== 4 ? (
            <Button variant="info" onClick={modalCancel} className="w-[6rem]">
              {modal.page === 1 ? 'Close' : 'Cancel'}
            </Button>
          ) : null}
          {modal.page !== 1 && modal.page !== 3 && (
            <Button
              onClick={modalAction}
              disabled={modal.page === 2 && selectedApplicants.length < 1}
              className="min-w-[6rem] max-w-auto"
            >
              {modal.page !== 4 ? 'Confirm' : 'Got it, Thanks!'}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AppEndModal;
