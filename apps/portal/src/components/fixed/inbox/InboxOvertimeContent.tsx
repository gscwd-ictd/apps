/* eslint-disable @nx/enforce-module-boundaries */

import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useInboxStore } from '../../../store/inbox.store';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';

export const InboxOvertimeContent = () => {
  const { setConfirmModalIsOpen, setSelectedVppId, setConfirmationResponse, setDeclineRemarks } = useInboxStore(
    (state) => ({
      setConfirmModalIsOpen: state.setConfirmModalIsOpen,
      setSelectedVppId: state.setSelectedVppId,
      setConfirmationResponse: state.setConfirmationResponse,
      setDeclineRemarks: state.setDeclineRemarks,
    })
  );

  return (
    <>
      <div className={'w-100 pl-8 pr-8 pt-1 flex flex-col bg-white pb-10'}>
        <label className="pb-2">
          This is to inform you that you have been requested for Overtime with the specified details below:
        </label>
        <div>
          <label className="font-bold">Date: </label>
          September 30, 2023
        </div>
        <div>
          <label className="font-bold">Estimated Hours: </label>2
        </div>
        <div>
          <label className="font-bold">Purpose: </label>
          Finish pending work.
        </div>
        <div>
          <label className="font-bold">Location: </label>
          General Santos City via Zoom
        </div>
        <div>
          <label className="font-bold">Employees: </label>
          <ul>
            {/* {psbMessage.psbMembers.map((member: PsbMembers, messageIdx: number) => {
              return (
                <li className="indent-4" key={messageIdx}>
                  {member.fullName}
                </li>
              );
            })} */}

            <li className="indent-4">Phyll Fragata</li>
            <li className="indent-4">Allyn Joseph Cubero</li>
            <li className="indent-4">Ricardo Vicente Narvaiza</li>
            <li className="indent-4">Jay Nosotros</li>
          </ul>
        </div>
      </div>
    </>
  );
};
