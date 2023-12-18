/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { OvertimeImmediateSupervisor } from 'libs/utils/src/lib/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: OvertimeImmediateSupervisor;
};

const DeleteImmediateSupervisorModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand initialization for unassigning of immediate supervisor for overtime application
  const {
    SetUnassignImmediateSupervisor,

    SetErrorUnassignImmediateSupervisor,

    EmptyResponse,
  } = useOvertimeStore((state) => ({
    SetUnassignImmediateSupervisor: state.setUnassignImmediateSupervisor,

    SetErrorUnassignImmediateSupervisor: state.setErrorUnassignImmediateSupervisor,

    EmptyResponse: state.emptyResponse,
  }));

  const {
    handleSubmit,
    formState: { isSubmitting: deleteFormLoading },
  } = useForm();

  const onSubmit = () => {
    if (!isEmpty(rowData.id)) {
      EmptyResponse();
      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (immediateSupervisorId: string) => {
    const { error, result } = await deleteEmpMonitoring(`/overtime/immediate-supervisors/${immediateSupervisorId}`);

    if (error) {
      SetErrorUnassignImmediateSupervisor(result);
    } else {
      SetUnassignImmediateSupervisor(result);

      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {deleteFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="deleteTravelOrderForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
                  Are you sure you want remove{' '}
                  <span className="px-2 font-bold text-center text-md">
                    {JSON.stringify(rowData.immediateSupervisorName)}
                  </span>
                  as Immediate Supervisor?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteTravelOrderForm"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={deleteFormLoading ? true : false}
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
    </>
  );
};

export default DeleteImmediateSupervisorModal;
