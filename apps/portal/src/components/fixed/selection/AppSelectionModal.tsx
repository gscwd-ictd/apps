/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import { AppSelectionModalController } from './AppSelectionListController';
import { useAppSelectionStore } from '../../../../src/store/selection.store';
import { PublicationPostingStatus } from '../../../../src/types/publication.type';
import { isEmpty } from 'lodash';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type AppSelectionModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const AppSelectionModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: AppSelectionModalProps) => {
  const publicationDetails = useAppSelectionStore(
    (state) => state.publicationDetails
  );

  // get state for the modal
  const {
    alert,
    modal,
    selectedApplicants,
    selectedPublication,
    setAlert,
    setFilteredValue,
  } = useAppSelectionStore((state) => ({
    modal: state.modal,
    alert: state.alert,
    selectedApplicants: state.selectedApplicants,
    selectedPublication: state.selectedPublication,
    setAlert: state.setAlert,
    setFilteredValue: state.setFilteredValue,
  }));

  // confirm action for modal
  const modalAction = async () => {
    if (modal.page === 2) {
      setAlert({ ...alert, isOpen: true });
    }
  };

  // close modal action
  const closeModalFunction = () => {
    setFilteredValue('');
    closeModalAction();
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal
        open={modalState}
        setOpen={setModalState}
        size={windowWidth > 1024 ? (modal.page === 2 ? 'xl' : 'lg') : 'full'}
        steady
      >
        <Modal.Header>
<<<<<<< HEAD
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 text-xl">
              {modal.page === 1
                ? 'Select a publication'
                : modal.page === 2 && !isEmpty(selectedPublication)
                ? 'Select Applicant(s)'
                : modal.page === 2 &&
                  selectedPublication.postingStatus ===
                    PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE
                ? 'Selected Applicant(s)'
                : null}
            </div>
          </h3>
=======
          <div className="w-full flex justify-between">
            <h3 className="px-5 font-semibold text-gray-700 flex flex-col w-full ">
              <div className=" text-2xl">Appointing Authority Selection</div>
              <div className="text-md font-normal text-gray-500">
                {modal.page === 1
                  ? 'Select a publication'
                  : modal.page === 2 &&
                    !isEmpty(selectedPublication) &&
                    selectedPublication.postingStatus ===
                      PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION
                  ? 'Select Applicant/s'
                  : modal.page === 2 &&
                    !isEmpty(selectedPublication) &&
                    selectedPublication.postingStatus ===
                      PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE
                  ? 'Selection Done'
                  : null}
              </div>
            </h3>
            <i
              role="button"
              className="bx bx-x text-2xl"
              onClick={closeModalFunction}
            ></i>
          </div>
>>>>>>> 3a130322bebcc901d48e518732cbe747057ea8c8
        </Modal.Header>

        <Modal.Body>
          <AppSelectionModalController page={modal.page} />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {modal.page !== 4 ? (
              <button
<<<<<<< HEAD
                className="w-[6rem]  disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-gray-200 focus:bg-gray-100 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
                onClick={closeModalAction}
=======
                className="w-[6rem]  disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
                onClick={closeModalFunction}
>>>>>>> 3a130322bebcc901d48e518732cbe747057ea8c8
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
                    !(selectedApplicants.length === 0) &&
                    modal.page === 2 &&
                    selectedApplicants.length > 0 &&
                    selectedApplicants.length !==
                      parseInt(selectedPublication.numberOfPositions!)
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
