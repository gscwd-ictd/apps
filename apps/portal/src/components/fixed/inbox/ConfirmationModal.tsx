/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Checkbox, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal, putEms } from 'apps/portal/src/utils/helpers/portal-axios-helper';
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

    const { error, result } = await putEms(submitTrainingResponseRoute, {
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
  const [isPolicyRead, setIsPolicyRead] = useState<boolean>(false);

  useEffect(() => {
    setIsPolicyRead(false);
  }, [modalState]);

  const handleAccept = () => {
    setIsPolicyRead(!isPolicyRead);
  };

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
            {/* invisible input - to avoid autofocusing on the checkbox at the bottom    */}
            <input type="checkbox" className="w-0 h-0 opacity-0" />
            <div>
              {confirmationResponse == InboxMessageResponse.PSB_ACCEPT
                ? 'Are you sure you want to accept this assignment?'
                : confirmationResponse == InboxMessageResponse.PSB_DECLINE
                ? 'Are you sure you want to decline this assignment?'
                : confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT
                ? 'By accepting this training, you agree with the Training Policy indicated below. Kindly scroll to the bottom and check the checkbox to accept this Training invitation.'
                : confirmationResponse == InboxMessageResponse.TRAINING_DECLINE
                ? 'Are you sure you want to decline this training invitation? Your response will be irreversible.'
                : 'Do you want to submit?'}
            </div>
            {confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT ? (
              <div className="flex flex-col items-center w-full h-56 px-4 pt-4 text-md text-justify">
                <label className="font-bold text-xl">Training Policy</label>

                <label className="font-bold pt-4">Failure to Render the Service Obligation</label>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>1.</label>
                    <div className="flex flex-col">
                      <label>
                        Should the employee fail to render in full the service obligation referred to in this pilicy on
                        account of voluntary resignation, optional retirement, separation from the service through their
                        fault, or other causes within their control, they shall refund based on the following forumla:
                      </label>
                      <label className="text-center">R = TCR - (TCR/SOR X SOS)</label>
                      <label>Where:</label>
                      <label>R = Refund</label>
                      <label>SOR = Service Obligation Required</label>
                      <label>SOS = Service Obligation Served</label>
                      <label>TCR = Total Compensation Received (Total Training Cost)</label>
                    </div>
                  </div>

                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>2.</label>
                    <div className="flex flex-col">
                      <label>
                        Should they be unable to effect payment, the amount shall be taken from any pecuniary benefits,
                        retirement gratuities, or terminal leave benefits that may accrue to them in the course of their
                        employement.
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>3.</label>
                    <div className="flex flex-col">
                      <label>
                        Specific screening criteria for training and scholarship grants (local and foreign) shall apply.
                      </label>
                    </div>
                  </div>
                </div>

                <label className="font-bold pt-4 text-center">
                  Failure to Complete the Required Training Hours (In-House Trainings)
                </label>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>1.</label>
                    <div className="flex flex-col">
                      <label>
                        Should the employee fail to complete the required training hours during seminars, workshops, and
                        other in-house training shall refund the amount that has been spent and allotted for each
                        participant on the entire period. Said amount shall be based on the Liquidation Report submitted
                        by the Training Division to the Finance Department.
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>2.</label>
                    <div className="flex flex-col">
                      <label>Refund shall be made through a one-time salary deduction.</label>
                    </div>
                  </div>

                  <div className="flex flex-row justify-start items-start gap-1">
                    <label>3.</label>
                    <div className="flex flex-col">
                      <label>
                        Exemption to this policy shall be hospitalization or death of the employee. Reasons other than
                        those described above shall be made in writing and forwarded to the PDC for review.
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center items-center gap-4 mt-10 mb-4 p-4 bg-slate-300 rounded-md">
                    <Checkbox onClick={handleAccept} />
                    <div className="flex flex-col">
                      <label>I have read the Training Policy and agree to its terms and conditions.</label>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button
                disabled={!isPolicyRead && confirmationResponse == InboxMessageResponse.TRAINING_ACCEPT ? true : false}
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
