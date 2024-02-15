/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal, putPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
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
    selectedPayloadId,
    confirmationResponse,
    confirmationModalTitle,
    declineRemarks,
    patchInboxResponse,
    patchInboxResponseFail,
    patchInboxResponseSuccess,

    putInboxResponse,
    putInboxResponseFail,
    putInboxResponseSuccess,

    setPsbMessageModalIsOpen,
    setTrainingMessageModalIsOpen,
  } = useInboxStore((state) => ({
    selectedPayloadId: state.selectedPayloadId,
    confirmationResponse: state.confirmationResponse,
    confirmationModalTitle: state.confirmationModalTitle,
    selectedMessageType: state.selectedMessageType,
    declineRemarks: state.declineRemarks,
    patchInboxResponse: state.patchInboxResponse,
    patchInboxResponseFail: state.patchInboxResponseSuccess,
    patchInboxResponseSuccess: state.patchInboxResponseSuccess,

    putInboxResponse: state.putInboxResponse,
    putInboxResponseFail: state.putInboxResponseFail,
    putInboxResponseSuccess: state.putInboxResponseSuccess,

    setPsbMessageModalIsOpen: state.setPsbMessageModalIsOpen,
    setTrainingMessageModalIsOpen: state.setTrainingMessageModalIsOpen,
  }));

  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  async function handleResponse() {
    if (
      confirmationResponse == InboxMessageResponse.PSB_ACCEPT ||
      confirmationResponse == InboxMessageResponse.PSB_DECLINE
    ) {
      handlePsbPatch(declineRemarks);
    } else if (
      confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT ||
      confirmationResponse == InboxMessageResponse.TRAINING_DECLINE
    ) {
      handleTrainingPut(declineRemarks);
    }
  }

  const handlePsbPatch = async (declineRemarks: string) => {
    const submitPsbResponseRoute = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/acknowledge-schedule/`;
    patchInboxResponse();
    if (confirmationResponse == InboxMessageResponse.PSB_ACCEPT) {
      const { error, result } = await patchPortal(
        submitPsbResponseRoute + selectedPayloadId + '/' + employeeDetails.employmentDetails.userId + '/accept',
        {}
      );
      if (error) {
        patchInboxResponseFail(result);
      } else {
        patchInboxResponseSuccess(result);
        closeModalAction(); // close confirmation modal
        setTimeout(() => {
          setPsbMessageModalIsOpen(false);
        }, 200);
      }
    } else {
      const { error, result } = await patchPortal(
        submitPsbResponseRoute + selectedPayloadId + '/' + employeeDetails.employmentDetails.userId + '/decline',
        { declineReason: declineRemarks }
      );
      if (error) {
        patchInboxResponseFail(result);
      } else {
        patchInboxResponseSuccess(result);
        closeModalAction(); // close confirmation modal
        setTimeout(() => {
          setPsbMessageModalIsOpen(false);
        }, 200);
      }
    }
  };

  const handleTrainingPut = async (declineRemarks: string) => {
    const submitTrainingResponseRoute = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/`;
    putInboxResponse();

    const { error, result } = await putPortal(submitTrainingResponseRoute, {
      id: selectedPayloadId,
      status: confirmationResponse,
      remarks: confirmationResponse == InboxMessageResponse.TRAINING_DECLINE ? declineRemarks : null,
    });
    if (error) {
      putInboxResponseFail(result);
    } else {
      putInboxResponseSuccess(result);
      closeModalAction(); // close confirmation modal
      setTimeout(() => {
        setTrainingMessageModalIsOpen(false);
      }, 200);
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
            {confirmationResponse == InboxMessageResponse.PSB_ACCEPT ||
            confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT
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
