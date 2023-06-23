/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import {
  ScheduleSheet,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: ScheduleSheet;
};

const DeleteStationSsModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    deleteScheduleSheet,
    deleteScheduleSheetFail,
    deleteScheduleSheetSuccess,
  } = useScheduleSheetStore((state) => ({
    IsLoading: state.loading.loadingScheduleSheet,

    deleteScheduleSheet: state.deleteScheduleSheet,
    deleteScheduleSheetSuccess: state.deleteScheduleSheetSuccess,
    deleteScheduleSheetFail: state.deleteScheduleSheetFail,
  }));

  const { handleSubmit } = useForm<ScheduleSheet>();

  const onSubmit: SubmitHandler<ScheduleSheet> = () => {
    if (!isEmpty(rowData.id)) {
      deleteScheduleSheet();

      handleDeleteResult();
    }
  };

  const handleDeleteResult = async () => {
    const { error, result } = await deleteEmpMonitoring(
      `/travel-order/${rowData.id}`
    );

    if (error) {
      deleteScheduleSheetFail(result);
    } else {
      deleteScheduleSheetSuccess(result);

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

          <form onSubmit={handleSubmit(onSubmit)} id="deleteStationSs">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
                  Are you sure you want to delete entry
                  <span className="px-2 font-bold text-center text-md">
                    {JSON.stringify(rowData.customGroupId)}
                  </span>
                  ?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteStationSs"
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

export default DeleteStationSsModal;
