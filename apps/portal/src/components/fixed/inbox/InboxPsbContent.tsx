/* eslint-disable @nx/enforce-module-boundaries */

import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useInboxStore } from '../../../../src/store/inbox.store';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { useState } from 'react';

type ConfirmationApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
};

export const InboxPsbContent = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
}: ConfirmationApplicationModalProps) => {
  const { psbMessage } = useInboxStore((state) => ({
    psbMessage: state.message.psb,
  }));

  const [remarks, setRemarks] = useState<string>(''); // store remarks for declining assignment for POST

  //UPDATE REMARKS ON RESPONSE
  const handleRemarks = (e: string) => {
    setRemarks(e);
  };

  // const handleSubmit = () => {
  //   if (tokenId) {
  //     const data = {
  //       passSlipId: tokenId,
  //       status: action,
  //     };
  //     cancelPassSlip(true);
  //     handlePatchResult(data);
  //   } else {
  //     //nothing to do
  //   }
  // };

  // const handlePatchResult = async (data: passSlipAction) => {
  //   const { error, result } = await patchPortal('/v1/pass-slip', data);
  //   if (error) {
  //     cancelPassSlipFail(result);
  //   } else {
  //     cancelPassSlipSuccess(result);
  //     closeModalAction(); // close confirmation of decline modal
  //     setTimeout(() => {
  //       setPendingPassSlipModalIsOpen(false); // close main pass slip info modal
  //     }, 200);
  //   }
  // };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <div className="flex flex-col items-center w-full pt-1 text-gray-700 h-1/2 md:h-full md:pt-6 md:ml-4 md:mr-4">
        {
          <div className={'w-100 pl-8 pr-8 pt-1 flex flex-col bg-white pb-10'}>
            {psbMessage?.details.acknowledgedSchedule ? (
              <AlertNotification
                alertType="success"
                notifMessage={'You have accepted this assignment'}
                dismissible={false}
              />
            ) : null}

            {psbMessage?.details.declinedSchedule ? (
              <AlertNotification
                alertType="info"
                notifMessage={'You have declined this assignment'}
                dismissible={false}
              />
            ) : null}

            {!psbMessage?.details.acknowledgedSchedule && !psbMessage?.details.declinedSchedule ? (
              <AlertNotification alertType="warning" notifMessage={'Awaiting action'} dismissible={false} />
            ) : null}

            <label className="pb-2">
              You have been requested to become a member of the Personnel Selection Board for the scheduled interview
              stated below. Do you accept this task?
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
                className={`
                        w-full h-32 p-2 border resize-none
                    `}
                disabled={
                  psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? true : false
                }
                value={
                  psbMessage?.details.acknowledgedSchedule
                    ? 'N/A'
                    : psbMessage?.details.declinedSchedule
                    ? psbMessage.details.declineReason
                    : remarks
                }
                placeholder={
                  'If declining, please state reason and indicate personnel you recommend to be your replacement.'
                }
                onChange={(e) => handleRemarks(e.target.value as unknown as string)}
              ></textarea>
            </div>

            {psbMessage?.details.acknowledgedSchedule || psbMessage?.details.declinedSchedule ? null : (
              <div className="flex flex-row items-center justify-end gap-4">
                <Button
                  variant={'primary'}
                  size={'md'}
                  onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, true)}
                >
                  Accept
                </Button>
                <Button
                  variant={'danger'}
                  size={'md'}
                  disabled={remarks ? false : true}
                  onClick={(e) => openSubmitModalAction(psbMessage?.details.vppId, false)}
                >
                  Decline
                </Button>
              </div>
            )}
          </div>
        }
      </div>
    </>
  );
};
