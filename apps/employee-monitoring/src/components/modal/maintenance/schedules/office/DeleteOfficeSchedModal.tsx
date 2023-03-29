import { Modal } from '@gscwd-apps/oneui';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Schedule;
};

const DeleteOfficeSchedModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { handleSubmit } = useForm<Schedule>();

  const {
    IsLoading,
    DeleteSchedule,
    DeleteScheduleFail,
    DeleteScheduleSuccess,
  } = useScheduleStore((state) => ({
    IsLoading: state.loading.loadingSchedules,
    DeleteResponse: state.schedule.deleteResponse,
    DeleteSchedule: state.deleteSchedule,
    DeleteScheduleSuccess: state.deleteScheduleSuccess,
    DeleteScheduleFail: state.deleteScheduleFail,
  }));

  const onSubmit: SubmitHandler<Schedule> = () => {
    if (!isEmpty(rowData.id)) {
      // set to true
      DeleteSchedule(true);

      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(`/schedule/${id}`);

    if (error) {
      // request is done so set loading to false
      DeleteScheduleFail(false, result);
    } else {
      // request is done so set loading to false
      DeleteScheduleSuccess(false, result);

      // close modal
      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">Confirm Deletion</span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded"
              type="button"
              onClick={closeModalAction}
            >
              x
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="deleteoffschedmodal">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <span className="px-2 text-lg">{rowData.name}</span>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              type="button"
              onClick={closeModalAction}
              className="disabled:cursor-not-allowed w-[4rem] text-black bg-white active:bg-gray-200 hover:bg-gray-100 rounded border border-gray-200"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">No</span>
            </button>
            <button
              type="submit"
              form="deleteoffschedmodal"
              className="disabled:cursor-not-allowed w-[4rem] bg-red-500 hover:bg-red-400 active:bg-red-300 rounded text-white"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Yes</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteOfficeSchedModal;
