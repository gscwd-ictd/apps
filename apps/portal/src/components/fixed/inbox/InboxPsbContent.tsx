/* eslint-disable @nx/enforce-module-boundaries */

import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useInboxStore } from '../../../../src/store/inbox.store';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';

export const InboxPsbContent = () => {
  const {
    psbMessage,
    declineRemarks,
    setConfirmPsbModalIsOpen,
    setConfirmModalIsOpen,
    setSelectedVppId,
    setConfirmationResponse,
    setConfirmationModalTitle,
    setDeclineRemarks,
  } = useInboxStore((state) => ({
    declineRemarks: state.declineRemarks,
    psbMessage: state.message.psb,
    setConfirmPsbModalIsOpen: state.setConfirmPsbModalIsOpen,
    setConfirmModalIsOpen: state.setConfirmModalIsOpen,
    setSelectedVppId: state.setSelectedVppId,
    setConfirmationResponse: state.setConfirmationResponse,
    setConfirmationModalTitle: state.setConfirmationModalTitle,
    setDeclineRemarks: state.setDeclineRemarks,
  }));

  //UPDATE REMARKS ON RESPONSE
  const handleRemarks = (e: string) => {
    setDeclineRemarks(e);
  };

  const openSubmitModalAction = async (selectedVppId: any, response: InboxMessageResponse) => {
    setSelectedVppId(selectedVppId); // to be used for psb patch request
    setConfirmationResponse(response); // set as accept or decline
    setConfirmationModalTitle('PSB Member Acknowledgment');
    setConfirmModalIsOpen(true);
  };

  return (
    <>
      <div className={'w-100 pl-8 pr-8 pt-1 flex flex-col bg-white pb-10'}>
        {psbMessage?.details.acknowledgedSchedule ? (
          <AlertNotification
            alertType="success"
            notifMessage={'You have accepted this assignment'}
            dismissible={false}
          />
        ) : null}

        {psbMessage?.details.declinedSchedule ? (
          <AlertNotification alertType="info" notifMessage={'You have declined this assignment'} dismissible={false} />
        ) : null}

        {!psbMessage?.details.acknowledgedSchedule && !psbMessage?.details.declinedSchedule ? (
          <AlertNotification alertType="warning" notifMessage={'Awaiting action'} dismissible={false} />
        ) : null}

        <label className="pb-2">
          You have been requested to become a member of the Personnel Selection Board for the scheduled interview stated
          below. Do you accept this task?
        </label>
        <div>
          <label className="font-bold">Assignment: </label>
          {psbMessage?.details.assignment}
        </div>
        <div>
          <label className="font-bold">Position: </label>
          {psbMessage?.details.positionTitle}
        </div>
        <div>
          <label className="font-bold">Schedule: </label>
          {psbMessage?.details.schedule}
        </div>
        <div>
          <label className="font-bold">Venue: </label>
          {psbMessage?.details.venue}
        </div>
        <div>
          <label className="font-bold">PSB Members: </label>
          <ul>
            {psbMessage.psbMembers.map((member: PsbMembers, messageIdx: number) => {
              return (
                <li className="indent-4" key={messageIdx}>
                  {member.fullName}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-2">
          <label className="font-bold">
            Remarks:{' '}
            {psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? null : (
              <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
            )}
          </label>

          <textarea
            className={`w-full p-2 border resize-none`}
            disabled={psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? true : false}
            value={
              psbMessage?.details.acknowledgedSchedule
                ? 'N/A'
                : psbMessage?.details.declinedSchedule
                ? psbMessage.details.declineReason
                : declineRemarks
            }
            placeholder={
              'If declining, please state reason and indicate personnel you recommend to be your replacement.'
            }
            onChange={(e) => handleRemarks(e.target.value as unknown as string)}
            rows={3}
          ></textarea>
        </div>

        {psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? null : (
          <div className="flex flex-row items-center justify-end gap-4">
            <Button
              variant={'primary'}
              size={'md'}
              onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, InboxMessageResponse.ACCEPT)}
            >
              Accept
            </Button>
            <Button
              variant={'danger'}
              size={'md'}
              disabled={declineRemarks ? false : true}
              onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, InboxMessageResponse.DECLINE)}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
