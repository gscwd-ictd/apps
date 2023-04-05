/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { useHolidaysStore } from 'apps/employee-monitoring/src/store/holidays.store';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Holiday } from '../../../../../../src/utils/types/holiday.type';

type DeleteHolidayModal = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Holiday;
};

const EditHolidayModal: FunctionComponent<DeleteHolidayModal> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    DeleteHoliday,
    DeleteHolidaySuccess,
    DeleteHolidayFail,
  } = useHolidaysStore((state) => ({
    IsLoading: state.loading.loadingHoliday,

    DeleteHoliday: state.deleteHoliday,
    DeleteHolidaySuccess: state.deleteHolidaySuccess,
    DeleteHolidayFail: state.deleteHolidayFail,
  }));

  const { handleSubmit } = useForm<Holiday>();

  const onSubmit: SubmitHandler<Holiday> = () => {
    if (!isEmpty(rowData.id)) {
      // set loading to true
      DeleteHoliday(true);

      handleDeleteResult();
    }
  };

  const handleDeleteResult = async () => {
    const { error, result } = await deleteEmpMonitoring(
      `/holidays/${rowData.id}`
    );

    if (error) {
      // request is done so set loading to false
      DeleteHolidayFail(false, result);
    } else {
      // request is done so set loading to false
      DeleteHolidaySuccess(false, result);

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

          <form onSubmit={handleSubmit(onSubmit)} id="deleteHolidayForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 text-md font-medium text-center text-gray-600">
                  Are you sure you want to delete entry
                  <span className="px-2 text-md text-center font-bold">
                    {JSON.stringify(rowData.name)}
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
              form="deleteHolidayForm"
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

export default EditHolidayModal;
