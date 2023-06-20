/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import {
  AlertNotification,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import {
  EmployeeWithSchedule,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { isEmpty } from 'lodash';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeWithSchedule;
};

const DeleteEmpSchedModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,
    errorEmployeeSchedule,
    deleteEmployeeSchedule,
    deleteEmployeeScheduleSuccess,
    deleteEmployeeScheduleFail,
  } = useScheduleSheetStore((state) => ({
    IsLoading: state.loading.loadingScheduleSheet,

    deleteEmployeeSchedule: state.deleteEmployeeSchedule,
    deleteEmployeeScheduleSuccess: state.deleteEmployeeScheduleSuccess,
    deleteEmployeeScheduleFail: state.deleteEmployeeScheduleFail,
    errorEmployeeSchedule: state.error.errorEmployeeSchedule,
  }));

  const { handleSubmit } = useForm<EmployeeWithSchedule>();

  const onSubmit: SubmitHandler<EmployeeWithSchedule> = () => {
    if (!isEmpty(rowData.id)) {
      deleteEmployeeSchedule();

      handleDeleteResult(rowData);
    }
  };

  const onClose = () => {
    closeModalAction();
  };

  const handleDeleteResult = async (rowData: EmployeeWithSchedule) => {
    const { error, result } = await deleteEmpMonitoring('/employee-schedule/', {
      data: {
        employeeId: rowData.employeeId,
        dateFrom: rowData.dateFrom,
        dateTo: rowData.dateTo,
      },
    });

    if (error) {
      deleteEmployeeScheduleFail(result);
    } else if (!error) {
      deleteEmployeeScheduleSuccess(result);

      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {IsLoading ? (
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
                  Are you sure you want to delete this entry?
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
              disabled={IsLoading ? true : false}
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

export default DeleteEmpSchedModal;
