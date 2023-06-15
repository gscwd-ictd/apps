/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Modal } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import {
  NatureOfBusiness,
  PassSlipStatus,
} from 'libs/utils/src/lib/enums/pass-slip.enum';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import Image from 'next/image';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import userphoto from '../../../../../public/user-photo.jpg';

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
      <Modal open={modalState} setOpen={setModalState} size="md">
        <Modal.Header withCloseBtn>
          <div className="flex gap-1 px-5 text-2xl font-semibold text-gray-800">
            {rowData.status === PassSlipStatus.ONGOING
              ? 'Ongoing'
              : rowData.status === PassSlipStatus.FOR_APPROVAL
              ? 'Pending'
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
            <div className="flex flex-col w-full gap-4 px-2">
              <div className="flex flex-col gap-4 py-2 ">
                <div className="flex items-center gap-2 px-2">
                  {userphoto ? (
                    <div className="flex flex-wrap justify-center">
                      <div className="w-[6rem]">
                        <Image
                          src={userphoto}
                          alt="user-circle"
                          className="h-auto max-w-full align-middle border-none rounded-full shadow"
                        />
                      </div>
                    </div>
                  ) : (
                    <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
                  )}

                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold">
                      {rowData.employeeName}
                    </div>
                  </div>
                </div>

                <div className="grid px-5 mt-2 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
                  <div className="sm:order-1 md:order-1 lg:order-2">
                    <LabelValue
                      label="Pass Slip Date"
                      direction="top-to-bottom"
                      textSize="md"
                      value={dayjs(rowData.dateOfApplication).format(
                        'MMMM DD, YYYY'
                      )}
                    />
                  </div>
                </div>

                <hr />
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <div className="pr-10">
                    <LabelValue
                      label="Assignment"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        rowData.assignmentName ? rowData.assignmentName : 'N/A'
                      }
                    />
                  </div>
                  <LabelValue
                    label="Supervisor Name"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.supervisorName}
                  />
                </div>

                <hr />

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Nature of Business"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.natureOfBusiness}
                  />
                  <LabelValue
                    label="Estimated Hours"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.estimateHours}
                  />
                </div>
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Mode of Transportation"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.obTransportation ?? 'N/A'}
                  />

                  <LabelValue
                    label="Purpose or Destination"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.purposeDestination}
                  />
                </div>

                {rowData.status === PassSlipStatus.FOR_APPROVAL ||
                rowData.status === PassSlipStatus.DISAPPROVED ||
                rowData.status === PassSlipStatus.APPROVED ? null : (
                  <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Pass Slip Time Out"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.timeOut ?? 'N/A'}
                    />

                    {rowData.natureOfBusiness === NatureOfBusiness.HALF_DAY ||
                    rowData.natureOfBusiness ===
                      NatureOfBusiness.UNDERTIME ? null : (
                      <LabelValue
                        label="Pass Slip Time In"
                        direction="top-to-bottom"
                        textSize="md"
                        value={rowData.timeIn ?? 'N/A'}
                      />
                    )}
                  </div>
                )}
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
