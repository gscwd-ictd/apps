/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Modal } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';

type ViewPassSlipModalProps = {
  rowData: PassSlip;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const ViewPassSlipModal: FunctionComponent<ViewPassSlipModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg">
        <Modal.Header withCloseBtn>
          <div className="flex gap-1 px-5 text-lg font-medium text-gray-700">
            {rowData.status === PassSlipStatus.ONGOING
              ? 'Ongoing'
              : rowData.status === PassSlipStatus.FOR_APPROVAL
              ? 'For Approval'
              : rowData.status === PassSlipStatus.APPROVED
              ? 'Completed'
              : rowData.status === PassSlipStatus.DISAPPROVED
              ? 'Completed'
              : rowData.status === PassSlipStatus.CANCELLED
              ? 'Cancelled'
              : ''}
            <span>Pass Slip</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full gap-4 px-5">
              {/* Date of Application */}

              <div className="flex flex-col gap-2 px-5 py-2 bg-gray-100 rounded">
                <div className="sm:flex sm:flex-col md:gap-2 md:flex md:flex-col lg:flex lg:flex-row lg:justify-between">
                  {/* <div className="flex items-center gap-2 ">
                    <i className="text-blue-500 bx bxs-user"></i>

                    <div className="font-medium text-gray-600 text-md">
                      {rowData.employeeName}
                    </div>
                  </div>

                  <div className="items-center text-sm text-gray-600">
                    Information, Communications & Technology
                  </div> */}
                  <LabelValue
                    label="Employee Name: "
                    textSize="sm"
                    value={rowData.employeeName}
                  />
                </div>
                <div className="gap-0 sm:gap-2 sm:flex sm:flex-col md:gap-2 md:flex md:flex-col lg:flex lg:flex-row lg:justify-between ">
                  <LabelValue
                    label="Nature of Business: "
                    textSize="sm"
                    value={rowData.natureOfBusiness}
                  />
                  <LabelValue
                    label="Date of Application: "
                    textSize="sm"
                    value={dayjs(rowData.dateOfApplication).format(
                      'MMMM DD, YYYY'
                    )}
                  />
                </div>
                <div className="sm:flex sm:flex-col md:gap-2 md:flex md:flex-col lg:flex lg:flex-row lg:justify-between ">
                  <LabelValue
                    label="Mode of Transportation: "
                    textSize="sm"
                    value={rowData.obTransportation ?? 'N/A'}
                  />

                  <LabelValue
                    label="Estimated Hours: "
                    textSize="sm"
                    value={rowData.estimateHours}
                  />
                </div>

                <LabelValue
                  label="Purpose or Destination: "
                  textSize="sm"
                  value={rowData.purposeDestination}
                />
              </div>

              <AlertNotification
                alertType={
                  rowData.status === PassSlipStatus.ONGOING
                    ? 'warning'
                    : rowData.status === PassSlipStatus.FOR_APPROVAL
                    ? 'warning'
                    : rowData.status === PassSlipStatus.APPROVED
                    ? 'success'
                    : rowData.status === PassSlipStatus.DISAPPROVED
                    ? 'error'
                    : rowData.status === PassSlipStatus.CANCELLED
                    ? 'error'
                    : ''
                }
                notifMessage={
                  rowData.status === PassSlipStatus.ONGOING
                    ? 'Pass Slip is being used as of the moment'
                    : rowData.status === PassSlipStatus.APPROVED
                    ? 'Approved'
                    : rowData.status === PassSlipStatus.FOR_APPROVAL
                    ? 'Awaiting Supervisor Approval'
                    : rowData.status === PassSlipStatus.DISAPPROVED
                    ? 'Disapproved'
                    : rowData.status === PassSlipStatus.CANCELLED
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

export default ViewPassSlipModal;
