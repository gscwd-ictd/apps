/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useState } from 'react';
import dayjs from 'dayjs';
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { WorkSuspension } from 'apps/employee-monitoring/src/utils/types/work-suspension.type';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: WorkSuspension | null;
  onSuccess: (message: string) => void;
};

const DeleteWorkSuspensionModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDelete = async () => {
    if (!rowData?.id) return;
    setLoading(true);
    setErrorMessage('');
    const { error, result } = await deleteEmpMonitoring(`/work-suspension/${rowData.id}`);
    setLoading(false);
    if (error) setErrorMessage(String(result));
    else {
      onSuccess('Work suspension deleted successfully');
      closeModalAction();
    }
  };

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="xs">
      <Modal.Body>
        {loading ? (
          <AlertNotification logo={<LoadingSpinner size="xs" />} alertType="info" notifMessage="Submitting request" dismissible={true} />
        ) : null}
        {errorMessage ? <AlertNotification alertType="error" notifMessage={errorMessage} dismissible={true} /> : null}

        <div className="flex flex-col w-full gap-3 px-2 mt-5 text-center text-gray-600">
          <p className="font-medium text-md">
            Delete work suspension <span className="font-bold">{rowData?.name}</span>
            {rowData?.suspensionDate ? ` on ${dayjs(rowData.suspensionDate).format('MMMM DD, YYYY')}` : ''}?
          </p>
          <p className="text-xs text-gray-500">
            DTR, leave add-backs and overtime for this date will be computed without the suspension.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-between w-full gap-2">
          <button
            type="button"
            className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
            disabled={loading}
            onClick={handleDelete}
          >
            <span className="text-sm font-normal">Confirm</span>
          </button>
          <button
            type="button"
            className="w-full text-black bg-white border border-gray-200 rounded active:bg-gray-200 hover:bg-gray-100"
            onClick={closeModalAction}
          >
            <span className="text-sm font-normal">Cancel</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteWorkSuspensionModal;
