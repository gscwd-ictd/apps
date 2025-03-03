/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { deletePortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';

type ModalProps = {
  modalState: boolean;
  name: string;
  employeeId: string;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const RemoveEmployeeModal = ({ modalState, name, employeeId, setModalState, closeModalAction }: ModalProps) => {
  const { overtimeDetails, removeEmployee, removeEmployeeSuccess, removeEmployeeFail, removeEmployeeFromOvertime } =
    useApprovalStore((state) => ({
      overtimeDetails: state.overtimeDetails,
      setOvertimeDetails: state.setOvertimeDetails,
      removeEmployee: state.removeEmployee,
      removeEmployeeSuccess: state.removeEmployeeSuccess,
      removeEmployeeFail: state.removeEmployeeFail,
      removeEmployeeFromOvertime: state.removeEmployeeFromOvertime,
    }));

  const handleCancel = async () => {
    const data = {
      employeeId: employeeId,
      overtimeApplicationId: overtimeDetails.id,
    };
    removeEmployee();
    const { error, result } = await deletePortal(`/overtime-applications/employee/manager`, data);
    if (error) {
      removeEmployeeFail(result);
    } else {
      removeEmployeeSuccess(result);
      removeEmployeeFromOvertime(result?.employeeId, overtimeDetails.employees);
      closeModalAction();
      setTimeout(() => {
        // setPendingOvertimeModalIsOpen(true);
        // setCompletedOvertimeModalIsOpen(false);
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
              <span>Remove Employee</span>
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
          <div className="w-full h-full flex flex-col gap-0 text-lg text-center px-4">
            <label>Are you sure you want to remove</label>
            <label className="text-red-600 font-bold">{name}</label>
            <label>from this Overtime application?</label>
            <label className="text-sm text-red-600 pt-4">Note: This action is final and cannot be undone.</label>
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

export default RemoveEmployeeModal;
