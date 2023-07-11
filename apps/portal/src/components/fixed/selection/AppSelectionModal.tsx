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
  const router = useRouter();

  const publicationDetails = useAppSelectionStore(
    (state) => state.publicationDetails
  );

  // get state for the modal
  const modal = useAppSelectionStore((state) => state.modal);

  // set state for the modal
  const setModal = useAppSelectionStore((state) => state.setModal);

  // get the selected applicants state
  const selectedApplicants = useAppSelectionStore(
    (state) => state.selectedApplicants
  );

  // set the selected applicants state
  const setSelectedApplicants = useAppSelectionStore(
    (state) => state.setSelectedApplicants
  );

  // confirmation alert
  const alert = useAppSelectionStore((state) => state.alert);

  // set confirmation alert
  const setAlert = useAppSelectionStore((state) => state.setAlert);

  // get the selected publication id state
  const selectedPublication = useAppSelectionStore(
    (state) => state.selectedPublication
  );

  // confirm action for modal
  const modalAction = async () => {
    if (modal.page === 2) {
      setAlert({ ...alert, isOpen: true });
    }
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
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 text-xl">
              {modal.page === 1
                ? 'Select a publication'
                : modal.page === 2 &&
                  !isEmpty(selectedPublication) &&
                  selectedPublication.postingStatus ===
                    PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION
                ? 'Select Applicant(s)'
                : modal.page === 2 &&
                  !isEmpty(selectedPublication) &&
                  selectedPublication.postingStatus ===
                    PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE
                ? 'Selected Applicant(s)'
                : null}
            </div>
          </h3>
        </Modal.Header>

        <Modal.Body>
          <AppSelectionModalController page={modal.page} />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {modal.page !== 4 ? (
              <button
                className="w-[6rem]  disabled:bg-white disabled:cursor-not-allowed text-gray-700 text-opacity-85 bg-white border border-gray-300 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
                onClick={closeModalAction}
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
