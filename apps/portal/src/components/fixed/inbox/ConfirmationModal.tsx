/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { InboxMessageResponse, InboxMessageType } from 'libs/utils/src/lib/enums/inbox.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';

type ConfirmationApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ConfirmationInboxModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ConfirmationApplicationModalProps) => {
  const {
    selectedVppId,
    confirmationResponse,
    confirmationModalTitle,
    selectedMessageType,
    declineRemarks,
    patchInboxReponse,
    patchInboxReponseFail,
    patchInboxReponseSuccess,
    setIsMessageOpen,
  } = useInboxStore((state) => ({
    selectedVppId: state.selectedVppId,
    confirmationResponse: state.confirmationResponse,
    confirmationModalTitle: state.confirmationModalTitle,
    selectedMessageType: state.selectedMessageType,
    declineRemarks: state.declineRemarks,
    patchInboxReponse: state.patchInboxReponse,
    patchInboxReponseFail: state.patchInboxReponseSuccess,
    patchInboxReponseSuccess: state.patchInboxReponseSuccess,
    setIsMessageOpen: state.setIsMessageOpen,
  }));

  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  async function handleResponse() {
    if (selectedMessageType == InboxMessageType.PSB) {
      handlePsbPatch(declineRemarks);
    }
  }

  const handlePsbPatch = async (declineRemarks: string) => {
    const submitPsbResponseRoute = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/acknowledge-schedule/`;
    patchInboxReponse();
    if (confirmationResponse == InboxMessageResponse.ACCEPT) {
      const { error, result } = await patchPortal(
        submitPsbResponseRoute + selectedVppId + '/' + employeeDetails.employmentDetails.userId + '/accept',
        {}
      );
      if (error) {
        patchInboxReponseFail(result);
      } else {
        patchInboxReponseSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setIsMessageOpen(false);
      }
    } else {
      const { error, result } = await patchPortal(
        submitPsbResponseRoute + selectedVppId + '/' + employeeDetails.employmentDetails.userId + '/decline',
        { declineReason: declineRemarks }
      );
      if (error) {
        patchInboxReponseFail(result);
      } else {
        patchInboxReponseSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setIsMessageOpen(false);
      }
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span>{confirmationModalTitle}</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col w-full h-full gap-2 text-lg text-center">
            {confirmationResponse == InboxMessageResponse.ACCEPT
              ? 'Are you sure you want accept?'
              : 'Are you sure you want decline?'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button variant={'primary'} size={'lg'} loading={false} onClick={(e) => handleResponse()}>
                Yes
              </Button>
              <Button variant={'danger'} size={'lg'} loading={false} onClick={closeModalAction}>
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
