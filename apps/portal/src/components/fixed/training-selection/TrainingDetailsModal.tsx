/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    trainingList,
    loadingTrainingList,
    errorTrainingList,
    individualTrainingDetails,
    trainingModalIsOpen,
    setIndividualTrainingDetails,
  } = useTrainingSelectionStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
    errorTrainingList: state.error.errorTrainingList,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingModalIsOpen: state.setTrainingModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
  }));

  return (
    <>
      <Modal size={'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">{individualTrainingDetails.courseTitle}</span>
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
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 p-4 rounded"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto"></div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
