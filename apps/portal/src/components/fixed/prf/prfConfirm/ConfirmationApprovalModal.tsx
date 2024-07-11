/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { usePrfStore } from 'apps/portal/src/store/prf.store';
import { PrfStatus } from 'apps/portal/src/types/prf.types';
import { patchPrfRequest } from 'apps/portal/src/utils/helpers/prf.requests';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  employeeId: string;
  action: PrfStatus; // approve or disapprove
  tokenId: string; //like prf Id
  remarks?: string;
};

export const ConfirmationApprovalModal = ({
  modalState,
  setModalState,
  closeModalAction,
  employeeId,
  action,
  tokenId,
  remarks,
}: ConfirmationModalProps) => {
  const {
    patchPrf,
    patchPrfSuccess,
    patchPrfFail,
    setPrfConfirmModalIsOpen,
    setForApprovalPrfModalIsOpen,
    loadingResponse,
  } = usePrfStore((state) => ({
    setPrfConfirmModalIsOpen: state.setPrfConfirmModalIsOpen,
    setForApprovalPrfModalIsOpen: state.setForApprovalPrfModalIsOpen,
    patchPrf: state.patchPrf,
    patchPrfSuccess: state.patchPrfSuccess,
    patchPrfFail: state.patchPrfFail,
    loadingResponse: state.loading.loadingResponse,
  }));

  const handleSubmit = async () => {
    patchPrf();
    const { error, result } = await patchPrfRequest(`/prf-trail/${tokenId}`, {
      status: action,
      employeeId: employeeId,
      remarks: remarks,
    });
    if (error) {
      patchPrfFail(result);
    } else {
      patchPrfSuccess(result);
      setPrfConfirmModalIsOpen(false);
      setTimeout(() => {
        setForApprovalPrfModalIsOpen(false);
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
              <span>Position Request Form</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage={'Processing'}
              dismissible={false}
            />
          ) : null}
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left px-4">
            <label>Are you sure you want to approve this Position Request Form?</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
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
