/* eslint-disable @nx/enforce-module-boundaries */
import { patchPortal } from '../../../../utils/helpers/portal-axios-helper';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { PdcApprovalAction, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';
import { isEqual } from 'lodash';
import {
  PdcChairmanApproval,
  PdcGeneralManagerApproval,
  PdcSecretariatApproval,
} from 'libs/utils/src/lib/types/training.type';

type ConfirmationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PdcApprovalAction; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
  remarks: string; //reason for disapproval, cancellation
};

export const ConfirmationPdcModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  remarks,
}: ConfirmationModalProps) => {
  const {
    loadingCancelResponse,
    individualTrainingDetails,
    patchTrainingSelection,
    patchTrainingSelectionSuccess,
    patchTrainingSelectionFail,
    setTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen,
  } = usePdcApprovalsStore((state) => ({
    loadingCancelResponse: state.loading.loadingResponse,
    individualTrainingDetails: state.individualTrainingDetails,
    patchTrainingSelection: state.patchTrainingSelection,
    patchTrainingSelectionSuccess: state.patchTrainingSelectionSuccess,
    patchTrainingSelectionFail: state.patchTrainingSelectionFail,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen: state.setConfirmTrainingModalIsOpen,
  }));

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const handleSubmit = () => {
    if (tokenId) {
      let data;
      if (
        employeeDetail.employmentDetails.isPdcChairman &&
        individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
      ) {
        //for chairman
        data = {
          pdcChairman: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
          remarks: remarks,
        };
      } else if (employeeDetail.employmentDetails.isPdcSecretariat) {
        //for secretary
        data = {
          pdcSecretariat: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
          remarks: remarks,
        };
      } else if (
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
      ) {
        data = {
          //for GM
          generalManager: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
          remarks: remarks,
        };
      } else if (
        employeeDetail.employmentDetails.isPdcChairman &&
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
      ) {
        //for chairman and GM at the same time but approving as chairman
        data = {
          pdcChairman: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
          remarks: remarks,
        };
      } else if (
        employeeDetail.employmentDetails.isPdcChairman &&
        (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
          isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
        individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
      ) {
        //for chairman and GM at the same time but approving as GM
        data = {
          generalManager: employeeDetail.employmentDetails.userId,
          trainingDetails: individualTrainingDetails.trainingId,
          remarks: remarks,
        };
      }

      patchTrainingSelection();
      handlePatchResult(data);
    } else {
      //nothing to do
    }
  };

  const handlePatchResult = async (data: PdcSecretariatApproval | PdcChairmanApproval | PdcGeneralManagerApproval) => {
    const { error, result } = await patchPortal(
      employeeDetail.employmentDetails.isPdcChairman
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/decline/chairman`
        : employeeDetail.employmentDetails.isPdcSecretariat
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/decline/secretariat`
        : !employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/decline/gm`
        : employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
          individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/decline/chairman`
        : employeeDetail.employmentDetails.isPdcChairman &&
          (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
            isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
          individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
        ? `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/decline/gm`
        : null,
      data
    );
    if (error) {
      patchTrainingSelectionFail(result);
    } else {
      patchTrainingSelectionSuccess(result);
      closeModalAction(); // close confirmation of decline modal
      setTimeout(() => {
        setTrainingModalIsOpen(false); // close training details modal
      }, 200);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
      <Modal.Header>
        <h3 className="font-semibold text-xl text-gray-700">
          <div className="px-5 flex justify-between">
            <span>Disapprove Training</span>
          </div>
        </h3>
      </Modal.Header>
      <Modal.Body>
        {loadingCancelResponse ? (
          <AlertNotification
            logo={<LoadingSpinner size="xs" />}
            alertType="info"
            notifMessage={'Processing'}
            dismissible={false}
          />
        ) : null}
        <div className="w-full h-full flex flex-col gap-2 text-lg text-left px-4">
          {`Are you sure you want to disapprove this Training?`}
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
  );
};
