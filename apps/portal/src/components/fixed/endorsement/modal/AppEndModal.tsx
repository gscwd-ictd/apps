/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { Pds } from 'apps/pds/src/store/pds.store';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { FunctionComponent, useEffect } from 'react';
import { AppEndModalController } from '../AppEndListController';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

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

  const { windowWidth } = UseWindowDimensions();

  return (
    <Modal
      open={modal.isOpen}
      setOpen={openModal}
      size={
        windowWidth > 1024
          ? modal.page === 1
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
          : 'full'
      }
      steady
    >
      <Modal.Header>
        <div className="flex w-full justifty-between">
          <div className="flex flex-col px-5 w-full">
            <h3 className="text-xl  font-semibold text-gray-700 md:text-2xl">
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
          <i
            className="bx bx-x text-2xl"
            role="button"
            onClick={modalCancel}
          ></i>
        </div>
      </Modal.Header>
      <Modal.Body>
        <AppEndModalController page={modal.page} />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          {modal.page !== 4 ? (
            <button
              onClick={modalCancel}
<<<<<<< HEAD
              className="w-[6rem] disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-gray-200 focus:bg-gray-100 hover:shadow-lg  active:shadow-md active:ring-0 active:scale-95"
=======
              className="w-[6rem] disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
>>>>>>> 3a130322bebcc901d48e518732cbe747057ea8c8
            >
              {modal.page === 1 ? 'Close' : 'Cancel'}
            </button>
          ) : null}
          {modal.page !== 1 && modal.page !== 3 && (
            <button
              onClick={modalAction}
              disabled={modal.page === 2 && selectedApplicants.length < 1}
              className="min-w-[6rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
            >
              {modal.page !== 4 ? 'Confirm' : 'Got it, Thanks!'}
            </button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AppEndModal;
