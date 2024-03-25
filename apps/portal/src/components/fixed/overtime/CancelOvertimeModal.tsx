/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useState } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const CancelOvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen,
    overtimeDetails,
    cancelOvertime,
    cancelOvertimeSuccess,
    cancelOvertimeFail,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen: state.setCompletedOvertimeModalIsOpen,
    cancelOvertime: state.cancelOvertime,
    cancelOvertimeSuccess: state.cancelOvertimeSuccess,
    cancelOvertimeFail: state.cancelOvertimeFail,
  }));

  const [remarks, setRemarks] = useState<string>('');

  const handleCancel = async () => {
    setPendingOvertimeModalIsOpen(false);
    setCompletedOvertimeModalIsOpen(false);

    const data = {
      overtimeApplicationId: overtimeDetails.id,
      remarks: remarks,
      status: OvertimeStatus.CANCELLED,
    };
    cancelOvertime();
    const { error, result } = await patchPortal(
      `/v1/overtime/immediate-supervisor/${data.overtimeApplicationId}/cancel`,
      null
    );
    if (error) {
      cancelOvertimeFail(result);
    } else {
      cancelOvertimeSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setPendingOvertimeModalIsOpen(false);
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Cancel Overtime Application</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
            {`Are you sure you want to cancel this application?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleCancel()}>
                Yes
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelOvertimeModal;
