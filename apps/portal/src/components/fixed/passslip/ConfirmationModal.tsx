/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useEffect, useState } from 'react';

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

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [cancelRemarks, setCancelRemarks] = useState<string>('');
  const reasonIsValid = cancelRemarks.trim().length >= 5;

  useEffect(() => {
    if (modalState) setCancelRemarks('');
  }, [modalState]);

  const handleSubmit = () => {
    if (tokenId) {
      if (!reasonIsValid) return;
      const data = {
        passSlipId: tokenId,
        status: action,
        cancelRemarks: cancelRemarks.trim(),
        cancelledBy: employeeDetails?.employmentDetails?.userId,
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
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
            {`Are you sure you want to cancel this application?`}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-sm text-slate-600">
                Reason for cancelling <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full text-md text-slate-700 border-slate-300 rounded resize-none"
                placeholder="State the reason (at least 5 characters)"
                value={cancelRemarks}
                onChange={(e) => setCancelRemarks(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                disabled={!reasonIsValid}
                onClick={(e) => handleSubmit()}
              >
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
