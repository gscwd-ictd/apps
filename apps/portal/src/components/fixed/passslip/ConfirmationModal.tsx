/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';

type ConfirmationApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
  title: string;
};

export const ConfirmationApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  title,
}: ConfirmationApplicationModalProps) => {
  const { cancelPassSlip, cancelPassSlipSuccess, cancelPassSlipFail, setPendingPassSlipModalIsOpen } = usePassSlipStore(
    (state) => ({
      cancelPassSlip: state.cancelPassSlip,
      cancelPassSlipSuccess: state.cancelPassSlipSuccess,
      cancelPassSlipFail: state.cancelPassSlipFail,
      setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    })
  );

  const handleSubmit = () => {
    if (tokenId) {
      const data = {
        passSlipId: tokenId,
        status: action,
      };
      cancelPassSlip(true);
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  };

  const handlePatchResult = async (data: passSlipAction) => {
    const { error, result } = await patchPortal('/v1/pass-slip', data);
    if (error) {
      cancelPassSlipFail(result);
    } else {
      cancelPassSlipSuccess(result);
      closeModalAction(); // close confirmation of decline modal
      setTimeout(() => {
        setPendingPassSlipModalIsOpen(false); // close main pass slip info modal
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
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center">
            {`Are you sure you want to cancel this application?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
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
