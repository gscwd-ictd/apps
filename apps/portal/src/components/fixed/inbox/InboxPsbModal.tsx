/* eslint-disable react/jsx-no-undef */
/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';

import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { ConfirmationInboxModal } from './ConfirmationModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const InboxPsbModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  const {
    psbMessage,
    declineRemarks,
    confirmModalIsOpen,
    setConfirmModalIsOpen,
    setSelectedPayloadId,
    setConfirmationResponse,
    setConfirmationModalTitle,
    setDeclineRemarks,
  } = useInboxStore((state) => ({
    declineRemarks: state.declineRemarks,
    psbMessage: state.message.psb,
    confirmModalIsOpen: state.confirmModalIsOpen,
    setConfirmModalIsOpen: state.setConfirmModalIsOpen,
    setSelectedPayloadId: state.setSelectedPayloadId,
    setConfirmationResponse: state.setConfirmationResponse,
    setConfirmationModalTitle: state.setConfirmationModalTitle,
    setDeclineRemarks: state.setDeclineRemarks,
  }));

  //UPDATE REMARKS ON RESPONSE
  const handleRemarks = (e: string) => {
    setDeclineRemarks(e);
  };

  const openSubmitModalAction = async (selectedPayloadId: any, response: InboxMessageResponse) => {
    setSelectedPayloadId(selectedPayloadId); // to be used for psb patch request
    setConfirmationResponse(response); // set as accept or decline
    setConfirmationModalTitle('PSB Member Acknowledgment');
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModalAction = async () => {
    setConfirmModalIsOpen(false);
  };

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Message</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <ConfirmationInboxModal
            modalState={confirmModalIsOpen}
            setModalState={setConfirmModalIsOpen}
            closeModalAction={closeConfirmModalAction}
          />

          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
                {psbMessage?.details?.acknowledgedSchedule ? (
                  <AlertNotification
                    alertType={`success`}
                    notifMessage={`You have accepted this assignment.`}
                    dismissible={false}
                  />
                ) : null}

                {psbMessage?.details?.declinedSchedule ? (
                  <AlertNotification
                    alertType="error"
                    notifMessage={'You have declined this assignment.'}
                    dismissible={false}
                  />
                ) : null}

                {!psbMessage?.details?.acknowledgedSchedule && !psbMessage?.details?.declinedSchedule ? (
                  <AlertNotification alertType="warning" notifMessage={'Awaiting acknowledgment'} dismissible={false} />
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Assignment:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">{psbMessage?.details?.assignment}</label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Position:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{psbMessage?.details?.positionTitle}</label>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Schedule:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{psbMessage?.details?.schedule}</label>
                  </div>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Venue:</label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{psbMessage?.details?.venue}</label>
                  </div>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">PSB Members:</label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      <ul>
                        {psbMessage?.psbMembers?.map((member: PsbMembers, messageIdx: number) => {
                          return <li key={messageIdx}>{member.fullName}</li>;
                        })}
                      </ul>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col gap-2`}>
                <label className="text-slate-500 text-md font-medium">
                  Remarks:{' '}
                  {psbMessage?.details?.acknowledgedSchedule || psbMessage?.details?.declinedSchedule ? null : (
                    <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
                  )}
                </label>

                <textarea
                  className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                  disabled={
                    psbMessage?.details?.acknowledgedSchedule || psbMessage?.details?.declinedSchedule ? true : false
                  }
                  value={
                    psbMessage?.details?.acknowledgedSchedule
                      ? 'N/A'
                      : psbMessage?.details?.declinedSchedule
                      ? psbMessage.details?.declineReason
                      : declineRemarks
                  }
                  placeholder={
                    'If declining, please state reason and indicate personnel you recommend to be your replacement.'
                  }
                  onChange={(e) => handleRemarks(e.target.value as unknown as string)}
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full justify-end flex gap-2">
              {psbMessage?.details?.acknowledgedSchedule || psbMessage?.details?.declinedSchedule ? (
                <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()}>
                  Close
                </Button>
              ) : (
                <div className="flex flex-row items-center justify-end gap-4">
                  <Button
                    variant={'primary'}
                    size={'md'}
                    onClick={(e) => openSubmitModalAction(psbMessage?.details?.vppId, InboxMessageResponse.PSB_ACCEPT)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant={'danger'}
                    size={'md'}
                    disabled={declineRemarks ? false : true}
                    onClick={(e) => openSubmitModalAction(psbMessage?.details?.vppId, InboxMessageResponse.PSB_DECLINE)}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InboxPsbModal;
