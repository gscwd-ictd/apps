/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { DtrCorrectionForm } from 'libs/utils/src/lib/types/dtr.type';
import { useDtrStore } from 'apps/portal/src/store/dtr.store';

type ConfirmationUpdateTimeLogModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  dataToSubmit: DtrCorrectionForm;
  title: string;
};

export const ConfirmationUpdateTimeLogModal = ({
  modalState,
  setModalState,
  closeModalAction,
  dataToSubmit,
  title,
}: ConfirmationUpdateTimeLogModalProps) => {
  const { updateEmployeeDtr, updateEmployeeDtrFail, updateEmployeeDtrSuccess, setDtrModalIsOpen } = useDtrStore(
    (state) => ({
      updateEmployeeDtr: state.updateEmployeeDtr,
      updateEmployeeDtrSuccess: state.updateEmployeeDtrSuccess,
      updateEmployeeDtrFail: state.updateEmployeeDtrFail,
      setDtrModalIsOpen: state.setDtrModalIsOpen,
    })
  );

  const handleSubmit = () => {
    updateEmployeeDtr();
    handlePatchResult(dataToSubmit);
  };

  const handlePatchResult = async (data: DtrCorrectionForm) => {
    const { error, result } = await postPortal('/v1/dtr-correction/', data);
    if (error) {
      updateEmployeeDtrFail(result);
    } else {
      updateEmployeeDtrSuccess(result);
      closeModalAction(); // close confirmation of decline modal
      setTimeout(() => {
        setDtrModalIsOpen(false); // close main pass slip info modal
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>{title}</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
            {`Are you sure you want to submit this request?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleSubmit()}>
                Yes
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
