/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
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
    setTrainingModalIsOpen,
    postTrainingSelection,
    postTrainingSelectionSuccess,
    postTrainingSelectionFail,
  } = useTrainingSelectionStore((state) => ({
    skipNominationModalIsOpen: state.skipNominationModalIsOpen,
    setSkipNominationModalIsOpen: state.setSkipNominationModalIsOpen,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    postTrainingSelection: state.postTrainingSelection,
    postTrainingSelectionSuccess: state.postTrainingSelectionSuccess,
    postTrainingSelectionFail: state.postTrainingSelectionFail,
  }));

  const [remarks, setRemarks] = useState<string>('');

  const handleCancel = async () => {
    let data;
    postTrainingSelection();
    const { error, result } = await postPortal(`${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/nominees/`, data);
    if (error) {
      postTrainingSelectionFail(result);
    } else {
      postTrainingSelectionSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setTrainingModalIsOpen(false); // close training details modal
      }, 200);
    }
  };

  useEffect(() => {
    if (skipNominationModalIsOpen) {
      setRemarks('');
    }
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
              onChange={(e) => setRemarks(e.target.value as unknown as string)}
              value={remarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end px-4">
            <div className="max-w-auto flex">
              <Button variant={'primary'} disabled={!isEmpty(remarks) ? false : true} onClick={(e) => handleCancel()}>
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
