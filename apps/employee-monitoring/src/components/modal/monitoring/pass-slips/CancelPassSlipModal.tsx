/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useState } from 'react';
import { isEmpty } from 'lodash';

import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';

import { AlertNotification, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';

import dayjs from 'dayjs';

type CancelPassSlipModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  formData: PassSlip;
};

const CancelPassSlipModal: FunctionComponent<CancelPassSlipModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  formData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // zustand store initialization
  const { CancelPassSlip, CancelPassSlipSuccess, CancelPassSlipFail } = usePassSlipStore((state) => ({
    CancelPassSlip: state.cancelPassSlip,
    CancelPassSlipSuccess: state.cancelPassSlipSuccess,
    CancelPassSlipFail: state.cancelPassSlipFail,
  }));

  // onclick submit function
  const onSubmit = () => {
    const data = {
      passSlipId: formData.id,
    };

    CancelPassSlip();
    handleCancelResult(data);
  };

  // function for patching the leave application
  const handleCancelResult = async (data: { passSlipId: string }) => {
    const { error, result } = await patchEmpMonitoring(`/pass-slip/hr/cancel`, data);
    setIsLoading(true);

    if (!error) {
      CancelPassSlipSuccess(result);
      closeModalAction();
      setIsLoading(false);
    } else if (error) {
      CancelPassSlipFail(result);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <h2 className="text-lg font-semibold">Cancel Pass Slip</h2>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={false}
            />
          ) : null}

          <div className="w-full">
            <div className="flex flex-col w-full gap-5">
              <p className="text-md font-medium text-center text-gray-600">Do you want to cancel pass slip for:</p>
              <div className="text-gray-600 p-5">
                <div className="flex flex-row justify-between">
                  Name: <span className="font-bold">{formData.employeeName}</span>
                </div>
                <div className="flex flex-row justify-between">
                  Date of Application:{' '}
                  <span className="font-bold">
                    {formData.dateOfApplication ? dayjs(formData.dateOfApplication).format('MMMM DD, YYYY') : ''}
                  </span>
                </div>
                <div className="flex flex-row justify-between">
                  Nature of Business: <span className="font-bold">{formData.natureOfBusiness}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="cancelPassSlipForm"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              onClick={() => onSubmit()}
            >
              <span className="text-sm font-normal">Yes</span>
            </button>

            <button
              type="button"
              className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
              onClick={() => closeModalAction()}
            >
              <span className="text-sm font-normal">No</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelPassSlipModal;
