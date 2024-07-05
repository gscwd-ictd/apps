/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal, putPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { InboxMessageResponse, InboxMessageType } from 'libs/utils/src/lib/enums/inbox.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useEffect, useState } from 'react';

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
      nomineeId: selectedPayloadId,
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
  const [isBottom, setIsBottom] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };
    window.addEventListener('scroll', handleScroll, true); //moved it out the function's body
    return window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div className="flex flex-col w-full h-full gap-2 text-lg text-center px-4 ">
            <div>
              {confirmationResponse == InboxMessageResponse.PSB_ACCEPT
                ? 'Are you sure you want to accept this assignment?'
                : confirmationResponse == InboxMessageResponse.PSB_DECLINE
                ? 'Are you sure you want to decline this assignment?'
                : confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT
                ? 'By accepting this training, you agree with the Training Policy indicated below. Kindly scroll to the bottom to accept this Training invitation.'
                : confirmationResponse == InboxMessageResponse.TRAINING_DECLINE
                ? 'Are you sure you want to decline this training invitation? Your response will be irreversible.'
                : 'Do you want to submit?'}
            </div>
            {confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT ? (
              <div className="flex flex-col items-center w-full h-56 px-4 pt-4 text-sm text-justify">
                <label className="font-bold">Sample Training Policy</label>
                Scope This policy applies to all permanent, full-time or part-time employees of the company. All
                eligible employees are covered by this policy without discriminating against rank or protected
                characteristics. Employees with temporary/short-term contracts may attend training at their manager’s
                discretion. This policy doesn’t cover supplementary employees like contractors or consultants. Policy
                elements Imparting training policy is a joint effort. Employees, managers and HR should all collaborate
                to build a continuous professional development (CPD) culture. Employees are responsible for seeking new
                learning opportunities. Managers are responsible to coach their teams and identify employee development
                needs. The HR Department is responsible for conducting workshops, seminars and refresher courses to keep
                the workforce informed and updated with the latest learnings.
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button
                disabled={!isBottom && confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT ? true : false}
                variant={'primary'}
                size={'lg'}
                loading={false}
                onClick={(e) => handleResponse()}
              >
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
