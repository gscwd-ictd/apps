/* eslint-disable @nx/enforce-module-boundaries */

import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useInboxStore } from '../../../store/inbox.store';
import { PsbMembers } from 'apps/portal/src/types/inbox.type';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';
import dayjs from 'dayjs';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

export const InboxOvertimeContent = () => {
  const { overtimeDetails, setConfirmModalIsOpen, setSelectedVppId, setConfirmationResponse, setDeclineRemarks } =
    useInboxStore((state) => ({
      overtimeDetails: state.message.overtime,
      setConfirmModalIsOpen: state.setConfirmModalIsOpen,
      setSelectedVppId: state.setSelectedVppId,
      setConfirmationResponse: state.setConfirmationResponse,
      setDeclineRemarks: state.setDeclineRemarks,
    }));

  return (
    <>
      <div className={'w-100 pl-8 pr-8 pt-1 flex flex-col pb-10'}>
        <AlertNotification alertType="info" notifMessage={'Overtime Notification'} dismissible={false} />
        <label className="pb-2">
          This is to inform you that you have been requested for Overtime with the specified details below:
        </label>
        <div>
          <label className="font-bold">Date: </label>
          {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY')}
        </div>
        <div>
          <label className="font-bold">Estimated Hours: </label>
          {overtimeDetails.estimatedHours}
        </div>
        <div>
          <label className="font-bold">Purpose: </label>
          {overtimeDetails.purpose}
        </div>
        <div>
          <label className="font-bold">Employees assigned with you: </label>
          {overtimeDetails?.employees?.map((employee: EmployeeOvertimeDetail, index: number) => {
            return (
              <div
                key={index}
                className={`${
                  index != 0 ? 'border-t border-slate-200' : ''
                } p-2 md:p-4 flex flex-row justify-between items-center gap-8 `}
              >
                <img
                  className="rounded-full border border-stone-100 shadow w-20"
                  src={employee?.avatarUrl ?? ''}
                  alt={'photo'}
                ></img>
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
                  <div className="w-full flex flex-row items-center gap-4 text-sm md:text-md">
                    <label className="w-full">{employee.fullName}</label>
                    <label className="w-full">{employee.positionTitle}</label>
                    <label className="w-full">{employee.assignment}</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
