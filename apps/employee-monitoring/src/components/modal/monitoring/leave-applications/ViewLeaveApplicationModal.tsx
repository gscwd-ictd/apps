/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Modal } from '@gscwd-apps/oneui';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import dayjs from 'dayjs';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { MonitoringLeave } from 'libs/utils/src/lib/types/leave-application.type';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';

type ViewLeaveApplicationModalProps = {
  rowData: MonitoringLeave;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// /v1/leave-application/details/${leaveId}

const ViewLeaveApplicationModal: FunctionComponent<
  ViewLeaveApplicationModalProps
> = ({ rowData, modalState, closeModalAction, setModalState }) => {
  const firstAndLastDate = (dates: Array<string>) => {
    const sortedDates = dates.sort((date1, date2) =>
      dayjs(date1).format('YYYY/MM/DD') > dayjs(date2).format('YYYY/MM/DD')
        ? 1
        : dayjs(date1).format('YYYY/MM/DD') > dayjs(date2).format('YYYY/MM/DD')
        ? -1
        : 0
    );
    return `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`;
  };
  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="md">
        <Modal.Header withCloseBtn>
          <div className="flex gap-1 px-5 text-2xl font-semibold text-gray-800">
            <span>Leave Application</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full gap-4 rounded ">
              <div className="flex flex-col gap-4 px-2 py-2 rounded ">
                <div className="flex items-center px-2">
                  <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>

                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold">
                      {rowData.fullName}
                    </div>
                    <div className="font-light">
                      {rowData.positionTitle ?? 'Web Developer'}
                    </div>
                  </div>
                </div>

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Supervisor Name"
                    direction="top-to-bottom"
                    textSize="md"
                    value="Test Supervisor Name"
                  />
                  <LabelValue
                    label="Assignment"
                    direction="top-to-bottom"
                    textSize="md"
                    value="Test Assignment"
                  />
                </div>

                <hr />

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Leave Name"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.leaveName}
                  />
                  <LabelValue
                    label="Date of Filing"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.dateOfFiling}
                  />
                </div>
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Applied Leave Dates"
                    direction="top-to-bottom"
                    textSize="md"
                    value={
                      rowData.leaveDates && rowData.leaveDates.length >= 2
                        ? firstAndLastDate(rowData.leaveDates)
                        : rowData.leaveDates && rowData.leaveDates.length === 1
                        ? rowData.leaveDates.map((date) => date)
                        : 'N/A'
                    }
                  />

                  <LabelValue
                    label="Status"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.status ? UseCapitalizer(rowData.status) : ''}
                  />
                </div>
              </div>
              <hr />

              <AlertNotification
                alertType={
                  rowData.status === LeaveStatus.ONGOING
                    ? 'warning'
                    : rowData.status === LeaveStatus.APPROVED
                    ? 'success'
                    : rowData.status === LeaveStatus.DISAPPROVED
                    ? 'error'
                    : rowData.status === LeaveStatus.CANCELLED
                    ? 'error'
                    : ''
                }
                notifMessage={
                  rowData.status === LeaveStatus.ONGOING
                    ? 'Awaiting Approval'
                    : rowData.status === LeaveStatus.APPROVED
                    ? 'Approved'
                    : rowData.status === LeaveStatus.DISAPPROVED
                    ? 'Disapproved'
                    : rowData.status === LeaveStatus.CANCELLED
                    ? 'Cancelled'
                    : ''
                }
                dismissible={false}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewLeaveApplicationModal;
