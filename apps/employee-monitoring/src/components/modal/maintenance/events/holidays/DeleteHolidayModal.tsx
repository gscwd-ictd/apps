/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
  ToastNotification,
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
    HolidayDeleteResponse,
    IsLoading,
    Error,

    DeleteHoliday,
    DeleteHolidaySuccess,
    DeleteHolidayFail,
  } = useHolidaysStore((state) => ({
    HolidayDeleteResponse: state.holiday.deleteResponse,
    IsLoading: state.loading.loadingHoliday,
    Error: state.error.errorHoliday,

    DeleteHoliday: state.deleteHoliday,
    DeleteHolidaySuccess: state.deleteHolidaySuccess,
    DeleteHolidayFail: state.deleteHolidayFail,
  }));

  const { reset, handleSubmit } = useForm<Holiday>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<Holiday> = () => {
    if (!isEmpty(rowData.id)) {
      // set loading to true
      // DeleteHoliday(true);
      // handleDeleteResult();
    }
  };

  const handleDeleteResult = async () => {
    const { error, result } = await deleteEmpMonitoring(
      `/holidays/${rowData.id}`
    );

    if (error) {
      // request is done so set loading to false
      DeleteHoliday(false);

      // set value for error message
      DeleteHolidayFail(false, result);
    } else {
      // request is done so set loading to false
      DeleteHoliday(false);

      // set value from returned response
      DeleteHolidaySuccess(false, result);

      reset();
      closeModalAction();
    }
  };

  return (
    <>
      {/* Notifications */}
      {!isEmpty(Error) ? (
        <ToastNotification toastType="error" notifMessage={Error} />
      ) : null}

      {!isEmpty(HolidayDeleteResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Deleted successfully"
        />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
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
            <p className="text-sm text-center">
              Are you sure you want to delete entry{' '}
              {JSON.stringify(rowData.name)}
            </p>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="deleteHolidayForm"
              className="text-gray-400 ml-1 disabled:cursor-not-allowed"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Confirm</span>
            </Button>

            <Button
              variant="danger"
              className="text-gray-400 ml-1"
              onClick={closeModalAction}
            >
              <span className="text-xs font-normal">Cancel</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditHolidayModal;
