import { AlertNotification, Modal } from '@gscwd-apps/oneui';
import UseRenderNatureOfBusiness from 'apps/employee-monitoring/src/utils/functions/RenderNatureOfBusiness';
import UseRenderObTransportation from 'apps/employee-monitoring/src/utils/functions/RenderObTransporation';
import dayjs from 'dayjs';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import React, { FunctionComponent } from 'react';
import { LabelInput } from '../../../inputs/LabelInput';
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
      <Modal open={modalState} setOpen={setModalState} size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex gap-1 px-5 text-2xl font-medium text-gray-700">
            {rowData.status === PassSlipStatus.ONGOING
              ? 'Ongoing'
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
          <div className="w-full">
            <div className="flex flex-col w-full gap-5 px-5">
              <AlertNotification
                alertType={
                  rowData.status === PassSlipStatus.ONGOING
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
                    ? 'Awaiting Supervisor Approval'
                    : rowData.status === PassSlipStatus.APPROVED
                    ? 'Approved'
                    : rowData.status === PassSlipStatus.DISAPPROVED
                    ? 'Disapproved'
                    : rowData.status === PassSlipStatus.CANCELLED
                    ? 'Cancelled'
                    : ''
                }
                dismissible={false}
              />

              {/* Date of Application */}

              <LabelValue
                label="Date of Application: "
                value={dayjs(rowData.dateOfApplication).format('MMMM DD, YYYY')}
              />

              <LabelValue
                label="Nature of Business: "
                value={rowData.natureOfBusiness}
              />

              <LabelValue
                label="Mode of Transportation: "
                value={rowData.obTransportation ?? 'N/A'}
              />

              <LabelValue
                label="Estimated Hours: "
                value={rowData.estimateHours}
              />

              <LabelValue
                label="Purpose or Destination: "
                value={rowData.purposeDestination}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewPassSlipModal;
