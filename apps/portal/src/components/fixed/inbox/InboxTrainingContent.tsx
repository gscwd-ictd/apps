/* eslint-disable @nx/enforce-module-boundaries */

import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useInboxStore } from '../../../store/inbox.store';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';

export const InboxTrainingContent = () => {
  const {
    psbMessage,
    declineRemarks,
    setConfirmModalIsOpen,
    setSelectedVppId,
    setConfirmationResponse,
    setConfirmationModalTitle,
    setDeclineRemarks,
  } = useInboxStore((state) => ({
    declineRemarks: state.declineRemarks,
    psbMessage: state.message.psb,
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
    setConfirmationModalTitle('Training Nomination Acknowledgment');
    setConfirmModalIsOpen(true);
  };

  return (
    <>
      <div className={'w-100 pl-8 pr-8 pt-1 flex flex-col pb-10'}>
        {/* {psbMessage?.details.acknowledgedSchedule ? (
          <AlertNotification
            alertType="success"
            notifMessage={'You have accepted this training nomination'}
            dismissible={false}
          />
        ) : null}

        {psbMessage?.details.declinedSchedule ? (
          <AlertNotification
            alertType="info"
            notifMessage={'You have declined this training nomination'}
            dismissible={false}
          />
        ) : null} */}

        {/* {!psbMessage?.details.acknowledgedSchedule && !psbMessage?.details.declinedSchedule ? (
          <AlertNotification alertType="warning" notifMessage={'Awaiting action'} dismissible={false} />
        ) : null} */}
        <AlertNotification
          alertType="warning"
          notifMessage={'Training Nomination: Awaiting action'}
          dismissible={false}
        />
        <label className="pb-2">
          This is to inform you that you have been recommended and selected to attend the below detailed training.
        </label>
        <div>
          <label className="font-bold">Type of Training: </label>
          External Training
        </div>
        <div>
          <label className="font-bold">Title of the Course: </label>
          Emotional Intelligence and Leadership
        </div>
        <div>
          <label className="font-bold">Facilitator: </label>
          Civil Service Institute
        </div>
        <div>
          <label className="font-bold">Location: </label>
          General Santos City via Zoom
        </div>
        <div>
          <label className="font-bold">Duration: </label>
          10 hours From Feb. 10, 17, 19, 24 To Feb. 26, 2021
        </div>
        <div>
          <label className="font-bold">Course Content: </label>
          <ul>
            {/* {psbMessage.psbMembers.map((member: PsbMembers, messageIdx: number) => {
              return (
                <li className="indent-4" key={messageIdx}>
                  {member.fullName}
                </li>
              );
            })} */}

            <li className="indent-4">a. Introduction: The Emotionally Intelligent Leader</li>
            <li className="indent-4">b. Module 1: Significance of Developing Emotional Intelligence Leadership</li>
            <li className="indent-4">c. Module 2: The Emotional Damage</li>
            <li className="indent-4">d. Module 3: Becoming an Emotionally Intelligent Leader</li>
          </ul>
        </div>

        <div className="pt-2">
          <label className="font-bold">
            Remarks:{' '}
            {/* {psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? null : (
              <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
            )} */}
            <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
          </label>

          <textarea
            className={`w-full p-2 border resize-none`}
            // disabled={psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? true : false}
            // value={
            //   psbMessage?.details.acknowledgedSchedule
            //     ? 'N/A'
            //     : psbMessage?.details.declinedSchedule
            //     ? psbMessage.details.declineReason
            //     : declineRemarks
            // }
            placeholder={'If declining, please state reason.'}
            onChange={(e) => handleRemarks(e.target.value as unknown as string)}
            rows={3}
          ></textarea>
        </div>

        {/* {psbMessage?.details.acknowledgedSchedule && psbMessage?.details.declinedSchedule ? null : ( */}
        <div className="flex flex-row items-center justify-end gap-4">
          <Button
            variant={'primary'}
            size={'md'}
            // onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, InboxMessageResponse.ACCEPT)}
          >
            Accept
          </Button>
          <Button
            variant={'danger'}
            size={'md'}
            disabled={declineRemarks ? false : true}
            // onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, InboxMessageResponse.DECLINE)}
          >
            Decline
          </Button>
        </div>
        {/* )} */}
      </div>
    </>
  );
};
