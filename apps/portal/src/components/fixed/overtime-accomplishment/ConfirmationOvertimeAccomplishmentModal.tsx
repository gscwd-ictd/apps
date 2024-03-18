/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { OvertimeAccomplishmentPatch } from 'libs/utils/src/lib/types/overtime.type';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ConfirmationOvertimeAccomplishmentModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ConfirmationModalProps) => {
  const {
    overtimeAccomplishmentPatchDetails,
    loadingResponse,
    patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentSuccess,
    patchOvertimeAccomplishmentFail,
    setPendingOvertimeAccomplishmentModalIsOpen,
  } = useOvertimeAccomplishmentStore((state) => ({
    overtimeAccomplishmentPatchDetails: state.overtimeAccomplishmentPatchDetails,
    loadingResponse: state.loading.loadingResponse,
    patchOvertimeAccomplishment: state.patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentSuccess: state.patchOvertimeAccomplishmentSuccess,
    patchOvertimeAccomplishmentFail: state.patchOvertimeAccomplishmentFail,
    setPendingOvertimeAccomplishmentModalIsOpen: state.setPendingOvertimeAccomplishmentModalIsOpen,
  }));

  const handleSubmit = () => {
    if (overtimeAccomplishmentPatchDetails) {
      const data = overtimeAccomplishmentPatchDetails;
      patchOvertimeAccomplishment();
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  };

  const handlePatchResult = async (data: OvertimeAccomplishmentPatch) => {
    const { error, result } = await patchPortal('/v1/overtime/employees/accomplishments/', data);
    if (error) {
      patchOvertimeAccomplishmentFail(result);
    } else {
      patchOvertimeAccomplishmentSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setPendingOvertimeAccomplishmentModalIsOpen(false);
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Overtime Accomplishment Report</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage={'Processing'}
              dismissible={false}
            />
          ) : null}
          <div className="w-full h-full flex flex-col gap-2 text-lg text-left px-4">
            {`Are you sure you want to submit this Overtime Accomplishment Report?`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleSubmit()}>
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
