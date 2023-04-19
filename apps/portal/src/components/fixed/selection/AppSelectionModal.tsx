import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import { AppSelectionModalController } from './AppSelectionListController';
import { useAppSelectionStore } from '../../../../src/store/selection.store';
import { PublicationPostingStatus } from '../../../../src/types/publication.type';

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

  return (
    <>
      <Modal
        open={modalState}
        setOpen={setModalState}
        size={modal.page === 2 ? 'xl' : 'lg'}
        steady
      >
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="px-5">
              {modal.page === 1
                ? 'Select a publication'
                : modal.page === 2 && 'Select Applicants'}
            </div>
          </h3>
        </Modal.Header>

        <Modal.Body>
          {/* <Button onClick={() => console.log(selectedApplicants)}>Log Selected Applicants</Button> */}
          <AppSelectionModalController page={modal.page} />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {modal.page !== 4 ? (
              <div className="w-[6rem]">
                <Button variant="info" onClick={closeModalAction}>
                  {modal.page === 1 ? 'Close' : 'Cancel'}
                </Button>
              </div>
            ) : null}
            {modal.page !== 1 &&
              modal.page !== 3 &&
              (publicationDetails?.positionDetails?.postingStatus ===
              PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION ? (
                <div className="min-w-[6rem] max-w-auto">
                  <Button
                    onClick={modalAction}
                    disabled={
                      modal.page === 2 &&
                      !(selectedApplicants.length === 0) &&
                      modal.page === 2 &&
                      selectedApplicants.length > 0 &&
                      selectedApplicants.length !==
                        parseInt(selectedPublication.numberOfPositions!)
                    }
                  >
                    {modal.page === 4
                      ? 'Got it, Thanks!'
                      : modal.page === 2 && selectedApplicants.length === 0
                      ? 'Select none'
                      : 'Confirm'}
                  </Button>
                </div>
              ) : null)}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppSelectionModal;
