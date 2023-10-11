/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useState } from 'react';
import { isEmpty } from 'lodash';

type DisputeApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
  title: string;
};

export const DisputeApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  title,
}: DisputeApplicationModalProps) => {
  const { cancelPassSlip, cancelPassSlipSuccess, cancelPassSlipFail, setPendingPassSlipModalIsOpen } = usePassSlipStore(
    (state) => ({
      cancelPassSlip: state.cancelPassSlip,
      cancelPassSlipSuccess: state.cancelPassSlipSuccess,
      cancelPassSlipFail: state.cancelPassSlipFail,
      setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    })
  );
  const [remarks, setRemarks] = useState<string>('');
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
          <div className="flex flex-col w-full h-full px-2 gap-2 text-md ">
            {'Please indicate reason for dispute and provide proof of claim:'}
            <textarea
              required
              placeholder="Reason for dispute"
              className={`w-full h-32 p-2 border resize-none`}
              onChange={(e) => setRemarks(e.target.value as unknown as string)}
              value={remarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button
                disabled={!isEmpty(remarks) ? false : true}
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => handleSubmit()}
              >
                Submit
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
