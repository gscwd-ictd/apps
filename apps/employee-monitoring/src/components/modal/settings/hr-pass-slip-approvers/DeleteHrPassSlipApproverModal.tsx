/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useState } from 'react';
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { HrPassSlipApprover } from 'apps/employee-monitoring/src/utils/types/hr-pass-slip-approver.type';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: HrPassSlipApprover;
  onDeleted: (fullName: string) => void;
  onError: (message: string) => void;
};

const DeleteHrPassSlipApproverModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
  onDeleted,
  onError,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onConfirm = async () => {
    if (!rowData?.id) return;
    setSubmitting(true);
    const { error } = await deleteEmpMonitoring(`/ems-settings/hr-pass-slip-approvers/${rowData.id}`);
    setSubmitting(false);
    if (error) onError('An error occurred. Please try again later.');
    else {
      onDeleted(rowData.fullName);
      closeModalAction();
    }
  };

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="xs">
      <Modal.Body>
        {submitting ? (
          <AlertNotification logo={<LoadingSpinner size="xs" />} alertType="info" notifMessage="Submitting request" dismissible={false} />
        ) : null}
        <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
          Are you sure you want to remove <span className="px-1 font-bold">{rowData?.fullName}</span> as HR Pass Slip Approver?
        </p>
        <p className="px-2 mt-2 text-xs text-center text-gray-500">
          Pass slips already sent to this approver stay with them.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-between w-full gap-2">
          <button
            type="button"
            className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
            disabled={submitting}
            onClick={onConfirm}
          >
            <span className="text-sm font-normal">Confirm</span>
          </button>
          <button
            type="button"
            className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
            onClick={closeModalAction}
          >
            <span className="text-sm font-normal">Cancel</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteHrPassSlipApproverModal;
