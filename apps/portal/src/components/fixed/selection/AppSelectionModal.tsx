/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { AppSelectionModalController } from './AppSelectionListController';
import { useAppSelectionStore } from '../../../../src/store/selection.store';
import { Publication, PublicationPostingStatus } from '../../../../src/types/publication.type';
import { isEmpty } from 'lodash';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect } from 'react';

export const AppSelectionModal = () => {
  const publicationDetails = useAppSelectionStore((state) => state.publicationDetails);

  // get state for the modal
  const {
    tab,
    publicationList,
    fulfilledPublicationList,

    modal,
    selectedApplicants,
    selectedPublication,
    setFilteredPublicationList,
    setModal,
    setAlertConfirmationIsOpen,
    setFilteredValue,
    setSelectedApplicants,
  } = useAppSelectionStore((state) => ({
    tab: state.tab,
    publicationList: state.publicationList,
    fulfilledPublicationList: state.fulfilledPublicationList,
    modal: state.modal,
    setFilteredPublicationList: state.setFilteredPublicationList,
    setModal: state.setModal,
    setAlertConfirmationIsOpen: state.setAlertConfirmationIsOpen,
    selectedApplicants: state.selectedApplicants,
    selectedPublication: state.selectedPublication,
    setSelectedApplicants: state.setSelectedApplicants,
    setFilteredValue: state.setFilteredValue,
  }));

  // confirm action for modal
  const modalAction = async () => {
    if (modal.page === 2) {
      setAlertConfirmationIsOpen(true);
    }
  };

  // close modal action
  const closeModalFunction = () => {
    setFilteredValue('');
    setSelectedApplicants([]);
    setModal({ ...modal, isOpen: false, page: 1 });
  };

  const { windowWidth } = UseWindowDimensions();

  useEffect(() => {
    if (tab === 1) {
      if (publicationList.length > 0) {
        setFilteredPublicationList(publicationList);
      } else {
        setFilteredPublicationList([] as Array<Publication>);
      }
    } else {
      setFilteredPublicationList(fulfilledPublicationList);
    }
  }, [fulfilledPublicationList, modal.isOpen, publicationList, tab]);

  return (
    <>
      <Modal
        open={modal.isOpen}
        setOpen={() => setModal({ ...modal })}
        size={windowWidth > 1024 ? (modal.page === 2 ? 'xl' : 'lg') : 'full'}
        steady
      >
        <Modal.Header>
          <div className="w-full flex justify-between">
            <h3 className="px-5 font-semibold text-gray-700 flex flex-col w-full ">
              <div className=" text-2xl">Appointing Authority Selection</div>
              <div className="text-md font-normal text-gray-500">
                {modal.page === 1
                  ? 'Select a publication'
                  : modal.page === 2 &&
                    !isEmpty(selectedPublication) &&
                    selectedPublication.postingStatus === PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION
                  ? 'Select Applicant/s'
                  : modal.page === 2 &&
                    !isEmpty(selectedPublication) &&
                    selectedPublication.postingStatus === PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE
                  ? 'Selection Done'
                  : null}
              </div>
            </h3>
            <i role="button" className="bx bx-x text-2xl" onClick={closeModalFunction}></i>
          </div>
        </Modal.Header>

        <Modal.Body>
          <AppSelectionModalController page={modal.page} />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {modal.page !== 4 ? (
              <button
                className="w-[6rem]  disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
                onClick={closeModalFunction}
              >
                {modal.page === 1 ? 'Close' : 'Cancel'}
              </button>
            ) : null}
            {modal.page !== 1 &&
              modal.page !== 3 &&
              (publicationDetails?.positionDetails?.postingStatus ===
              PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION ? (
                <button
                  onClick={modalAction}
                  disabled={
                    modal.page === 2 &&
                    selectedApplicants.length > 0 &&
                    selectedApplicants.length > parseInt(selectedPublication.numberOfPositions!)
                      ? true
                      : false
                    //change conditions to allow selection of applicants even if not filling the required vacancies - 8-6-2025
                  }
                  className="min-w-[6rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
                >
                  {modal.page === 4
                    ? 'Got it, Thanks!'
                    : modal.page === 2 && selectedApplicants.length === 0
                    ? 'Select none'
                    : 'Confirm'}
                </button>
              ) : null)}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppSelectionModal;
