/* eslint-disable @nx/enforce-module-boundaries */
import { passSlipAction } from '../../../../types/approvals.type';
import { useApprovalStore } from '../../../../store/approvals.store';
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';

type ConfirmationPassSlipModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
};

export const ConfirmationPassSlipModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
}: ConfirmationPassSlipModalProps) => {
  const {
    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
    setApprovedPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen,
    loadingPassSlipResponse,
  } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
    setApprovedPassSlipModalIsOpen: state.setApprovedPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    loadingPassSlipResponse: state.loading.loadingPassSlipResponse,
  }));

  const handleSubmit = () => {
    if (tokenId) {
      const data = {
        passSlipId: tokenId,
        status: action,
      };
      patchPassSlip();
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  };

  const handlePatchResult = async (data: passSlipAction) => {
    const { error, result } = await patchPortal('/v1/pass-slip', data);
    if (error) {
      patchPassSlipFail(result);
    } else {
      patchPassSlipSuccess(result);
      closeModalAction(); // close confirmation of decline modal
      setTimeout(() => {
        setApprovedPassSlipModalIsOpen(false); // close Approved pass slip modal for cancelling approved pass slips cases
        setPendingPassSlipModalIsOpen(false); // close Pending modal for disapproving pass slip cases
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal
        size={`${windowWidth > 768 ? 'sm' : 'xl'}`}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>
                {PassSlipStatus.DISAPPROVED
                  ? 'Disapprove Pass Slip Application'
                  : PassSlipStatus.CANCELLED
                  ? 'Disapprove Pass Slip Application'
                  : 'Pass Slip Application'}
              </span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loadingPassSlipResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage={'Processing'}
              dismissible={false}
            />
          ) : null}
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left pl-5">
            {`Are you sure you want to ${
              action === PassSlipStatus.DISAPPROVED
                ? 'disapprove'
                : action === PassSlipStatus.CANCELLED
                ? 'cancel or void'
                : ''
            } this application?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => handleSubmit()}
              >
                Yes
              </Button>
              <Button
                variant={'danger'}
                size={'md'}
                loading={false}
                onClick={closeModalAction}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
