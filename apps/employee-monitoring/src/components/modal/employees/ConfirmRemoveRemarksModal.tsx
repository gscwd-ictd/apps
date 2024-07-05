/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import dayjs from 'dayjs';
import { DtrRemarks, EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

type ConfirmRemoveRemarksModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  formData: DtrRemarks;
  rowData: Partial<EmployeeDtrWithSchedule>;
};

const ConfirmRemoveRemarksModal: FunctionComponent<ConfirmRemoveRemarksModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  formData,
  rowData,
}) => {
  // Zustand store initialization
  const { updateDtrRemarks, updateDtrRemarksSuccess, updateDtrRemarksFail, loadingRemoveDtrRemarks } = useDtrStore(
    (state) => ({
      updateDtrRemarks: state.updateDtrRemarks,
      updateDtrRemarksSuccess: state.updateDtrRemarksSuccess,
      updateDtrRemarksFail: state.updateDtrRemarksFail,
      loadingRemoveDtrRemarks: state.loading.loadingUpdateDtrRemarks,
    })
  );

  // onclick submit function
  const onSubmit = () => {
    updateDtrRemarks();
    handlePatchResult();
  };

  const handlePatchResult = async () => {
    const { error, result } = await patchEmpMonitoring('/daily-time-record/remarks', formData);

    if (!error) {
      updateDtrRemarksSuccess(result);
      closeModalAction();
    } else if (error) {
      updateDtrRemarksFail(result);
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="sm" steady>
        <Modal.Header>
          <div className="px-5 text-2xl font-medium text-gray-700">Confirmation</div>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {loadingRemoveDtrRemarks ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting Request"
              dismissible={false}
            />
          ) : null}

          <div className="px-5 text-gray-800">
            Do you want to remove remarks from this employee's DTR on{' '}
            <strong>{dayjs(rowData.day).format('MMMM DD, YYYY')}</strong>?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-sm w-[6rem] text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => closeModalAction()}
            >
              No
            </button>

            <button
              className="text-sm bg-blue-500 w-[6rem] text-gray-100 rounded hover:bg-blue-400 disabled:cursor-not-allowed"
              type="button"
              onClick={() => onSubmit()}
            >
              Yes
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmRemoveRemarksModal;
