import { Modal } from '@gscwd-apps/oneui';
import UseRenderNatureOfBusiness from 'apps/employee-monitoring/src/utils/functions/RenderNatureOfBusiness';
import UseRenderObTransportation from 'apps/employee-monitoring/src/utils/functions/RenderObTransporation';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import React, { FunctionComponent } from 'react';

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
          <div className="text-2xl text-gray-600">Pass Slip Authorization</div>
        </Modal.Header>
        <Modal.Body>
          <div className="min-h-[30rem] px-2 w-full flex flex-col gap-1">
            <div className="flex justify-between w-full">
              <div> DATE: {rowData.dateOfApplication}</div>
              <div> DEPARTMENT: Sample Department</div>
            </div>
            <div className="flex items-center w-full gap-1">
              <span>NATURE OF BUSINESS:</span>
              <span>{rowData.natureOfBusiness}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>Ob Transportation:</span>
              <span>{rowData.obTransportation}</span>
            </div>
            <div>
              Estimated Hours:
              {rowData.estimateHours < 1 ? 'N/A' : rowData.estimateHours}
            </div>
            <div> Purpose or Destination: {rowData.purposeDestination}</div>
            <div> Employee Name: {rowData.employeeName}</div>
            <div>Status: {rowData.status}</div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewPassSlipModal;
