/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { HrmoApprovalPassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';

type PassSlipConfirmModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  formData: HrmoApprovalPassSlip;
};

const PassSlipConfirmModal: FunctionComponent<PassSlipConfirmModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  formData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Zustand store initialization
  const { UpdateHrmoApprovalPassSlip, UpdateHrmoApprovalPassSlipSuccess, UpdateHrmoApprovalPassSlipFail } =
    usePassSlipStore((state) => ({
      UpdateHrmoApprovalPassSlip: state.updateHrmoApprovalPassSlip,
      UpdateHrmoApprovalPassSlipSuccess: state.updateHrmoApprovalPassSlipSuccess,
      UpdateHrmoApprovalPassSlipFail: state.updateHrmoApprovalPassSlipFail,
    }));

  // onclick submit function
  const onSubmit = () => {
    // call to start loading
    UpdateHrmoApprovalPassSlip();

    // call async function
    handlePatchHrmoApproval();
  };

  // function for patching the leave application
  const handlePatchHrmoApproval = async () => {
    const { error, result } = await patchEmpMonitoring('/pass-slip', formData);
    setIsLoading(true);

    if (!error) {
      UpdateHrmoApprovalPassSlipSuccess(result);
      closeModalAction();
      setIsLoading(false);
    } else if (error) {
      UpdateHrmoApprovalPassSlipFail(result);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="xs" steady>
        <Modal.Header>
          <div className="px-5 text-2xl font-medium text-gray-700">Confirmation</div>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {isLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={false}
            />
          ) : null}

          <div className="px-5 text-gray-800">
            Do you want to {formData.status === 'for supervisor approval' ? 'approve' : 'disapprove'} this pass slip
            application?
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

export default PassSlipConfirmModal;
