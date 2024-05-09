/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const SkipNominationModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    skipNominationModalIsOpen,
    setSkipNominationModalIsOpen,
    skipNominationRemarks,
    setSkipNominationRemarks,
    setConfirmNominationModalIsOpen,
  } = useTrainingSelectionStore((state) => ({
    skipNominationModalIsOpen: state.skipNominationModalIsOpen,
    setSkipNominationModalIsOpen: state.setSkipNominationModalIsOpen,
    skipNominationRemarks: state.skipNominationRemarks,
    setSkipNominationRemarks: state.setSkipNominationRemarks,
    setConfirmNominationModalIsOpen: state.setConfirmNominationModalIsOpen,
  }));

  const handleCancel = async () => {
    setConfirmNominationModalIsOpen(true);
  };

  useEffect(() => {
    setSkipNominationRemarks('');
  }, [skipNominationModalIsOpen]);

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Skip Nomination</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col w-full h-full px-4 gap-1 text-md ">
            <label>Indicate reason for skipping nomination:</label>
            <textarea
              required
              placeholder="Reason for skipping nomination"
              className={`w-full h-32 p-2 border resize-none rounded-lg border-gray-300/90 `}
              onChange={(e) => setSkipNominationRemarks(e.target.value as unknown as string)}
              value={skipNominationRemarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end px-4">
            <div className="max-w-auto flex">
              <Button
                variant={'primary'}
                disabled={!isEmpty(skipNominationRemarks) ? false : true}
                onClick={(e) => handleCancel()}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SkipNominationModal;
